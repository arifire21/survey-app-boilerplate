import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request) {
  const  body = await request.json()
  const {name, matchNumber, matchType, teamNumber, color, startPos,
        autoLine, autoAmpCount, autoSpeakerCount,
        teleAmpCount, teleSpeakerCount, amplifyCount,
        parkOrClimb, endClimbSuccess, endScoreClimb, endThrow,
        endHumanCount, defense, robotDisabled, comments} = body
 
  try {
    if (teamNumber==='' || !name || matchNumber == 0 || !matchType || !color || !startPos) return NextResponse.json({ error }, { status: 400 });

    await sql`INSERT INTO MatchResults (name, match_number, match_type, team_number, alliance, start_pos, cross_auto_line, auto_amp, auto_speaker, tele_amp, tele_speaker, amplify_count, park_climb, climb_success, score_climb, hp_throw, hp_score, defense, lost_comms_disabled, comments)
              VALUES (${name}, ${matchNumber}, ${matchType}, ${teamNumber},
                ${color}, ${startPos},
                ${autoLine}, ${autoAmpCount}, ${autoSpeakerCount},
                ${teleAmpCount}, ${teleSpeakerCount},
                ${amplifyCount}, ${parkOrClimb},
                ${endClimbSuccess}, ${endScoreClimb},
                ${endThrow}, ${endHumanCount},
                ${defense}, ${robotDisabled}, ${comments});`;
  } catch (error) {
    return NextResponse.json({ error }, { message: 'check INSERT INTO statement!', status: 500 });
  }
   return NextResponse.json({message: 'Successfully added row!', status: 200 });
}

export async function GET(request) {
  try {
    const results = await sql`SELECT * FROM MatchResults;`;
    return NextResponse.json({ results: results.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}