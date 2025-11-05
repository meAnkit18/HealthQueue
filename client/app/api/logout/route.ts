
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set({
      name: 'isLoggedIn',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
