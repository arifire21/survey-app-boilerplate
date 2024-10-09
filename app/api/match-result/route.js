import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request) {
  const  body = await request.json()
  const {name, matchNumber, matchType, teamNumber, color, startPos,
        autoLine, autoAmpCount, autoSpeakerCount,
        teleAmpCount, teleSpeakerCount, amplifyCount,
        parkOrClimb, endClimbSuccess, endScoreClimb, endThrow,
        endHumanCount, defense, robotDisabled, comments, allianceWin} = body
 
  try {
    if (teamNumber==='' || !name || matchNumber == 0 || !matchType || !color || !startPos) return NextResponse.json({ error }, { status: 400 });

    await sql`INSERT INTO MatchResults (name, match_number, match_type, team_number, alliance, start_pos, cross_auto_line, auto_amp, auto_speaker, tele_amp, tele_speaker, amplify_count, park_climb, climb_success, score_climb, hp_throw, hp_score, defense, lost_comms_disabled, comments, alliance_win)
              VALUES (${name}, ${matchNumber}, ${matchType}, ${teamNumber},
                ${color}, ${startPos},
                ${autoLine}, ${autoAmpCount}, ${autoSpeakerCount},
                ${teleAmpCount}, ${teleSpeakerCount},
                ${amplifyCount}, ${parkOrClimb},
                ${endClimbSuccess}, ${endScoreClimb},
                ${endThrow}, ${endHumanCount},
                ${defense}, ${robotDisabled}, ${comments}, ${allianceWin});`;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { message: 'check INSERT INTO statement!', status: 500 });
  }
   return NextResponse.json({message: 'Successfully added row!', status: 200 });
}

export async function GET(request) {
  try {
/*  this ORDER BY sequence is done in order of importance, so organization is easier
    - match NUMBER is before match TYPE so all "Practice" matches are bundled together ("Practice 1, Practice 2, Qual 1 etc")
    - alliance DESC so it matches common robotics order of Red v Blue (technically is reverse alphabetical)
    - team number to look pretty? is assuming results may not be submitted in match-specific order?*/
    const results = await sql`SELECT * FROM MatchResults ORDER BY match_number, match_type, alliance DESC, team_number;`;
    //testing: arrays per each type, put into one big array so it can be sent via response
    const practiceMatches = {}, qualMatches = {}, playoffMatches = {}, finalMatches = {};
    
    // Loop through results once, filter and group matches by both match type and match number
    results.rows.forEach(row => {
      const matchNumber = row.match_number;

      // Group based on match type
      switch (row.match_type) {
        case 'Practice':
          if (!practiceMatches[matchNumber]) practiceMatches[matchNumber] = [];
          practiceMatches[matchNumber].push(row);
          break;
        case 'Qual':
          if (!qualMatches[matchNumber]) qualMatches[matchNumber] = [];
          qualMatches[matchNumber].push(row);
          break;
        case 'Playoff':
          if (!playoffMatches[matchNumber]) playoffMatches[matchNumber] = [];
          playoffMatches[matchNumber].push(row);
          break;
        case 'Final':
          if (!finalMatches[matchNumber]) finalMatches[matchNumber] = [];
          finalMatches[matchNumber].push(row);
          break;
        default:
          console.warn('Unexpected match type:', row.match_type);
      }
    });

    // Convert the objects into arrays (or leave them as objects if that's preferred)
    const practiceMatchesArray = Object.values(practiceMatches);
    const qualMatchesArray = Object.values(qualMatches);
    const playoffMatchesArray = Object.values(playoffMatches);
    const finalMatchesArray = Object.values(finalMatches);

    return NextResponse.json({ results: {practiceMatchesArray, qualMatchesArray, playoffMatchesArray, finalMatchesArray} }, { status: 200 });
  } catch (error) {
    if(error.message === 'Error connecting to database: fetch failed'){
      return NextResponse.json({ error: 'Error connecting to database: fetch failed\nCheck Internet connection!' }, { status: 500 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}