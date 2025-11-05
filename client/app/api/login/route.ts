
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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

    const response = NextResponse.json({ success: true, user }, { status: 200 });
    
    // Set cookies with user information
    response.cookies.set('isLoggedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    response.cookies.set('userType', userType, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60
    });
    response.cookies.set('userId', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60
    });
    
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
