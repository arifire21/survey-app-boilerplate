import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request) {
  try {
    const result =
      await sql`CREATE TABLE PitResults (
        team_number varchar(5),
        drivetrain varchar(30),
        preferred_pos varchar(20),
        vision varchar(3),
        score_height varchar(10),
        pickup_pos varchar(20),
        can_climb varchar(3),
        help_climb varchar(3),
        score_climb varchar(3),
        investigate varchar(3),
        name varchar(50)
      );`;
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}