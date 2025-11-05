
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Clear all auth-related cookies explicitly. Use the same API as other
    // routes (name, value, options) to avoid runtime signature issues.
    const cookieOpts = {
      path: '/',
      expires: new Date(0),
    };

    response.cookies.set('isLoggedIn', '', cookieOpts);
    response.cookies.set('userType', '', cookieOpts);
    response.cookies.set('userId', '', cookieOpts);

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
