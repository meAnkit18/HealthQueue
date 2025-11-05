import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';

export async function GET(request: Request) {
  try {
    await dbConnect();
    console.log('Database connected successfully');

    const cookieStore = await cookies();
    const userType = cookieStore.get('userType')?.value;
    const userId = cookieStore.get('userId')?.value;

    console.log('Auth check:', { userType, userId });

    if (!userType || !userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (userType !== 'doctor') {
      return NextResponse.json({ error: 'Only doctors can access patient list' }, { status: 403 });
    }

    try {
      // Get all patients, sorted by registration date (newest first)
      const patients = await Patient.find({})
        .select('name phoneNumber createdAt status')
        .sort({ createdAt: -1 })
        .lean(); // Convert to plain JavaScript objects

      console.log(`Found ${patients.length} patients`);
      
      // Ensure each patient has required fields and status
      const sanitizedPatients = patients.map((patient: any) => ({
        _id: patient._id.toString(),
        name: patient.name || 'Unknown',
        phoneNumber: patient.phoneNumber || '',
        createdAt: patient.createdAt || new Date(),
        status: patient.status || 'registered'
      }));

      return NextResponse.json({ 
        success: true,
        patients: sanitizedPatients,
        meta: {
          total: sanitizedPatients.length
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to fetch patient data from database');
    }
  } catch (error) {
    console.error('Patient list error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch patients',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}