"use client"
import MenuButton from "@/components/menu-button";
import { CircularProgress, RadioGroup, Radio, Select, Option, Autocomplete, Modal, ModalClose, ModalDialog, DialogTitle,DialogContent } from "@mui/joy";
import { useState, useEffect } from "react";
// import { orlandoAllTeams } from "../data/orlando-all-teams";

import styles from '@/styles/pit-results.module.css'

export default function ViewPitResultsPage(){
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE;

    const [pitLoading, isPitLoading] = useState(true)
    const [fetchedPitResults, setPitResults] = useState([]);
    const [isPitEmpty, setPitEmpty] = useState(false)
    const [requestFail, setRequestFail] = useState(false)
    const [dataUndef, setUndef] = useState(false)

    //filter states
    const [filterType, setFilterType] = useState('all')
    const [teamCriteria, setTeamCriteria] = useState('')
    const [traitCriteria, setTraitCriteria] = useState('')
    const [filteredTeamsRender, setFilteredTeamsRender] = useState([])
    const [availTeamsOptions, SetAvailTeamsOptions] = useState([])

    const [open, setOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [modalTitleSpan, setModalTitleSpan] = useState(null);

    let availTeams = []
    let filteredTeams = []

    function handleTeamNumChange(event, value) {
      setTeamCriteria(value);
      console.log(value)
    }

    function handleSelectChange(event, value){
      setTraitCriteria(value)
      console.log(value)

      filteredTeams = [] //reset
      setFilteredTeamsRender([])

      switch (value) {
        case 'drivetrain is WCD':
          filteredTeams = fetchedPitResults.filter((item) => item.drivetrain === 'west coast drive')
          break;
        case 'drivetrain is mecanum':
          filteredTeams = fetchedPitResults.filter((item) => item.drivetrain === 'mecanum')
          break;
        case 'drivetrain is tank':
          filteredTeams = fetchedPitResults.filter((item) => item.drivetrain === 'tank')
          break;
        case 'drivetrain is swerve':
          filteredTeams = fetchedPitResults.filter((item) => item.drivetrain === 'swerve')
          break;
        case 'drivetrain is other':
          filteredTeams = fetchedPitResults.filter((item) => item.drivetrain != 'west coast drive' &&
                                                              item.drivetrain != 'mecanum'          && 
                                                              item.drivetrain != 'tank'             &&
                                                              item.drivetrain != 'swerve'              )
          break;
        case 'pref. pos is left':
          filteredTeams = fetchedPitResults.filter((item) => item.preferred_pos.includes('left'))
          break;
        case 'pref. pos is center':
          filteredTeams = fetchedPitResults.filter((item) => item.preferred_pos.includes('center/subwoofer area'))
          break;
        case 'pref. pos is right':
          filteredTeams = fetchedPitResults.filter((item) => item.preferred_pos.includes('right'))
          break;
        case 'has vision':
          filteredTeams = fetchedPitResults.filter((item) => item.vision === 'yes')
          break;
        case 'scores in both':
          filteredTeams = fetchedPitResults.filter((item) => item.score_height === 'both')
          break;
        case 'scores in amp':
          filteredTeams = fetchedPitResults.filter((item) => item.score_height === 'amp' || item.score_height === 'both')
          break;
        case 'scores in speaker':
          filteredTeams = fetchedPitResults.filter((item) => item.score_height === 'speaker' || item.score_height === 'both')
          break;
        case 'pickup at both':
          filteredTeams = fetchedPitResults.filter((item) => item.pickup_pos === 'both')
          break;
        case 'pickup at floor':
          filteredTeams = fetchedPitResults.filter((item) => item.pickup_pos === 'floor' || item.pickup_pos === 'both')
          break;
        case 'pickup at HPS':
          filteredTeams = fetchedPitResults.filter((item) => item.pickup_pos === 'human player station' || item.pickup_pos === 'both')
          break;
        case 'can climb':
          filteredTeams = fetchedPitResults.filter((item) => item.can_climb === 'yes')
          break;
        case 'can help climb':
          filteredTeams = fetchedPitResults.filter((item) => item.help_climb === 'yes')
          break;
        case 'can score climb':
          filteredTeams = fetchedPitResults.filter((item) => item.score_climb === 'yes')
          break;
        case 'has feedback':
          filteredTeams = fetchedPitResults.filter((item) => (item.feedback && item.feedback.length > 0))
          break;
      } //end switch

      //update the state variable so it re-renders, pushing to the array variable does nothing
      setFilteredTeamsRender(filteredTeams)
    }

    //relying on state in getData does not work because of state's delayed updating,
    //so pass results to this to be manipulated/set state for re-render
    function pitDataHelper(results){
      if(results.length == 0){
        setPitEmpty(true)
        return null;
      }

      //is this needed
      if (typeof results == 'undefined' || typeof results == null){
        setUndef(true)
        console.log('undef')
        console.log(dataUndef)
        return null;
      }

      //use .sort method here to just make this easier when using .filter
      let sortedResults = results.sort((a, b) => a.team_number - b.team_number) //ascending order
      //set pit results to be rendered...
      setPitResults(sortedResults)

      let tempLast = 0; //to start
      sortedResults.forEach(team => {
        //garbage quick way to check for dupes -- filters
        //error if there are unique "keys" (more than one dupe team number)
        if(tempLast != team.team_number){
          availTeams.push(team.team_number)
        }
        tempLast = team.team_number;
      });
      //for the "filter by team" autocomplete
      SetAvailTeamsOptions(availTeams)

      return true;
    }

    function modalContentHelper(span, url){
      console.log(`${span}, ${url}`)
      setModalTitleSpan(span);
      setModalImage(url);
      setOpen(true);
    }

    //end helpers

      const getData = async () => {
        let fetchString = '/api/pit-result' //default
        if(isDevMode == 'true'){
          fetchString = '/api/dev/pit-result'
        }

        await fetch(fetchString, {
          method: "GET",
          headers: {
          "Content-Type": "application/json",
          },
        })
        .then((res => {
          if(!res.ok){
            console.log('Check Internet Connection')
            setPitEmpty(true)
            setRequestFail(true)
            return null
          }
          else {
            return res.json() // Parse the response data as JSON
          }
        }))
        .then((data) => {console.log(`data: ${data}`);pitDataHelper(data.results)})
        .catch( err => console.log(err) );

        // console.log(availTeamsOptions)
        isPitLoading(false) //should stay here regardless if empty or not
      }
  
      useEffect(() => {
        getData()
      }, []);
      
      return(
        <>
        <MenuButton/>
        
        <h1>Pit Survey Results</h1>
        {requestFail && requestFail && (
          <p><strong>API Request Failed</strong>: Check your internet connection and try again!</p>
        )}

        {dataUndef && dataUndef == true && (
          <p><strong>API Request Failed</strong>: response data is undefined, contact admin!</p>
        )}

        {pitLoading && pitLoading == true
        ? <div style={{display:'flex', textAlign:'center'}}>
          {/* ? yes, render circular */}
            <p>Loading...</p><br/><CircularProgress variant="soft" size="sm"/>
          </div>
          // : no, check if empty ? true, IS empty, render plain <p> : false, is NOT empty, move on to mapping arrays
        : (isPitEmpty && isPitEmpty == true) ? <p>No results yet!</p> : (
          // filtering options
          <section id="main-section">
          <header className={styles.filterContainer}>
          <label className={styles.filterLabel}>Filter Mode:</label>
          <RadioGroup
            name="radio-buttons-pit-filter"
            value={filterType}
            onChange={(e) => {setFilterType(e.target.value)}}
            sx={{display:'flex', flexDirection:'row', flexWrap:'wrap', alignItems:'center'}}
          >
            <Radio value="all" label="All" className={styles.radioLabel}/>
            <div className={styles.radioOptionContainer}>
              <Radio value="team" label="By team" className={styles.radioLabel}/>
              <Autocomplete
                disabled={filterType === 'team' ? false : true}
                placeholder="start typing..."
                options={availTeamsOptions}
                value={teamCriteria}
                onChange={handleTeamNumChange}
                clearOnBlur
                // isOptionEqualToValue={(option, value) =>{
                //   if(option === '' || value === '') return true;
                //   else return true;
                // }}
                sx={{ width: 200, marginRight:'1rem' }}
                slotProps={{input: { inputMode:'decimal' }}}
              />
            </div>
            <div className={styles.radioOptionContainer}>
              <Radio value="trait" label="By trait" className={styles.radioLabel}/> {/* requested default */}
              <Select
                placeholder='select...'
                onChange={handleSelectChange}
                disabled={filterType === 'trait' ? false : true}
                sx={{ width: 200 }}
              >
                <Option value="drivetrain is WCD">Drivetrain is <span className={styles.blue}>WCD</span></Option>
                <Option value="drivetrain is mecanum">Drivetrain is <span className={styles.blue}>Mecanum</span></Option>
                <Option value="drivetrain is tank">Drivetrain is <span className={styles.blue}>Tank</span></Option>
                <Option value="drivetrain is swerve">Drivetrain is <span className={styles.blue}>Swerve</span></Option>
                <Option value="drivetrain is other">Drivetrain is <span className={styles.blue}>Other Type</span></Option>

                <Option value="pref. pos is left">Pref. Pos is <span className={styles.blue}>Left</span></Option>
                <Option value="pref. pos is center">Pref. Pos is <span className={styles.blue}>Center</span></Option>
                <Option value="pref. pos is right">Pref. Pos is <span className={styles.blue}>Right</span></Option>

                <Option value="has vision">Has <span className={styles.blue}>Vision Tracking</span></Option>

                <Option value="scores in both">Scores in <span className="both">Both</span> <span className={styles.blue}>Amp & Speaker</span></Option>
                <Option value="scores in amp">Scores in <span className={styles.blue}>Amp</span></Option>
                <Option value="scores in speaker">Scores in <span className={styles.blue}>Speaker</span></Option>

                <Option value="pickup at both">Pickup at <span className="both">Both</span> <span className={styles.blue}>Floor & HPS</span></Option>
                <Option value="pickup at floor">Pickup at <span className={styles.blue}>Floor</span></Option>
                <Option value="pickup at HPS">Pickup at <span className={styles.blue}>HPS</span></Option>

                <Option value="can climb">Can <span className={styles.blue}>Climb</span></Option>
                <Option value="can help climb">Can <span className={styles.blue}>Help Climb</span></Option>
                <Option value="can score climb">Can <span className={styles.blue}>Score & Climb</span></Option>

                <Option value="has feedback">Has <span className={styles.blue}>Feedback</span></Option>
              </Select>
            </div>
          </RadioGroup>
          </header>

          {/* more conditionals yayyyy */}
          {/* filter type all results*/}
          {filterType && filterType === 'all' && (
            <div className="full-results-container">
              {fetchedPitResults.map((item, index) => {
                return (
                  <div key={index} className="item-container">
                    <h3 className="item-number">{item.team_number}</h3>
                    <p className={styles.pitDetail}>Drivetrain: <strong>{item.drivetrain}</strong></p>
                    <p className={styles.pitDetail}>Preferred Start Position(s): <strong>{item.preferred_pos}</strong></p>
                    <p className={styles.pitDetail}>Has Vision Tracking: <strong>{item.vision}</strong></p>
                    <p className={styles.pitDetail}>Scores in Amp or Speaker: <strong>{item.score_height}</strong></p>
                    <p className={styles.pitDetail}>Pickup at floor or HPS: <strong>{item.pickup_pos}</strong></p>
                    <p className={styles.pitDetail}>Can climb: <strong>{item.can_climb}</strong></p>
                    {item.can_climb && item.can_climb === 'yes' && (
                      <>
                        <p className={styles.pitDetail}>Can help others climb: <strong>{item.help_climb}</strong></p>
                        <p className={styles.pitDetail}>Can score while climbing: <strong>{item.score_climb}</strong></p>
                      </>
                    )}
                    {item.front_img_url && (
                      <div className={styles.imagePreviewContainer}>
                      <p>Front Image</p>
                      <img src={item.front_img_url} alt='[cannot load image!]' className={styles.imagePreviewItem}
                        onClick={()=>{modalContentHelper('Front', item.front_img_url)}}
                      />
                      </div>
                    )}
                    {item.side_img_url && (
                      <div className={styles.imagePreviewContainer}>
                      <p>Side Image</p>
                      <img src={item.side_img_url} alt='[cannot load image!]' className={styles.imagePreviewItem}
                        onClick={()=>{modalContentHelper('Side', item.side_img_url)}}
                        />
                      </div>
                    )}
                    {item.feedback && item.feedback.length > 0 && <p className={`result-comments ${styles.pitDetail}`}>Thoughts: {item.feedback}</p>}
                    <small>Survey by: {item.name}</small>
                  </div>
                )
              })}
            </div>
          )}
          {/* end filter type all */}

          {/* yes I know these may be computationally costly to do on FE, but working with
            assumption of little to no signal in event spaces, and possibly limited
            compute time/idle DB
        */}

          {/* filter type team */}
          {/* avoid re-renders, check if not null/team first, then ternary */}
          {(filterType && filterType === 'team') && (teamCriteria === '' ?
            <p style={{ textAlign: 'center' }}>Select a team number!</p>
            : (
              <div className="full-results-container">
                {/* ((value, or index, or another array) => what to compare against) */}
                {fetchedPitResults.filter((item) => item.team_number === teamCriteria).map((item, index) => {
                  return (
                    <div key={index} className="item-container">
                      <h3 className="item-number">{item.team_number}</h3>
                      <p className={styles.pitDetail}>Drivetrain: <strong>{item.drivetrain}</strong></p>
                      <p className={styles.pitDetail}>Preferred Start Position(s): <strong>{item.preferred_pos}</strong></p>
                      <p className={styles.pitDetail}>Has Vision Tracking: <strong>{item.vision}</strong></p>
                      <p className={styles.pitDetail}>Scores in Amp or Speaker: <strong>{item.score_height}</strong></p>
                      <p className={styles.pitDetail}>Pickup at floor or HPS: <strong>{item.pickup_pos}</strong></p>
                      <p className={styles.pitDetail}>Can climb: <strong>{item.can_climb}</strong></p>
                      {item.can_climb && item.can_climb === 'yes' && (
                        <>
                          <p className={styles.pitDetail}>Can help others climb: <strong>{item.help_climb}</strong></p>
                          <p className={styles.pitDetail}>Can score while climbing: <strong>{item.score_climb}</strong></p>
                        </>
                      )}
                      {item.front_img_url && (
                        <div className={styles.imagePreviewContainer}>
                        <p>Front Image</p>
                        <img src={item.front_img_url} alt='[cannot load image!]' className={styles.imagePreviewItem}
                          onClick={()=>{modalContentHelper('Front', item.front_img_url)}}
                        />
                        </div>
                      )}
                      {item.side_img_url && (
                        <div className={styles.imagePreviewContainer}>
                        <p>Side Image</p>
                        <img src={item.side_img_url} alt='[cannot load image!]' className={styles.imagePreviewItem}
                          onClick={()=>{modalContentHelper('Side', item.side_img_url)}}
                          />
                        </div>
                      )}
                      {item.feedback && item.feedback.length > 0 && <p className={styles.pitDetail}>Thoughts: {item.feedback}</p>}
                      <small>Survey by: <strong>{item.name}</strong></small>
                    </div>
                  )
                })}
              </div>
            )
          )}
          {/* end filter type team */}

          {/* filter type trait */}
          {(filterType && filterType === 'trait') && (traitCriteria === '' ?
            <p style={{ textAlign: 'center' }}>Select a trait!</p>
            : (
              <div className="full-results-container" id="filtered-container">
                {/* ((value, or index, or another array) => what to compare against) */}
                {filteredTeamsRender && !filteredTeamsRender.length ? <p>No results.</p> : filteredTeamsRender.map((item, index) => {
                  return (
                    <div key={index} className="item-container">
                      <h3 className="item-number">{item.team_number}</h3>
                      <p className={styles.pitDetail}>Drivetrain: <strong>{item.drivetrain}</strong></p>
                      <p className={styles.pitDetail}>Preferred Start Position(s): <strong>{item.preferred_pos}</strong></p>
                      <p className={styles.pitDetail}>Has Vision Tracking: <strong>{item.vision}</strong></p>
                      <p className={styles.pitDetail}>Scores in Amp or Speaker: <strong>{item.score_height}</strong></p>
                      <p className={styles.pitDetail}>Pickup at floor or HPS: <strong>{item.pickup_pos}</strong></p>
                      <p className={styles.pitDetail}>Can climb: <strong>{item.can_climb}</strong></p>
                      {item.can_climb && item.can_climb === 'yes' && (
                        <>
                          <p className={styles.pitDetail}>Can help others climb: <strong>{item.help_climb}</strong></p>
                          <p className={styles.pitDetail}>Can score while climbing: <strong>{item.score_climb}</strong></p>
                        </>
                      )}
                      {item.front_img_url && (
                        <div className={styles.imagePreviewContainer}>
                        <p>Front Image</p>
                        <img src={item.front_img_url} alt='[cannot load image!]' className={styles.imagePreviewItem}
                          onClick={()=>{modalContentHelper('Front', item.front_img_url)}}
                        />
                        </div>
                      )}
                      {item.side_img_url && (
                        <div className={styles.imagePreviewContainer}>
                        <p>Side Image</p>
                        <img src={item.side_img_url} alt='[cannot load image!]' className={styles.imagePreviewItem}
                          onClick={()=>{modalContentHelper('Side', item.side_img_url)}}
                          />
                        </div>
                      )}
                      {item.feedback && item.feedback.length > 0 && <p className={styles.pitDetail}>Thoughts: {item.feedback}</p>}
                      {/* use or ignore name if desired */}
                      {/* <small>Survey by: <strong>{item.name}</strong></small> */}
                    </div>
                  )
                })}
              </div>
            ))}
          {/* end filter type trait */}
          </section>
        )} {/*end initial isPitLoading ternary */ }

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => {setOpen(false); console.log('closed')}}
        // sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <ModalDialog layout="center">
          <ModalClose variant="plain" size="lg" sx={{ m: 1 }} />
          <DialogTitle id="modal-title">{modalTitleSpan} Image</DialogTitle>
          <DialogContent><img id="modal-desc" src={modalImage}/></DialogContent>
        </ModalDialog>
      </Modal>

        </>
        )
}
