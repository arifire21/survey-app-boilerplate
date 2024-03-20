"use client"
import MenuButton from "@/components/menu-button";
import { CircularProgress } from "@mui/joy";
import { useState, useEffect } from "react";

export default function ViewMatchResultsPage() {
    const [matchLoading, isMatchLoading] = useState(true)
    const [fetchedMatchResults, setMatchResults] = useState([]);
    const [isMatchEmpty, setMatchEmpty] = useState(false)

    function matchDataHelper(results){ //relying on state in getData does not work because of state's delayed updating
      setMatchResults(results)
      // console.log(results)

      if(results.length == 0){
        setMatchEmpty(true)
      }
    }

    const getData = async () => {
      await fetch("/api/match-result", {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
      })
      .then((res) => res.json()) // Parse the response data as JSON
      .then((data) => {matchDataHelper(data.results)})
      .catch( err => console.log(err) );

      isMatchLoading(false)
    }

    useEffect(() => {
      getData()
    }, []);

    return(
        <>
        <MenuButton/>
        
        <h1>Survey Results</h1>
        <h2>Match Survey</h2>
        {matchLoading
        ? <div style={{display:'flex', textAlign:'center'}}>
            <p>Loading...   </p><CircularProgress variant="soft" size="sm"/>
          </div>
        : (isMatchEmpty && isMatchEmpty == true)
        ? <p>No results yet!</p>
        : (
          <div className="pit-results-container">
          {fetchedMatchResults.map((item, index) => {
            return(
            <div key={index} className={`item-container ${item.alliance === 'red' ? 'red-backdrop' : 'blue-backdrop'}`}>
              <h3 className={`pit-results-number ${item.alliance === 'red' ? 'red-alliance' : 'blue-alliance'}`}>{item.team_number}</h3>
              <h3 className={`pit-results-number ${item.alliance === 'red' ? 'red-alliance' : 'blue-alliance'}`}>{item.match_type} {item.match_number}</h3>
              <p>Starting Pos: <strong>{item.start_pos}</strong></p>

              <h4>Auto</h4>
              <p>Crossed Auto Line: <strong>{item.cross_auto_line}</strong></p>
              {item.cross_auto_line && item.cross_auto_line === 'yes' && (
                <div className="result-flex">
                  <p>Amp Count: <strong>{item.auto_amp}</strong></p>
                  <p>Speaker Count: <strong>{item.auto_speaker}</strong></p>
                </div>
              )}

              <h4>Teleop</h4>
              <div className="result-flex">
                <p>Amp Count: <strong>{item.tele_amp}</strong></p>
                <p>Speaker Count: <strong>{item.tele_speaker}</strong></p>
              </div>
              <p>Amplify Pressed: <strong>{item.amplify_count}</strong></p>

              <h4>Endgame</h4>
              <p>Parked or climbed: <strong>{item.park_climb}</strong></p>
              {item.park_climb && item.park_climb === 'climb' && (
                <>
                  <p>Climbed successfully: <strong>{item.climb_success}</strong></p>
                  <p>Scored while climbing: <strong>{item.score_climb}</strong></p>
                </>
              )}
              {item.hp_throw && item.hp_throw === 'yes' && (
                  <p>HP spotlighted: <strong>{item.hp_score}/3</strong></p>
              )}
              <br/>
              <p>Defense rating: <strong>{item.defense}/5</strong></p>
              <p>Lost comms or disabled: <strong>{item.lost_comms_disabled}</strong></p>
              {item.comments && item.comments.length > 0 && <p>Post-Match Comments: {item.comments}</p>}
              <small>Survey by: <strong>{item.name}</strong></small>
            </div>
            )
          })}
          </div>
        )}
        </>
    )
}