import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import Doctor from '@/lib/models/Doctor';
import { cookies } from 'next/headers';

// Get all patients in queue
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const department = searchParams.get('department');

  try {
    let query = Patient.find({
      status: { $in: ['waiting', 'called', 'in-consultation'] }
    });

    if (department) {
      query = query.where('department').equals(department);
    }

    const patients = await query.sort('checkInTime');
    return NextResponse.json(patients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add patient to queue
export async function POST(req: Request) {
  await dbConnect();

  try {
    const data = await req.json();
    const { name, age, gender, phone, department, doctor } = data;

    // Basic validation
    if (!name || !phone || !department) {
      return NextResponse.json({ error: 'Name, phone and department are required' }, { status: 400 });
    }

    // Ensure phone is a string
    const phoneStr = String(phone || '');

    // Get the next queue number for the department
    const lastPatient = await Patient.findOne({ department })
      .sort({ queueNumber: -1 })
      .select('queueNumber');
    const queueNumber = (lastPatient?.queueNumber || 0) + 1;

    // Generate registration ID
  const registrationId = `REG-${new Date().getFullYear()}-${String(queueNumber).padStart(3, '0')}`;
  const loginCode = `${phoneStr.slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`;

    // If a patient with this phone already exists, update it to act as a new check-in
    const existingPatient = await Patient.findOne({ phoneNumber: phoneStr });
    if (existingPatient) {
      existingPatient.name = name;
      existingPatient.age = age;
      existingPatient.gender = gender;
      existingPatient.department = department;
      existingPatient.doctor = doctor;
      existingPatient.checkInTime = new Date();
      existingPatient.queueNumber = queueNumber;
      existingPatient.registrationId = registrationId;
      existingPatient.status = 'waiting';
      existingPatient.estimatedWaitTime = 20;

      await existingPatient.save();
      const result = existingPatient.toObject ? existingPatient.toObject() : existingPatient;
      return NextResponse.json(result, { status: 200 });
    }

    const newPatient = new Patient({
      name,
      age,
      gender,
      phoneNumber: phoneStr,
      department,
      doctor,
      checkInTime: new Date(),
      queueNumber,
      registrationId,
      loginCode,
      status: 'waiting',
      estimatedWaitTime: 20 // Default wait time
    });

    await newPatient.save();

    // Convert mongoose doc to plain object before returning
    const result = newPatient.toObject ? newPatient.toObject() : newPatient;

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Queue POST error:', error);
    // Duplicate key (e.g., phoneNumber unique) -> return 409 with message
    // @ts-ignore
    if (error && (error.code === 11000 || error.code === '11000')) {
      // @ts-ignore
      const key = error.keyValue ? Object.keys(error.keyValue)[0] : 'duplicate_field';
      return NextResponse.json({ error: `Duplicate value for ${key}` }, { status: 409 });
    }

    // If the error has a message, surface it for easier client debugging
    // @ts-ignore
    const message = error?.message || 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Update patient status
export async function PUT(req: Request) {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const userType = cookieStore.get('userType')?.value;
    const userId = cookieStore.get('userId')?.value;

    if (userType !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await req.json();
    const { patientId, status } = data;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { status },
      { new: true }
    );

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Update doctor's current patient if needed
    if (status === 'in-consultation') {
      await Doctor.findByIdAndUpdate(userId, { 
        currentPatient: patientId,
        status: 'busy'
      });
    } else if (status === 'completed') {
      await Doctor.findByIdAndUpdate(userId, { 
        currentPatient: null,
        status: 'available'
      });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}