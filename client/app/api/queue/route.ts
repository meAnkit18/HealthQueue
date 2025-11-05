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

    // Get the next queue number for the department
    const lastPatient = await Patient.findOne({ department })
      .sort({ queueNumber: -1 })
      .select('queueNumber');
    const queueNumber = (lastPatient?.queueNumber || 0) + 1;

    // Generate registration ID
    const registrationId = `REG-${new Date().getFullYear()}-${String(queueNumber).padStart(3, '0')}`;

    const newPatient = new Patient({
      name,
      age,
      gender,
      phoneNumber: phone,
      department,
      doctor,
      checkInTime: new Date(),
      queueNumber,
      registrationId,
      status: 'waiting',
      estimatedWaitTime: 20 // Default wait time
    });

    await newPatient.save();
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update patient status
export async function PUT(req: Request) {
  await dbConnect();

  try {
    const cookieStore = cookies();
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