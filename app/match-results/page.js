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
    // const [fetchedMatchResults, setMatchResults] = useState([]);
    const [fetchedPracticeResults, setPracticeResults] = useState([]);
    const [fetchedQualResults, setQualResults] = useState([]);
    const [fetchedPlayoffResults, setPlayoffResults] = useState([]);
    const [fetchedFinalResults, setFinalResults] = useState([]);
    const [isMatchEmpty, setMatchEmpty] = useState(false)
    const [requestFail, setRequestFail] = useState(false)
    const [dataUndef, setUndef] = useState(false)

    useEffect(() => {
      getData()
    }, []);

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
          return null;
        }
        else {
          return res.json() // Parse the response data as JSON
        }
      }) 
      .then((data) => {matchDataHelper(data.results)})
      .catch( err => console.log(err) );

      isMatchLoading(false) //should stay here regardless if empty or not
    }

    function matchDataHelper(results){ //relying on state in getData does not work because of state's delayed updating
      // console.log(results)
      if(results.length == 0){
        setMatchEmpty(true)
        return true;
      }

      //leave for now because there may be a catchall needed if
      //request returns fine (status 200), but have had issues when not
      //explicitly returning the res.json for this method to use
      if (typeof results == 'undefined' || typeof results == null){
        setUndef(true)
        return null;
      }
      
      setPracticeResults(results[0])
      console.log(results[0])
      setQualResults(results[1])
      console.log(results[1])
      setPlayoffResults(results[2])
      console.log(results[2])
      setFinalResults(results[3])
      console.log(results[3])
    }

    return(
        <>
        <MenuButton/>
        
        <h1>Match Survey Results</h1>
        {requestFail && requestFail && (
          <p><strong>API Request Failed</strong>: Check your internet connection and try again!</p>
        )}

        {dataUndef && dataUndef == true && (
          <p><strong>API Request Failed</strong>: response data is undefined, contact admin!</p>
        )}

        {/* is request loading...? */}
        {matchLoading && matchLoading == true
          // ? true, render circular
        ? <div style={{display:'flex', textAlign:'center'}}>
            <p>Loading...   </p><CircularProgress variant="soft" size="sm"/>
          </div>
          // : false, check if whole request array is empty ? true, IS empty, render plain <p> : false, is NOT empty, move on to mapping arrays
        : (isMatchEmpty && isMatchEmpty == true) ? <p>No results yet!</p> : (
          <section>
            <h2>Practice Results</h2>
            {/* check if PRACTICE results array is empty ? true, render plain <p> : false, show results */}
            {fetchedPracticeResults.length == 0 ? <p>No practice matches recorded!</p> : (
              <div className="pit-results-container">
                {fetchedPracticeResults.map((match, index) => (
                  <div key={`match-container-${index}`} id={`match-container-${index}`} className={"item-container"}>
                    <h3 key={`header-${index}`} id={`header-${index}`} className={'match-header'}>Match {index+1}</h3>

                    {match.map((row, index2) => {
                      return( //per Object (orig row from table)
                        <div key={`match-${index}-team-container-${index2}`} id={`match-${index}-team-container-${index2}`} className={`${row.alliance === 'red' ? 'red-backdrop' : 'blue-backdrop'}`}>
                          <AccordionGroup //needed to customize transition and styling
                            sx={{
                              // maxWidth: 400,
                              borderRadius: 'lg',
                              [`& .${accordionSummaryClasses.button}:hover`]: {
                                bgcolor: `${row.alliance === 'red' ? '#ff00083e' : 'rgba(62, 100, 130, 0.5)'} !important`,
                              },
                              [`& .${accordionSummaryClasses.button}:active`]: {
                                bgcolor: `${row.alliance === 'red' ? '#ff00083e' : 'rgba(62, 100, 130, 0.5)'} !important`,
                              },
                              [`& .${accordionDetailsClasses.content}`]: {
                                boxShadow: (theme) => `inset 0 1px ${theme.vars.palette.divider}`,
                                [`&.${accordionDetailsClasses.expanded}`]: {
                                  // paddingBlock: '0.75rem',
                                  bgcolor: `${row.alliance === 'red' ? 'rgba(200, 0, 7, 0.212)' : 'rgba(62, 100, 130, 0.5)'} !important`,
                                },
                              },
                            }}
                          >
                            <Accordion>
                              <AccordionSummary variant="outlined" color={row.alliance === 'red' ? 'danger' : 'primary'}>{row.team_number}</AccordionSummary>
                              <AccordionDetails>
                                <p>Starting Pos: <strong>{row.start_pos}</strong></p>

                                <h4 className="match-section-header">Auto</h4>
                                <p className="detail match-detail">Crossed Auto Line: <strong>{row.cross_auto_line === "" ? '??' : row.cross_auto_line ?? '??'}</strong></p>
                                {row.cross_auto_line && row.cross_auto_line === 'yes' && (
                                  <div className="result-flex match-detail">
                                    <p style={{marginRight:'0.5rem'}}>Amp Count: <strong>{row.auto_amp}</strong></p>
                                    <p>Speaker Count: <strong>{row.auto_speaker}</strong></p>
                                  </div>
                                )}

                                <h4 className="match-section-header">Teleop</h4>
                                <div className="result-flex match-detail">
                                  <p style={{marginRight:'0.5rem'}}>Amp Count: <strong>{row.tele_amp}</strong></p>
                                  <p>Speaker Count: <strong>{row.tele_speaker}</strong></p>
                                </div>
                                <p className="detail match-detail">Amplify Pressed: <strong>{row.amplify_count}</strong> time(s)</p>

                                <h4 className="match-section-header">Endgame</h4>
                                <p className="detail match-detail">Parked or climbed: <strong>{row.park_climb}</strong></p>
                                {row.park_climb && row.park_climb === 'climb' && (
                                  <>
                                    <p className="detail match-detail">Climbed successfully: <strong>{row.climb_success}</strong></p>
                                    <p className="detail match-detail">Scored while climbing: <strong>{row.score_climb}</strong></p>
                                  </>
                                )}
                                {row.hp_throw && row.hp_throw === 'yes' && (
                                    <p className="detail match-detail">HP spotlighted <strong>successfully</strong>: <strong>{row.hp_score}/3</strong> time(s)</p>
                                )}
                                <h4 className="match-section-header">Info</h4>
                                <p className="detail match-detail">Defense rating: <strong>{row.defense}/5</strong></p>
                                <p className="detail match-detail">Lost comms or disabled: <strong>{row.lost_comms_disabled}</strong></p>
                                {row.comments && row.comments.length > 0 && <p style={{width:'100%'}}>Post-Match Comments: {row.comments}</p>}
                                <small>Survey by: {row.name}</small>
                            </AccordionDetails>
                            </Accordion>
                          </AccordionGroup>
                        </div>
                      )
                    })}   {/*end inner match map/render */ }

                  </div>  //end indiv match container
                ))}       {/*end fetchedPracticeResults map/render */ }
              </div>      //end pit container
            )}            {/*end fetchedPracticeResults ternary */ }
          </section>      //end practice section


          )}  {/*end initial isMatchLoading ternary */ }
          </> //pls remember JSX needs a parent element bc of the menubutton :)


               /*<div key={index} className={`item-container ${item.alliance === 'red' ? 'red-backdrop' : 'blue-backdrop'}`}>
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
            </div> */
          //   )
          // })}
          // </div> //end header
          // </div> //end pit container
        // )}
        // </>
    )
}