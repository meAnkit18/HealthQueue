
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import Doctor from '@/lib/models/Doctor';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { phoneNumber, loginCode, userType } = await req.json();

    if (!phoneNumber || !loginCode || !userType) {
      return NextResponse.json({ error: 'Phone number, login code, and user type are required' }, { status: 400 });
    }

    let user;
    if (userType === 'patient') {
      user = await Patient.findOne({ phoneNumber, loginCode });
    } else if (userType === 'doctor') {
      user = await Doctor.findOne({ phoneNumber, loginCode });
    } else {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
