"use client"
import MenuButton from "@/components/menu-button";
import { CircularProgress } from "@mui/joy";
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import AccordionGroup from '@mui/joy/AccordionGroup';
import { accordionSummaryClasses, accordionDetailsClasses } from '@mui/joy'
import { useState, useEffect } from "react";

export default function ViewMatchResultsPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE;

    const [matchLoading, isMatchLoading] = useState(true)
    const [fetchedMatchResults, setMatchResults] = useState([]);
    const [isMatchEmpty, setMatchEmpty] = useState(false)
    const [requestFail, setRequestFail] = useState(false)

    function matchDataHelper(results){ //relying on state in getData does not work because of state's delayed updating
      if(results.length == 0){
        setMatchEmpty(true)
        return true;
      }

      // if mun is different, sort on that, if num is same, sort by color
      let sortedByNumberAndColor = results.sort((a, b) => a.match_number - b.match_number || (b.alliance).localeCompare(a.alliance))
      console.log(sortedByNumberAndColor)
      setMatchResults(sortedByNumberAndColor)
    }

    const getData = async () => {
      let fetchString = '/api/match-result' //default
      if(isDevMode == "true"){
        fetchString = '/api/dev/match-result'
      }
      
      await fetch(fetchString, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if(!res.ok){
          console.log('Check Internet Connection')
          setMatchEmpty(true)
          setRequestFail(true)
        }
        else {
          res.json() // Parse the response data as JSON
        }
      }) 
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
        
        <h1>Match Survey Results</h1>
        {requestFail && requestFail && (
          <p><strong>API Request Failed</strong>: Check your internet connection and try again!</p>
        )}

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
              <h3 className={`pit-results-number ${item.alliance === 'red' ? 'red-alliance' : 'blue-alliance'}`}>{item.match_type} {item.match_number}</h3>
              <h3 className={`pit-results-number ${item.alliance === 'red' ? 'red-alliance' : 'blue-alliance'}`}>Team {item.team_number}</h3>

              <AccordionGroup
                sx={{
                  // maxWidth: 400,
                  borderRadius: 'lg',
                  [`& .${accordionSummaryClasses.button}:hover`]: {
                    bgcolor: `${item.alliance === 'red' ? '#ff00083e' : 'rgba(62, 100, 130, 0.5)'} !important`,
                  },
                  [`& .${accordionSummaryClasses.button}:active`]: {
                    bgcolor: `${item.alliance === 'red' ? '#ff00083e' : 'rgba(62, 100, 130, 0.5)'} !important`,
                  },
                  [`& .${accordionDetailsClasses.content}`]: {
                    boxShadow: (theme) => `inset 0 1px ${theme.vars.palette.divider}`,
                    [`&.${accordionDetailsClasses.expanded}`]: {
                      // paddingBlock: '0.75rem',
                      bgcolor: `${item.alliance === 'red' ? '#ff00083e' : 'rgba(62, 100, 130, 0.5)'} !important`,
                    },
                  },
                }}
              >
                <Accordion variant="plain">
                  <AccordionSummary variant="outlined">Details</AccordionSummary>
                  <AccordionDetails variant="outlined">
                    <p>Starting Pos: <strong>{item.start_pos}</strong></p>

                    <h4 className="match-section-header">Auto</h4>
                    <p className="detail match-detail">Crossed Auto Line: <strong>{item.cross_auto_line}</strong></p>
                    {item.cross_auto_line && item.cross_auto_line === 'yes' && (
                      <div className="result-flex match-detail">
                        <p style={{marginRight:'0.5rem'}}>Amp Count: <strong>{item.auto_amp}</strong></p>
                        <p>Speaker Count: <strong>{item.auto_speaker}</strong></p>
                      </div>
                    )}

                    <h4 className="match-section-header">Teleop</h4>
                    <div className="result-flex match-detail">
                      <p style={{marginRight:'0.5rem'}}>Amp Count: <strong>{item.tele_amp}</strong></p>
                      <p>Speaker Count: <strong>{item.tele_speaker}</strong></p>
                    </div>
                    <p className="detail match-detail">Amplify Pressed: <strong>{item.amplify_count}</strong></p>

                    <h4 className="match-section-header">Endgame</h4>
                    <p className="detail match-detail">Parked or climbed: <strong>{item.park_climb}</strong></p>
                    {item.park_climb && item.park_climb === 'climb' && (
                      <>
                        <p className="detail match-detail">Climbed successfully: <strong>{item.climb_success}</strong></p>
                        <p className="detail match-detail">Scored while climbing: <strong>{item.score_climb}</strong></p>
                      </>
                    )}
                    {item.hp_throw && item.hp_throw === 'yes' && (
                        <p className="detail match-detail">HP spotlighted: <strong>{item.hp_score}/3</strong></p>
                    )}
                    <h4 className="match-section-header">Info</h4>
                    <p className="detail match-detail">Defense rating: <strong>{item.defense}/5</strong></p>
                    <p className="detail match-detail">Lost comms or disabled: <strong>{item.lost_comms_disabled}</strong></p>
                    {item.comments && item.comments.length > 0 && <p>Post-Match Comments: {item.comments}</p>}
                    <small>Survey by: <strong>{item.name}</strong></small>
                </AccordionDetails>
                </Accordion>
              </AccordionGroup>
            </div>
            )
          })}
          </div> //end pit container
        )}
        </>
    )
}