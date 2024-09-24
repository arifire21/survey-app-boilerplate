import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request) {
  const  body = await request.json()
  const {teamNumber,drivetrain, prefPos, vision,
        scoreHeight, pickup, climb, helpClimb,
        scoreClimb, investigate, feedback, name,
        frontImageURL, sideImageURL} = body
 
  try {
    if (!teamNumber || !drivetrain || ! prefPos || !vision
      || !scoreHeight || !pickup || !climb || !investigate || !name) return NextResponse.json({ error }, { status: 400 });

    await sql`INSERT INTO PitResults (team_number, drivetrain, preferred_pos, vision, score_height, pickup_pos, can_climb, help_climb, score_climb, feedback, name, front_img_url, side_img_url)
              VALUES (${teamNumber}, ${drivetrain}, ${prefPos}, ${vision}, ${scoreHeight}, ${pickup}, ${climb}, ${helpClimb}, ${scoreClimb}, ${feedback}, ${name}, ${frontImageURL}, ${sideImageURL});`;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { message: 'check INSERT INTO statement!', status: 500 });
  }
   return NextResponse.json({message: 'Successfully added row!', status: 200 });
}

export async function GET(request) {
  try {
    const results = await sql`SELECT * FROM PitResults;`;
    return NextResponse.json({ results: results.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}