
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import Doctor from '@/lib/models/Doctor';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const phoneNumber = String(body.phoneNumber || '').trim();
    const loginCode = String(body.loginCode || '').trim();
    const userType = String(body.userType || '').trim();

    if (!phoneNumber || !loginCode || !userType) {
      return NextResponse.json({ error: 'Phone number, login code, and user type are required' }, { status: 400 });
    }

    let user;
    if (userType === 'patient') {
      user = await Patient.findOne({ phoneNumber: phoneNumber, loginCode: loginCode });
    } else if (userType === 'doctor') {
      user = await Doctor.findOne({ phoneNumber: phoneNumber, loginCode: loginCode });
    } else {
      return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
    }

    if (!user) {
      console.log('Login failed - no user found for', { userType, phoneNumber, loginCode });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // remove sensitive fields before sending back
    const userObj = user.toObject ? user.toObject() : user;
    if (userObj.loginCode) delete userObj.loginCode;

    const response = NextResponse.json({ success: true, user: userObj }, { status: 200 });
    
    // Set cookies with user information
    response.cookies.set('isLoggedIn', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    response.cookies.set('userType', userType, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });
    response.cookies.set('userId', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });
    
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
