import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/lib/models/Doctor';

export async function GET() {
  await dbConnect();

  try {
    const doctors = await Doctor.find().select('name phoneNumber -_id');
    return NextResponse.json({ doctors });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}