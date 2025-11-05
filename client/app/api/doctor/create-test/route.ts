import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/lib/models/Doctor';

export async function POST() {
  await dbConnect();

  try {
    const testDoctor = await Doctor.create({
      name: 'Test Doctor',
      phoneNumber: '1234567890',
      loginCode: '123456',
      department: 'General',
      status: 'available'
    });

    return NextResponse.json({ 
      message: 'Test doctor created successfully',
      phoneNumber: testDoctor.phoneNumber,
      loginCode: '123456'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}