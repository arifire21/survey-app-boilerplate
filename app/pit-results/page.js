"use client"
import MenuButton from "@/components/menu-button";
import { CircularProgress, RadioGroup, Radio, Select, Option, Autocomplete, Modal, ModalClose, ModalDialog, DialogTitle,DialogContent } from "@mui/joy";
import { useState, useEffect } from "react";
// import { orlandoAllTeams } from "../data/orlando-all-teams";

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
    const [availTeamsRender, setAvailTeamsRender] = useState([])

    const [open, setOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [modalTitleSpan, setModalTitleSpan] = useState(null);

    let availTeams = []
    let filteredTeams = []

    function handleInputChange(event, value) {
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
          filterByWCD();
          break;
        case 'drivetrain is mecanum':
          filterByMecanum();
          break;
        case 'drivetrain is tank':
          filterByTank();
          break;
        case 'drivetrain is swerve':
          filterBySwerve();
          break;
        case 'drivetrain is other':
          filterByOther();
          break;
        case 'pref. pos is left':
          filterByStartLeft();
          break;
        case 'pref. pos is center':
          filterByStartCenter();
          break;
        case 'pref. pos is right':
          filterByStartRight();
          break;
        case 'has vision':
          filterByVision();
          break;
        case 'scores in both':
          filterByBothHeight();
          break;
        case 'scores in amp':
          filterByAmp();
          break;
        case 'scores in speaker':
          filterBySpeaker();
          break;
        case 'pickup at both':
          filterByBothPickup();
          break;
        case 'pickup at floor':
          filterByFloor();
          break;
        case 'pickup at HPS':
          filterByHPS();
          break;
        case 'can climb':
          filterByClimb();
          break;
        case 'can help climb':
          filterByHelpClimb();
          break;
        case 'can score climb':
          filterByScoreClimb();
          break;
        case 'has feedback':
          filterByFeedback();
          break;
      }
    }

    //filter helper methods
    function filterByWCD() {
      filteredTeams = fetchedPitResults.filter((item) => item.drivetrain === 'west coast drive')
      updateFilteredState()
    }

    function filterByMecanum() {
      filteredTeams = fetchedPitResults.filter((item) => item.drivetrain === 'mecanum')
      updateFilteredState()
    }

    function filterByTank() {
      filteredTeams = fetchedPitResults.filter((item) => item.drivetrain === 'tank')
      updateFilteredState()
    }

    function filterBySwerve() {
      filteredTeams = fetchedPitResults.filter((item) => item.drivetrain === 'swerve')
      updateFilteredState()
    }

    function filterByOther() {
      filteredTeams = fetchedPitResults.filter((item) => item.drivetrain != 'west coast drive' &&
                                                         item.drivetrain != 'mecanum'          && 
                                                         item.drivetrain != 'tank'             &&
                                                         item.drivetrain != 'swerve'              )
      updateFilteredState()
    }

    function filterByStartLeft() {
      filteredTeams = fetchedPitResults.filter((item) => item.preferred_pos.includes('left'))
      updateFilteredState()
    }

    function filterByStartCenter() {
      filteredTeams = fetchedPitResults.filter((item) => item.preferred_pos.includes('center/subwoofer area'))
      updateFilteredState()
    }

    function filterByStartRight() {
      filteredTeams = fetchedPitResults.filter((item) => item.preferred_pos.includes('right'))
      updateFilteredState()
    }

    function filterByVision() {
      filteredTeams = fetchedPitResults.filter((item) => item.vision === 'yes')
      updateFilteredState()
    }

    function filterByAmp() {
      filteredTeams = fetchedPitResults.filter((item) => item.score_height === 'amp' || item.score_height === 'both')
      updateFilteredState()
    }

    function filterBySpeaker() {
      filteredTeams = fetchedPitResults.filter((item) => item.score_height === 'speaker' || item.score_height === 'both')
      updateFilteredState()
    }

    function filterByBothHeight() {
      filteredTeams = fetchedPitResults.filter((item) => item.score_height === 'both')
      updateFilteredState()
    }

    function filterByFloor() {
      filteredTeams = fetchedPitResults.filter((item) => item.pickup_pos === 'floor' || item.pickup_pos === 'both')
      updateFilteredState()
    }

    function filterByHPS() {
      filteredTeams = fetchedPitResults.filter((item) => item.pickup_pos === 'human player station' || item.pickup_pos === 'both')
      updateFilteredState()
    }

    function filterByBothPickup() {
      filteredTeams = fetchedPitResults.filter((item) => item.pickup_pos === 'both')
      updateFilteredState()
    }

    function filterByClimb() {
      filteredTeams = fetchedPitResults.filter((item) => item.can_climb === 'yes')
      updateFilteredState()
    }

    function filterByHelpClimb() {
      filteredTeams = fetchedPitResults.filter((item) => item.help_climb === 'yes')
      updateFilteredState()
    }

    function filterByScoreClimb() {
      filteredTeams = fetchedPitResults.filter((item) => item.score_climb === 'yes')
      updateFilteredState()
    }

    function filterByClimb() {
      filteredTeams = fetchedPitResults.filter((item) => item.can_climb === 'yes')
      updateFilteredState()
    }

    function filterByFeedback() {
      filteredTeams = fetchedPitResults.filter((item) => (item.feedback && item.feedback.length > 0))
      updateFilteredState()
    }

    //last helper, to be called in each method
    function updateFilteredState(){
      //update the state so it re-renders, pushing to the array variable does nothing
      setFilteredTeamsRender(filteredTeams)
    }

    function pitDataHelper(results){ //relying on state in getData does not work because of state's delayed updating
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
      setPitResults(sortedResults)
      // console.log(sortedResults)

      let tempLast = 0; //to start
      sortedResults.forEach(team => {
        //garbage quick way to check for dupes -- filters
        //error if there are unique "keys" (more than one dupe team number)
        if(tempLast != team.team_number){
          availTeams.push(team.team_number)
        }
        tempLast = team.team_number;
      });
      console.log(availTeams)

      setAvailTeamsRender(availTeams)

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

        // console.log(availTeamsRender)
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

        {pitLoading && pitLoading == true   //is request loading...
        ? <div style={{display:'flex', textAlign:'center'}}>
          {/* ? yes, render circular */}
            <p>Loading...</p><br/><CircularProgress variant="soft" size="sm"/>
          </div>
          // : no, check if empty
        : (isPitEmpty && isPitEmpty == true)
        ? <p>No results yet!</p>
          // ? if not empty...
        : (
          // : filtering options
          <section id="main-section">
          <header className="filter-container">
          <label className="filter-label">Filter Mode:</label>
          <RadioGroup
            name="radio-buttons-pit-filter"
            value={filterType}
            onChange={(e) => {setFilterType(e.target.value)}}
            sx={{display:'flex', flexDirection:'row', flexWrap:'wrap', alignItems:'center'}}
          >
            <Radio value="all" label="All" sx={{marginBlockStart: '1rem', marginRight:'1rem'}}/>
            <div className="extended-radio-option">
            <Radio value="team" label="By team" sx={{marginRight:'1rem'}} />
            <Autocomplete
              disabled={filterType === 'team' ? false : true}
              placeholder="start typing..."
              options={availTeamsRender}
              value={teamCriteria}
              onChange={handleInputChange}
              clearOnBlur
              // isOptionEqualToValue={(option, value) =>{
              //   if(option === '' || value === '') return true;
              //   else return true;
              // }}
              sx={{ width: 200, marginRight:'1rem' }}
              slotProps={{input: { inputMode:'decimal' }}}
            />
            </div>
            <div className="extended-radio-option">
            <Radio value="trait" label="By trait" sx={{marginRight:'1rem'}} /> {/* requested default */}
            <Select
              placeholder='select...'
              onChange={handleSelectChange}
              disabled={filterType === 'trait' ? false : true}
              sx={{ width: 200 }}
            >
              <Option value="drivetrain is WCD">Drivetrain is <span className="blue">WCD</span></Option>
              <Option value="drivetrain is mecanum">Drivetrain is <span className="blue">Mecanum</span></Option>
              <Option value="drivetrain is tank">Drivetrain is <span className="blue">Tank</span></Option>
              <Option value="drivetrain is swerve">Drivetrain is <span className="blue">Swerve</span></Option>
              <Option value="drivetrain is other">Drivetrain is <span className="blue">Other Type</span></Option>

              <Option value="pref. pos is left">Pref. Pos is <span className="blue">Left</span></Option>
              <Option value="pref. pos is center">Pref. Pos is <span className="blue">Center</span></Option>
              <Option value="pref. pos is right">Pref. Pos is <span className="blue">Right</span></Option>

              <Option value="has vision">Has <span className="blue">Vision Tracking</span></Option>

              <Option value="scores in both">Scores in <span className="both">Both</span> <span className="blue">Amp & Speaker</span></Option>
              <Option value="scores in amp">Scores in <span className="blue">Amp</span></Option>
              <Option value="scores in speaker">Scores in <span className="blue">Speaker</span></Option>

              <Option value="pickup at both">Pickup at <span className="both">Both</span> <span className="blue">Floor & HPS</span></Option>
              <Option value="pickup at floor">Pickup at <span className="blue">Floor</span></Option>
              <Option value="pickup at HPS">Pickup at <span className="blue">HPS</span></Option>

              <Option value="can climb">Can <span className="blue">Climb</span></Option>
              <Option value="can help climb">Can <span className="blue">Help Climb</span></Option>
              <Option value="can score climb">Can <span className="blue">Score & Climb</span></Option>

              <Option value="has feedback">Has <span className="blue">Feedback</span></Option>
            </Select>
            </div>
          </RadioGroup>
          </header>

          {/* more conditionals yayyyy */}
          {/* filter type all */}
          {filterType && filterType === 'all' && (
            <div className="pit-results-container">
              {fetchedPitResults.map((item, index) => {
                return (
                  <div key={index} className="item-container">
                    <h3 className="pit-results-number">{item.team_number}</h3>
                    <p className="detail">Drivetrain: <strong>{item.drivetrain}</strong></p>
                    <p className="detail">Preferred Start Position(s): <strong>{item.preferred_pos}</strong></p>
                    <p className="detail">Has Vision Tracking: <strong>{item.vision}</strong></p>
                    <p className="detail">Scores in Amp or Speaker: <strong>{item.score_height}</strong></p>
                    <p className="detail">Pickup at floor or HPS: <strong>{item.pickup_pos}</strong></p>
                    <p className="detail">Can climb: <strong>{item.can_climb}</strong></p>
                    {item.can_climb && item.can_climb === 'yes' && (
                      <>
                        <p className="detail">Can help others climb: <strong>{item.help_climb}</strong></p>
                        <p className="detail">Can score while climbing: <strong>{item.score_climb}</strong></p>
                      </>
                    )}
                    {item.front_img_url && (
                      <div className='img-preview-container'>
                      <p>Front Image</p>
                      <img src={item.front_img_url} alt='[cannot load image!]' className='img-preview'
                        onClick={()=>{modalContentHelper('Front', item.front_img_url)}}
                      />
                      </div>
                    )}
                    {item.side_img_url && (
                      <div className='img-preview-container'>
                      <p>Side Image</p>
                      <img src={item.side_img_url} alt='[cannot load image!]' className='img-preview'
                        onClick={()=>{modalContentHelper('Side', item.side_img_url)}}
                        />
                      </div>
                    )}
                    {item.feedback && item.feedback.length > 0 && <p className="detail">Thoughts: {item.feedback}</p>}
                    <small>Survey by: <strong>{item.name}</strong></small>
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
              <div className="pit-results-container">
                {/* ((value, or index, or another array) => what to compare against) */}
                {fetchedPitResults.filter((item) => item.team_number === teamCriteria).map((item, index) => {
                  return (
                    <div key={index} className="item-container">
                      <h3 className="pit-results-number">{item.team_number}</h3>
                      <p className="detail">Drivetrain: <strong>{item.drivetrain}</strong></p>
                      <p className="detail">Preferred Start Position(s): <strong>{item.preferred_pos}</strong></p>
                      <p className="detail">Has Vision Tracking: <strong>{item.vision}</strong></p>
                      <p className="detail">Scores in Amp or Speaker: <strong>{item.score_height}</strong></p>
                      <p className="detail">Pickup at floor or HPS: <strong>{item.pickup_pos}</strong></p>
                      <p className="detail">Can climb: <strong>{item.can_climb}</strong></p>
                      {item.can_climb && item.can_climb === 'yes' && (
                        <>
                          <p className="detail">Can help others climb: <strong>{item.help_climb}</strong></p>
                          <p className="detail">Can score while climbing: <strong>{item.score_climb}</strong></p>
                        </>
                      )}
                      {item.front_img_url && (
                        <div className='img-preview-container'>
                        <p>Front Image</p>
                        <img src={item.front_img_url} alt='[cannot load image!]' className='img-preview'
                          onClick={()=>{modalContentHelper('Front', item.front_img_url)}}
                        />
                        </div>
                      )}
                      {item.side_img_url && (
                        <div className='img-preview-container'>
                        <p>Side Image</p>
                        <img src={item.side_img_url} alt='[cannot load image!]' className='img-preview'
                          onClick={()=>{modalContentHelper('Side', item.side_img_url)}}
                          />
                        </div>
                      )}
                      {item.feedback && item.feedback.length > 0 && <p className="detail">Thoughts: {item.feedback}</p>}
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
              <div className="pit-results-container" id="filtered-container">
                {/* ((value, or index, or another array) => what to compare against) */}
                {filteredTeamsRender && !filteredTeamsRender.length ? <p>No results.</p> : filteredTeamsRender.map((item, index) => {
                  return (
                    <div key={index} className="item-container">
                      <h3 className="pit-results-number">{item.team_number}</h3>
                      <p className="detail">Drivetrain: <strong>{item.drivetrain}</strong></p>
                      <p className="detail">Preferred Start Position(s): <strong>{item.preferred_pos}</strong></p>
                      <p className="detail">Has Vision Tracking: <strong>{item.vision}</strong></p>
                      <p className="detail">Scores in Amp or Speaker: <strong>{item.score_height}</strong></p>
                      <p className="detail">Pickup at floor or HPS: <strong>{item.pickup_pos}</strong></p>
                      <p className="detail">Can climb: <strong>{item.can_climb}</strong></p>
                      {item.can_climb && item.can_climb === 'yes' && (
                        <>
                          <p className="detail">Can help others climb: <strong>{item.help_climb}</strong></p>
                          <p className="detail">Can score while climbing: <strong>{item.score_climb}</strong></p>
                        </>
                      )}
                      {item.front_img_url && (
                        <div className='img-preview-container'>
                        <p>Front Image</p>
                        <img src={item.front_img_url} alt='[cannot load image!]' className='img-preview'
                          onClick={()=>{modalContentHelper('Front', item.front_img_url)}}
                        />
                        </div>
                      )}
                      {item.side_img_url && (
                        <div className='img-preview-container'>
                        <p>Side Image</p>
                        <img src={item.side_img_url} alt='[cannot load image!]' className='img-preview'
                          onClick={()=>{modalContentHelper('Side', item.side_img_url)}}
                          />
                        </div>
                      )}
                      {item.feedback && item.feedback.length > 0 && <p className="detail">Thoughts: {item.feedback}</p>}
                      <small>Survey by: <strong>{item.name}</strong></small>
                    </div>
                  )
                })}
              </div>
            ))}
          {/* end filter type trait */}
          </section>
        )}

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
