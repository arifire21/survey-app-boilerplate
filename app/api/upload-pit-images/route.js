import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const frontFilename = searchParams.get('filename_front');
  const sideFilename = searchParams.get('filename_side');

 try {
  const blob = await put(frontFilename, sideFilename, request.body, {
    access: 'public',
  });
 
  return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}