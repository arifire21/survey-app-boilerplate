"use client"
import MenuButton from "@/components/menu-button";
import { CircularProgress } from "@mui/joy";
import Accordion, { accordionClasses } from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import AccordionGroup from '@mui/joy/AccordionGroup';
// import { accordionSummaryClasses, accordionDetailsClasses } from '@mui/joy'
import trophy from '@/images/trophy.png'
import sharkfin from '../favicon.ico'

import { useState, useEffect } from "react";
import Image from "next/image";

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
      
      setPracticeResults(results.practiceMatchesArray)
      setQualResults(results.qualMatchesArray)
      setPlayoffResults(results.playoffMatchesArray)
      setFinalResults(results.finalMatchesArray)
    }

    return(
      <>
      <MenuButton/>
      
      <h1>Match Survey Results</h1>
      {requestFail && requestFail && (
        <p><strong>API Request Failed</strong>: Check your internet connection and try again!</p>
      )}

      {dataUndef && dataUndef == true && (
        <p><strong>API Request Failed</strong>: Response data is undefined, contact admin!</p>
      )}

      {/* is request loading...? */}
      {matchLoading && matchLoading == true
        // ? true, render circular
      ? <div style={{display:'flex', textAlign:'center'}}>
          <p>Loading...   </p><CircularProgress variant="soft" size="sm"/>
        </div>
        // : false, check if whole request array is empty ? true, IS empty, render plain <p> : false, is NOT empty, move on to mapping arrays
      : (isMatchEmpty && isMatchEmpty == true) ? <p>No results yet!</p> : (
        <> {/* parent elem */}
        <section id='practice-section'>
          <h2>Practice Results <small>({fetchedPracticeResults.length})</small></h2>
          {/* check if PRACTICE results array is empty ? true, render plain <p> : false, show results */}
          {fetchedPracticeResults.length == 0 ? <p>No practice matches recorded!</p> : (
            <div className="pit-results-container">
              {fetchedPracticeResults.map((match, index) => (
                <div key={`match-container-${index}`} id={`match-container-${index}`} className="item-container">
                  <h3 key={`header-${index}`} id={`header-${index}`} className='match-number-header'>Match {index+1}</h3>

                  <AccordionGroup  sx={{maxWidth:'400px'}}> {/* to group all 6 accordions together in DOM, per match*/}
                  {match.map((row, index2) => {
                    return( //per Object (orig row from table)
                      <Accordion variant="outlined" key={`match-${index}-team-row-${index2}`}>
                        {/* note: custom color in theme-registry file */}
                        <AccordionSummary variant="solid" color={row.alliance === 'red' ? 'danger' : 'blueAllianceColor'}>
                        {row.team_number} 
                        {row.team_number==='744' && <Image src={sharkfin} alt='fin'/>} 
                        {row.alliance_win=='yes' && <Image src={trophy} alt='trophy' className='match-result-trophy'/>}
                        </AccordionSummary>
                        <AccordionDetails variant="soft" color={row.alliance === 'red' ? 'danger' : 'blueAllianceColor'}> {/* note: overriding font color to white in theme-registry file */}
                          <p>Starting Pos: <strong>{row.start_pos}</strong></p>

                          <h4 className="match-section-header">Auto</h4>
                          <p className="detail match-detail">Crossed Auto Line: <strong>{row.cross_auto_line === "" ? '??' : row.cross_auto_line ?? '??'}</strong></p>
                          {(row.cross_auto_line === 'yes' || row.cross_auto_line === '') && (
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
                          <p className="detail match-detail">Parked or climbed: <strong>{row.park_climb === "" ? '??' : row.park_climb ?? '??'}</strong></p>
                          {(row.park_climb === 'climb' || row.park_climb === '') && (
                            <>
                              <p className="detail match-detail">Climbed successfully: <strong>{row.climb_success ?? 'N/A'}</strong></p>
                              <p className="detail match-detail">Scored while climbing: <strong>{row.score_climb  ?? 'N/A'}</strong></p>
                            </>
                          )}
                          {(row.hp_throw === 'yes' || row.hp_throw === '') && (
                              <p className="detail match-detail">HP spotlighted <strong>successfully</strong>: <strong>{row.hp_score}/3</strong> time(s)</p>
                          )}
                          <h4 className="match-section-header">Info</h4>
                          <p className="detail match-detail">Defense rating: <strong>{row.defense}/5</strong></p>
                          <p className="detail match-detail">Lost comms or disabled: <strong>{row.lost_comms_disabled === "" ? '??' : row.lost_comms_disabled ?? '??'}</strong></p>
                          {row.comments && row.comments.length > 0 && <p style={{width:'100%'}}>Post-Match Comments: {row.comments}</p>}
                          <small>Survey by: {row.name}</small>
                        </AccordionDetails>
                      </Accordion>
                    )
                  })}   {/*end inner match map/render */ }
                  </AccordionGroup>

                </div>  //end indiv match container
              ))}       {/*end fetchedPracticeResults map/render */ }
            </div>      //end pit container
          )}            {/*end fetchedPracticeResults ternary */ }
        </section>      {/*end end practice section */ }

        <section id='qual-section'>
        <h2>Qualification Results <small>({fetchedQualResults.length})</small></h2>
        {/* check if QUAL results array is empty ? true, render plain <p> : false, show results */}
        {fetchedQualResults.length == 0 ? <p>No qualification matches recorded!</p> : (
          <div className="pit-results-container">
            {fetchedQualResults.map((match, index) => (
              <div key={`match-container-${index}`} id={`match-container-${index}`} className="item-container">
                <h3 key={`header-${index}`} id={`header-${index}`} className='match-number-header'>Match {index+1}</h3>

                <AccordionGroup  sx={{maxWidth:'400px'}}> {/* to group all 6 accordions together in DOM, per match*/}
                {match.map((row, index2) => {
                  return( //per Object (orig row from table)
                    <Accordion variant="outlined" key={`match-${index}-team-row-${index2}`}>
                      {/* note: custom color in theme-registry file */}
                      <AccordionSummary variant="solid" color={row.alliance === 'red' ? 'danger' : 'blueAllianceColor'}>
                        {row.team_number} 
                        {row.team_number==='744' && <img src={sharkfin} alt='fin'/>} 
                        {row.allianceWin=='true' && <img src={trophy} alt='trophy'/>}
                      </AccordionSummary>
                      <AccordionDetails variant="soft" color={row.alliance === 'red' ? 'danger' : 'blueAllianceColor'}> {/* note: overriding font color to white in theme-registry file */}
                        <p>Starting Pos: <strong>{row.start_pos}</strong></p>

                        <h4 className="match-section-header">Auto</h4>
                        <p className="detail match-detail">Crossed Auto Line: <strong>{row.cross_auto_line === "" ? '??' : row.cross_auto_line ?? '??'}</strong></p>
                        {(row.cross_auto_line === 'yes' || row.cross_auto_line === '') && (
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
                        <p className="detail match-detail">Parked or climbed: <strong>{row.park_climb === "" ? '??' : row.park_climb ?? '??'}</strong></p>
                        {(row.park_climb === 'climb' || row.park_climb === '') && (
                          <>
                            <p className="detail match-detail">Climbed successfully: <strong>{row.climb_success ?? 'N/A'}</strong></p>
                            <p className="detail match-detail">Scored while climbing: <strong>{row.score_climb  ?? 'N/A'}</strong></p>
                          </>
                        )}
                        {(row.hp_throw === 'yes' || row.hp_throw === '') && (
                            <p className="detail match-detail">HP spotlighted <strong>successfully</strong>: <strong>{row.hp_score}/3</strong> time(s)</p>
                        )}
                        <h4 className="match-section-header">Info</h4>
                        <p className="detail match-detail">Defense rating: <strong>{row.defense}/5</strong></p>
                        <p className="detail match-detail">Lost comms or disabled: <strong>{row.lost_comms_disabled === "" ? '??' : row.lost_comms_disabled ?? '??'}</strong></p>
                        {row.comments && row.comments.length > 0 && <p style={{width:'100%'}}>Post-Match Comments: {row.comments}</p>}
                        <small>Survey by: {row.name}</small>
                      </AccordionDetails>
                    </Accordion>
                  )
                })}   {/*end inner match map/render */ }
                </AccordionGroup>

              </div>  //end indiv match container
            ))}       {/*end fetchedQualResults map/render */ }
          </div>      //end pit container
        )}            {/*end fetchedQualResults ternary */ }
        </section>    {/* end qual section*/}

        <section id='playoff-section'>
        <h2>Playoffs Results <small>({fetchedPlayoffResults.length})</small></h2>
        {/* check if QUAL results array is empty ? true, render plain <p> : false, show results */}
        {fetchedPlayoffResults.length == 0 ? <p>No playoffs matches recorded!</p> : (
          <div className="pit-results-container">
            {fetchedPlayoffResults.map((match, index) => (
              <div key={`match-container-${index}`} id={`match-container-${index}`} className="item-container">
                <h3 key={`header-${index}`} id={`header-${index}`} className='match-number-header'>Match {index+1}</h3>

                <AccordionGroup sx={{maxWidth:'400px'}}> {/* to group all 6 accordions together in DOM, per match*/}
                {match.map((row, index2) => {
                  return( //per Object (orig row from table)
                    <Accordion variant="outlined" key={`match-${index}-team-row-${index2}`}>
                      {/* note: custom color in theme-registry file */}
                      <AccordionSummary variant="solid" color={row.alliance === 'red' ? 'danger' : 'blueAllianceColor'}>{row.team_number}</AccordionSummary>
                      <AccordionDetails variant="soft" color={row.alliance === 'red' ? 'danger' : 'blueAllianceColor'}> {/* note: overriding font color to white in theme-registry file */}
                        <p>Starting Pos: <strong>{row.start_pos}</strong></p>

                        <h4 className="match-section-header">Auto</h4>
                        <p className="detail match-detail">Crossed Auto Line: <strong>{row.cross_auto_line === "" ? '??' : row.cross_auto_line ?? '??'}</strong></p>
                        {(row.cross_auto_line === 'yes' || row.cross_auto_line === '') && (
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
                        <p className="detail match-detail">Parked or climbed: <strong>{row.park_climb === "" ? '??' : row.park_climb ?? '??'}</strong></p>
                        {(row.park_climb === 'climb' || row.park_climb === '') && (
                          <>
                            <p className="detail match-detail">Climbed successfully: <strong>{row.climb_success ?? 'N/A'}</strong></p>
                            <p className="detail match-detail">Scored while climbing: <strong>{row.score_climb  ?? 'N/A'}</strong></p>
                          </>
                        )}
                        {(row.hp_throw === 'yes' || row.hp_throw === '') && (
                            <p className="detail match-detail">HP spotlighted <strong>successfully</strong>: <strong>{row.hp_score}/3</strong> time(s)</p>
                        )}
                        <h4 className="match-section-header">Info</h4>
                        <p className="detail match-detail">Defense rating: <strong>{row.defense}/5</strong></p>
                        <p className="detail match-detail">Lost comms or disabled: <strong>{row.lost_comms_disabled === "" ? '??' : row.lost_comms_disabled ?? '??'}</strong></p>
                        {row.comments && row.comments.length > 0 && <p style={{width:'100%'}}>Post-Match Comments: {row.comments}</p>}
                        <small>Survey by: {row.name}</small>
                      </AccordionDetails>
                    </Accordion>
                  )
                })}   {/*end inner match map/render */ }
                </AccordionGroup>

              </div>  //end indiv match container
            ))}       {/*end fetchedPlayoffResults map/render */ }
          </div>      //end pit container
        )}            {/*end fetchedPlayoffResults ternary */ }
        </section>    {/* end playoff section*/}

        <section id='finals-section'>
        <h2>Finals Results <small>({fetchedFinalResults.length})</small></h2>
        {/* check if QUAL results array is empty ? true, render plain <p> : false, show results */}
        {fetchedFinalResults.length == 0 ? <p>No finals matches recorded!</p> : (
          <div className="pit-results-container">
            {fetchedFinalResults.map((match, index) => (
              <div key={`match-container-${index}`} id={`match-container-${index}`} className="item-container">
                <h3 key={`header-${index}`} id={`header-${index}`} className='match-number-header'>Match {index+1}</h3>

                <AccordionGroup sx={{maxWidth:'400px'}}> {/* to group all 6 accordions together in DOM, per match*/}
                {match.map((row, index2) => {
                  return( //per Object (orig row from table)
                    <Accordion variant="outlined" key={`match-${index}-team-row-${index2}`}>
                      {/* note: custom color in theme-registry file */}
                      <AccordionSummary variant="solid" color={row.alliance === 'red' ? 'danger' : 'blueAllianceColor'}>{row.team_number}</AccordionSummary>
                      <AccordionDetails variant="soft" color={row.alliance === 'red' ? 'danger' : 'blueAllianceColor'}> {/* note: overriding font color to white in theme-registry file */}
                        <p>Starting Pos: <strong>{row.start_pos}</strong></p>

                        <h4 className="match-section-header">Auto</h4>
                        <p className="detail match-detail">Crossed Auto Line: <strong>{row.cross_auto_line === "" ? '??' : row.cross_auto_line ?? '??'}</strong></p>
                        {(row.cross_auto_line === 'yes' || row.cross_auto_line === '') && (
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
                        <p className="detail match-detail">Parked or climbed: <strong>{row.park_climb === "" ? '??' : row.park_climb ?? '??'}</strong></p>
                        {(row.park_climb === 'climb' || row.park_climb === '') && (
                          <>
                            <p className="detail match-detail">Climbed successfully: <strong>{row.climb_success ?? 'N/A'}</strong></p>
                            <p className="detail match-detail">Scored while climbing: <strong>{row.score_climb  ?? 'N/A'}</strong></p>
                          </>
                        )}
                        {(row.hp_throw === 'yes' || row.hp_throw === '') && (
                            <p className="detail match-detail">HP spotlighted <strong>successfully</strong>: <strong>{row.hp_score}/3</strong> time(s)</p>
                        )}
                        <h4 className="match-section-header">Info</h4>
                        <p className="detail match-detail">Defense rating: <strong>{row.defense}/5</strong></p>
                        <p className="detail match-detail">Lost comms or disabled: <strong>{row.lost_comms_disabled === "" ? '??' : row.lost_comms_disabled ?? '??'}</strong></p>
                        {row.comments && row.comments.length > 0 && <p style={{width:'100%'}}>Post-Match Comments: {row.comments}</p>}
                        <small>Survey by: {row.name}</small>
                      </AccordionDetails>
                    </Accordion>
                  )
                })}   {/*end inner match map/render */ }
                </AccordionGroup>

              </div>  //end indiv match container
            ))}       {/*end fetchedFinalResults map/render */ }
          </div>      //end pit container
        )}            {/*end fetchedFinalResults ternary */ }
        </section>    {/* end playoff section*/}
        </>
      )}  {/*end initial isMatchLoading ternary */ }

      <small><cite><a href="https://www.flaticon.com/free-icons/trophy" title="Flaticon - trophy icons">Trophy icon created by Freepik - Flaticon</a></cite></small>
      </> //pls remember JSX needs a parent element bc of the menubutton :)
    )
}