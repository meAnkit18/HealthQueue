import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import Doctor from '@/lib/models/Doctor';

export async function GET() {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const userType = cookieStore.get('userType')?.value;
    const userId = cookieStore.get('userId')?.value;

    if (!userType || !userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let user;
    if (userType === 'patient') {
      user = await Patient.findById(userId).select('-loginCode');
    } else if (userType === 'doctor') {
      user = await Doctor.findById(userId).select('-loginCode');
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user, userType });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}