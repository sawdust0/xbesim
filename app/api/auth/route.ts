import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    const cookieStore = await cookies();
    
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 saat
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Çıkış için yeni endpoint
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    
    // Session cookie'sini sil
    cookieStore.delete('session');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 