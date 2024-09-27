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
    const practiceMatches = [], qualMatches = [], playoffMatches = [], finalMatches = [];
    const matchesPerType = [practiceMatches, qualMatches, playoffMatches, finalMatches]

    const filteredPracticeMatches = results.rows.filter(row => row.match_type === 'Practice');
    let tempPractice = 0;
    filteredPracticeMatches.forEach(m => {
      //test; create arrays per match numbers
      if(m.match_number != tempPractice){
        practiceMatches.push([]);
        tempPractice++;
        // console.log(tempPractice)
      }

      //now put into new match #n array
      if(m.match_number == tempPractice){
        // console.log('in')
        practiceMatches[tempPractice-1].push(m)
      }
    });

    return NextResponse.json({ results: matchesPerType }, { status: 200 });
  } catch (error) {
    if(error.message === 'Error connecting to database: fetch failed'){
      return NextResponse.json({ error: 'Error connecting to database: fetch failed\nCheck Internet connection!' }, { status: 500 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}