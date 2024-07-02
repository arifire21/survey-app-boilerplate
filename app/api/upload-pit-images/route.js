import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  // const sideFilename = searchParams.get('filename_side');
  console.log(filename)
  // console.log(sideFilename)

 try {
  const blob = await put(filename, request.body, {
    access: 'public',
  });
 
  return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}