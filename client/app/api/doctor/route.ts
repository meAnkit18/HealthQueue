
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/lib/models/Doctor';

function generateLoginCode() {
  return Math.random().toString().slice(2, 8);
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { name, phoneNumber } = await req.json();

    if (!name || !phoneNumber) {
      return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 });
    }

    const loginCode = generateLoginCode();

    const newDoctor = new Doctor({
      name,
      phoneNumber,
      loginCode,
    });

    await newDoctor.save();

    return NextResponse.json({ success: true, loginCode }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
