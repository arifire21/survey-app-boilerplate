'use client'
// import StartPosSelector from '@/components/start-pos-selector'
import { Button, Autocomplete, FormControl, FormLabel, Input, RadioGroup, Radio, FormHelperText, Snackbar, Textarea, Slider, Modal, ModalDialog, ModalClose, ToggleButtonGroup } from '@mui/joy'
import Image from 'next/image'
import { useState, useRef } from 'react'
import MenuButton from '@/components/menu-button'
// import CounterButton from '@/components/counter-button'
import styles from './match.module.css'

import Guide from '@/images/driver-station-wall.png'

import { orlandoAllTeams } from "../data/orlando-all-teams";

export default function MatchSurveyPage(){
    const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE;
    const isOffseason = process.env.NEXT_PUBLIC_OFFSEASON;
    const isHiatus = process.env.NEXT_PUBLIC_SEASON_HIATUS;

    //form state
    const [loading, setLoading] = useState(false)
    const formRef = useRef(null);

    //snackbar state
    const [open, setOpen] = useState(false)
    const [errorString, setErrorString] =useState('')
    const [submitSuccess, setSuccess] = useState(false)

    const [modalOpen, setModalOpen] = useState(false)

    //child states
    const [name, setName] = useState('')
    const [matchNumber, setMatchNumber] = useState(0)
    const [matchType, setMatchType] = useState('')
    const [teamNumber, setTeamNumber] = useState('')
    const [startPos, setStartPos] = useState('')
    const [color, setColor] = useState('')

    const [autoLine, setLine] = useState('')
    const [autoAmpCount, setAutoAmpCount] = useState(0)
    const [autoSpeakerCount, setAutoSpeakerCount] = useState(0)

    const [teleAmpCount, setTeleAmpCount] = useState(0)
    const [teleSpeakerCount, setTeleSpeakerCount] = useState(0)
    const [amplifyCount, setAmplifyCount] = useState(0)

    const [parkOrClimb, setParkOrClimb] = useState('')
    const [endClimbSuccess, setClimbSuccess] = useState(null)
    const [endScoreClimb, setScoreClimb] = useState(null)
    const [endThrow, setEndThrow] = useState('')
    const [endHumanCount, setEndHumanCount] = useState(0)

    const [allianceWin, setAllianceWin] = useState('')
    // const [attemptDefense, setAttemptDefense] = useState('')
    const [defense, setDefense] = useState(0)
    const [robotDisabled, setRobotDisabled] = useState('')
    const [comments, setComments] = useState('')

    const humanPlayerMarks = [
        { value: 0, label: '0'},
        { value: 1, label: '1'},
        { value: 2, label: '2'},
        { value: 3, label: '3'}
    ];

    const defenseMarks = [
        { value: 0, label: '0'},
        { value: 1, label: '1'},
        { value: 2, label: '2'},
        { value: 3, label: '3'},
        { value: 4, label: '4'},
        { value: 5, label: '5'},
    ];

    function handleInputChange(event, value) {
        setTeamNumber(value);
    }

    function handleTextareaLimit(value){
        // loop back to this w physically stopping the input
        //for now use component error state
        // if(value.length <= 255){
            setComments(value)
        // }
    }

    function handleDefenseChange(event, value, activeThumb) {
        setDefense(value);
    }

    function handleSpotlightChange(event, value, activeThumb) {
        setEndHumanCount(value);
    }

    function handleValidate(passedEvent){
        if (teamNumber==='' || !name || !color || !matchType || !startPos || !allianceWin){
        setErrorString('Check required fields!')
        setSuccess(false)
        setOpen(true)
        return false;
        }

        else if(matchNumber == 0){
        setErrorString('Match number cannot be 0!')
        setSuccess(false)
        setOpen(true)
        return false;
        }
    
        else if(comments && comments.length > 500){
          setErrorString('Comments must be AT MOST 500 chars.')
          setSuccess(false)
          setOpen(true)
          return false;
        }
    
        handleSubmit(passedEvent)
      }
    
      function handleSubmit(e){
        setLoading(true)
        e.preventDefault()
     
        console.log(name, matchNumber, matchType, teamNumber, color, startPos, autoLine, autoAmpCount, autoSpeakerCount, teleAmpCount, teleSpeakerCount, amplifyCount, parkOrClimb, endClimbSuccess, endScoreClimb, endThrow, endHumanCount, defense, robotDisabled, comments);
    
        const data = {
          name: name,
          matchNumber: matchNumber,
          matchType: matchType,
          teamNumber: teamNumber,
          color: color,
          startPos: startPos,
          autoLine: autoLine,
          autoAmpCount: autoAmpCount,
          autoSpeakerCount: autoSpeakerCount,
          teleAmpCount: teleAmpCount,
          teleSpeakerCount: teleSpeakerCount,
          amplifyCount: amplifyCount,
          parkOrClimb: parkOrClimb,
          endClimbSuccess: endClimbSuccess,
          endScoreClimb: endScoreClimb,
          endThrow: endThrow,
          endHumanCount: endHumanCount,
          defense: defense,
          robotDisabled: robotDisabled,
          comments: comments,
          allianceWin: allianceWin
         }

         let fetchString = '/api/match-result' //default
         if(isDevMode == "true"){
           fetchString = '/api/dev/match-result'
         }
    
         fetch(fetchString, {
          method: 'POST', 
          body: JSON.stringify(data),
          headers:{ 'Content-Type': 'application/json' }
        })
        .then((response => {
          if(!response.ok){
              setSuccess(false)
    
              switch (response.status) {
                case 400:
                    setErrorString('Server validation error! Some fields required.')
                    break;
                case 500:
                    setErrorString('API error!')
                    console.log(response.text)
                    break;
                default:
                    setErrorString('Error! Please try again.')
                    break;
              }
          } else { //reset
              setSuccess(true)
              formRef.current.reset();
    
              setName('')
              setMatchNumber(matchNumber + 1) //temp hotfix for onChange issue
              setMatchType('')
              setTeamNumber('')
              setColor('')
              setStartPos('')
              setLine('')
              setAutoAmpCount(0)
              setAutoSpeakerCount(0)
              setTeleAmpCount(0)
              setTeleSpeakerCount(0)
              setAmplifyCount(0)
              setParkOrClimb('')
              setClimbSuccess(null)
              setScoreClimb(null)
              setEndThrow('')
              setEndHumanCount(0)
              setDefense(0)
              setRobotDisabled('')
              setComments('')
              setAllianceWin('')
          }
          setOpen(true)
          setLoading(false)
      }))
      .catch(error => {
          console.log(error.json())
      })
      }

      function submitHelper(isHiatus, e){
        if(isHiatus == 'true'){
          handleHiatusSubmit()
          return true
        }
    
        if(isHiatus == 'false' || isDevMode == 'true'){
          handleValidate(e)
        }
      }

      function handleHiatusSubmit(){
        setErrorString('HIATUS MODE enabled: cannot submit new records!')
        setSuccess(false)
        setOpen(true)
      }

    return (
        <>
            <MenuButton/>
            <h1>Match Survey</h1>
            <form ref={formRef}>
                {/* <h2>Pre-Start</h2> */}
                <FormControl>
                <FormLabel required={true} sx={{color: '#ed1c24'}}>First Name</FormLabel>
                <Input
                required
                autoComplete='off'
                onChange={(e) => setName(e.target.value)}
                sx={{ width: 300 }}
                />
                </FormControl>

                <FormControl>
                <FormLabel required={true} sx={{color: '#ed1c24'}}>Match Number</FormLabel>
                <Input
                type='number'
                inputMode='tel'
                required
                onChange={(e) => setMatchNumber(e.target.value)}
                sx={{ width: 300 }}
                slotProps={{input: { inputMode:'decimal' }}}
                />
                </FormControl>

                {/* fancy buttons */}
                <FormControl>
                <FormLabel required={true} sx={{color: '#ed1c24'}}>Match Type</FormLabel>
                <ToggleButtonGroup
                    aria-label="match-type"
                    name="match-type"
                    value={matchType}
                    color={color==='' ? 'neutral' : (color==='red' ? 'danger' : 'blueAllianceColor')}
                    size='lg'
                    onChange={(event) => setMatchType(event.target.value)}
                >
                    <Button
                        value="Practice"
                        aria-label='practice match'
                        aria-labelledby='match-type'
                        aria-pressed={matchType==='Practice' ? 'true' : 'false'}
                    >Practice</Button>
                    <Button
                        value="Qual"
                        aria-label='qualification match'
                        aria-labelledby='match-type'
                        aria-pressed={matchType==='Qual' ? 'true' : 'false'}
                    >Qualification</Button>
                    <Button
                        value="Playoff"
                        aria-label='playoff match'
                        aria-labelledby='match-type'
                        aria-pressed={matchType==='Playoff' ? 'true' : 'false'}
                    >Playoff</Button>
                    <Button
                        value="Final"
                        aria-label='final match'
                        aria-labelledby='match-type'
                        aria-pressed={matchType==='Final' ? 'true' : 'false'}  
                        >Final</Button>
                </ToggleButtonGroup>
                </FormControl>

                <FormControl>
                <FormLabel required={true} sx={{color: '#ed1c24'}}>Team Number</FormLabel>
                <Autocomplete
                    required
                    type="number"
                    inputMode="tel"
                    placeholder="start typing..."
                    options={orlandoAllTeams}
                    value={teamNumber}
                    onChange={handleInputChange}
                    clearOnBlur
                    isOptionEqualToValue={(option, value) =>{
                    if(option === '' || value === '') return true;
                    else return true;
                    }}
                    sx={{ width: 300 }}
                    slotProps={{input: { inputMode:'decimal' }}}
                />
                </FormControl>

                <FormLabel required={true} sx={{color: '#ed1c24'}}>Alliance</FormLabel>
                <ToggleButtonGroup
                    aria-label="alliance-color"
                    name="alliance-color"
                    value={color}
                    size='lg'
                    onChange={(event) => setColor(event.target.value)}
                    sx={{marginBottom:'1rem'}}
                >
                    <Button
                        value="red"
                        aria-label={'red alliance'}
                        aria-labelledby='alliance-color'
                        aria-pressed={color==='red' ? 'true' : 'false'}
                        color={'danger'}
                    >Red</Button>
                    <Button
                        value="blue"
                        aria-label='blue alliance'
                        aria-labelledby='alliance-color'
                        aria-pressed={color==='blue' ? 'true' : 'false'}
                        color={'blueAllianceColor'}
                    >Blue</Button>              
                </ToggleButtonGroup>

                <div className={styles.startPosLabel}>
                    <FormLabel required={true} sx={{color: '#ed1c24'}}>Starting Position</FormLabel>
                    <Button
                        variant='outlined'
                        size='sm'
                        onClick={() => setModalOpen(true)}
                        sx={{ml:1}}
                    >View Guide</Button>
                </div>
                <FormControl>
                { color === 'blue' && (
                    <RadioGroup
                    name='blue-pos'
                    value={startPos}
                    onChange={(e) => setStartPos(e.target.value)}
                    >
                        <Radio value='Against B1 Wall' label='Against B1 Wall'/>
                        <Radio value='Against B2 Wall' label='Against B2 Wall'/>
                        <Radio value='Left Diagonal Subwoofer' label='Left Diagonal Subwoofer'/>
                        <Radio value='Centered Subwoofer' label='Centered Subwoofer'/>
                        <Radio value='Right Diagonal Subwoofer' label='Right Diagonal Subwoofer'/>
                        <Radio value='Against B3 Wall' label='Against B3 Wall'/>
                    </RadioGroup>
                )}
                { color === 'red' && (
                    <RadioGroup
                    name='red-pos'
                    value={startPos}
                    onChange={(e) => setStartPos(e.target.value)}
                    >
                        <Radio value='Against R1 Wall' label='Against R1 Wall'/>
                        <Radio value='Against R2 Wall' label='Against R2 Wall'/>
                        <Radio value='Left Diagonal Subwoofer' label='Left Diagonal Subwoofer'/>
                        <Radio value='Centered Subwoofer' label='Centered Subwoofer'/>
                        <Radio value='Right Diagonal Subwoofer' label='Right Diagonal Subwoofer'/>
                        <Radio value='Against R3 Wall' label='Against R3 Wall'/>
                    </RadioGroup>
                )}
                { color === '' && (<p>Select an alliance first!</p>)}
                </FormControl>

                <h2>Auto</h2>
                {/* cross auto line */}
                <FormControl>
                    <FormLabel>Did robot cross the Auto Line?</FormLabel>
                    <RadioGroup
                    name='match-auto-line'
                    value={autoLine}
                    onChange={(e) => setLine(e.target.value)}
                    >
                        <Radio value='yes' label='Yes'/>
                        <Radio value='no' label='No'/>
                    </RadioGroup>
                </FormControl>

                {/* Note scored in amp */}
                <FormControl>
                <FormLabel>Notes Scored in Amp</FormLabel>
                <div className={styles.container}>
                <button
                    type="button"
                    className={styles.leftButton}
                    onClick={() => setAutoAmpCount(autoAmpCount == 0 ? 0 : (autoAmpCount - 1))}>
                    -
                </button>
                <Input
                readOnly
                value={autoAmpCount}
                className={styles.counterInput}
                sx={{ '& input': { textAlign: 'center' }}}/>
                <button
                    type="button"
                    className={styles.rightButton}
                    onClick={() => setAutoAmpCount(autoAmpCount + 1)}>
                    +
                </button>
                </div>
                </FormControl>

                {/* Notes Scored in Speaker */}
                <FormControl> 
                <FormLabel>Notes Scored in Speaker</FormLabel>
                <div className={styles.container}>
                <button
                    type="button"
                    className={styles.leftButton}
                    onClick={() => setAutoSpeakerCount(autoSpeakerCount == 0 ? 0 : (autoSpeakerCount - 1))}>
                    -
                </button>
                <Input
                readOnly
                value={autoSpeakerCount}
                className={styles.counterInput}
                sx={{ '& input': { textAlign: 'center' }}}/>
                <button
                    type="button"
                    className={styles.rightButton}
                    onClick={() => setAutoSpeakerCount(autoSpeakerCount + 1)}>
                    +
                </button>
                </div>
                </FormControl>
                
                <h2>Teleop</h2>
                {/* Note scored in amp */}
                <FormControl>
                <FormLabel>Notes Scored in Amp</FormLabel>
                <div className={styles.container}>
                <button
                    type="button"
                    className={styles.leftButton}
                    onClick={() => setTeleAmpCount(teleAmpCount == 0 ? 0 : (teleAmpCount - 1))}>
                    -
                </button>
                <Input
                readOnly
                value={teleAmpCount}
                className={styles.counterInput}
                sx={{ '& input': { textAlign: 'center' }}}/>
                <button
                    type="button"
                    className={styles.rightButton}
                    onClick={() => setTeleAmpCount(teleAmpCount + 1)}>
                    +
                </button>
                </div>
                </FormControl>

                {/* Notes Scored in Speaker */}
                <FormControl> 
                <FormLabel>Notes Scored in Speaker</FormLabel>
                <div className={styles.container}>
                <button
                    type="button"
                    className={styles.leftButton}
                    onClick={() => setTeleSpeakerCount(teleSpeakerCount == 0 ? 0 : (teleSpeakerCount - 1))}>
                    -
                </button>
                <Input
                readOnly
                value={teleSpeakerCount}
                className={styles.counterInput}
                sx={{ '& input': { textAlign: 'center' }}}/>
                <button
                    type="button"
                    className={styles.rightButton}
                    onClick={() => setTeleSpeakerCount(teleSpeakerCount + 1)}>
                    +
                </button>
                </div>
                </FormControl>

                {/* human player amplification */}
                <FormControl> 
                <FormLabel>Times Human Player <strong>pressed</strong> Amplify</FormLabel>
                <div className={styles.container}>
                <button
                    type="button"
                    className={styles.leftButton}
                    onClick={() => setAmplifyCount(amplifyCount == 0 ? 0 : (amplifyCount - 1))}>
                    -
                </button>
                <Input
                readOnly
                value={amplifyCount}
                className={styles.counterInput}
                sx={{ '& input': { textAlign: 'center' }}}/>
                <button
                    type="button"
                    className={styles.rightButton}
                    onClick={() => setAmplifyCount(amplifyCount + 1)}>
                    +
                </button>
                </div>
                </FormControl>

                <h2>Endgame</h2>
                <FormControl>
                    <FormLabel>Did robot park at the stage or attempt to climb?</FormLabel>
                    <RadioGroup
                    name='match-climb-park'
                    value={parkOrClimb}
                    onChange={(e) => setParkOrClimb(e.target.value)}
                    >
                        <Radio value='N/A' label='N/A, did not reach stage'/>
                        <Radio value='park' label='Park'/>
                        <Radio value='climb' label='Climb'/>
                    </RadioGroup>
                </FormControl>

                {parkOrClimb === 'climb' && (
                    <>
                    <FormControl>
                        <FormLabel>Did robot <strong>successfully climb</strong>?</FormLabel>
                        <RadioGroup
                        name='match-climb'
                        value={endClimbSuccess}
                        onChange={(e) => {setClimbSuccess(e.target.value), console.log(endClimbSuccess)}}
                        >
                            <Radio value='yes' label='Yes'/>
                            <Radio value='no' label='No'/>
                        </RadioGroup>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Did robot score in Stage Trap?</FormLabel>
                        <RadioGroup
                        name='match-climb-score'
                        value={endScoreClimb}
                        onChange={(e) => {setScoreClimb(e.target.value), console.log(endScoreClimb)}}
                        >
                            <Radio value='yes' label='Yes'/>
                            <Radio value='no' label='No'/>
                        </RadioGroup>
                    </FormControl>
                    </>
                )}

                <FormControl>
                    <FormLabel>Did human player throw any notes?</FormLabel>
                    <RadioGroup
                    name='match-HP-throw'
                    value={endThrow}
                    onChange={(e) => {setEndThrow(e.target.value), console.log(endThrow)}}
                    >
                        <Radio value='yes' label='Yes'/>
                        <Radio value='no' label='No'/>
                    </RadioGroup>
                </FormControl>

                {endThrow === 'yes'  && (
                    <>
                    <FormLabel>How many scored?</FormLabel>
                    <Slider
                        aria-label="HP-note-score"
                        value={endHumanCount}
                        step={1}
                        marks={humanPlayerMarks}
                        min={0}
                        max={3}
                        onChange={handleSpotlightChange}
                        sx={{ maxWidth: 500, minWidth: 300 }}
                    />
                  </>
                )}

                <h2>Information</h2>
                <FormControl>
                    <FormLabel required sx={{color: '#ed1c24'}}>Did <span className={color==='red'? 'red-alliance' : 'blue-alliance'}>{color}</span> alliance win?</FormLabel>
                    <RadioGroup
                    name='match-win'
                    value={allianceWin}
                    onChange={(e) => {setAllianceWin(e.target.value)}}
                    >
                        <Radio value='yes' label='Yes'/>
                        <Radio value='no' label='No'/>
                    </RadioGroup>
                </FormControl>

                <FormControl>
                    <FormLabel>Did robot lose comms at any point (or get disabled)?</FormLabel>
                    <RadioGroup
                    name='match-disabled'
                    value={robotDisabled}
                    onChange={(e) => {setRobotDisabled(e.target.value)}}
                    >
                        <Radio value='yes' label='Yes'/>
                        <Radio value='no' label='No'/>
                    </RadioGroup>
                </FormControl>

                {/* <FormControl>
                    <FormLabel>Did robot attempt to play defense?</FormLabel>
                    <RadioGroup
                    name='match-disabled'
                    value={attemptDefense}
                    onChange={(e) => {setDefenseAttempt(e.target.value)}}
                    >
                        <Radio value='yes' label='Yes'/>
                        <Radio value='no' label='No'/>
                    </RadioGroup>
                </FormControl> */}
                
                {/* {attemptDefense === 'yes' && ( */}
                <FormControl sx={{ marginBottom: '3rem'}}>
                <FormLabel>Rate effective defense:</FormLabel>
                <Slider
                    aria-label="defense"
                    value={defense}
                    step={1}
                    marks={defenseMarks}
                    min={0}
                    max={5}
                    onChange={handleDefenseChange}
                    sx={{ maxWidth: 500, minWidth: 300 }}
                />
                </FormControl>
                {/* )} */}

                <FormControl  sx={{ marginBottom: '2rem'}}>
                    <FormLabel>Post-Match Comments</FormLabel>
                    <FormHelperText>Describe defense strategy, any fouls, any slow performance, etc.</FormHelperText>
                    <Textarea
                    minRows={2}
                    onChange={(e) => handleTextareaLimit(e.target.value)}
                    sx={{ maxWidth: 500, minWidth: 300 }}
                    error={comments.length > comments ? true : false}
                    />
                    <FormHelperText><span style={{color: (comments.length > 500 ? 'red' : 'unset' ?? 'unset')}}>{comments.length}</span>/500</FormHelperText>
                </FormControl>

                <Button loading={loading} onClick={(e) => submitHelper(isHiatus, e)}>Submit Survey</Button>
            </form>

            <Snackbar
            variant="solid"
            color={submitSuccess ? 'success' : 'danger'}
            autoHideDuration={submitSuccess ? 3500 : 5000}
            open={open}
            onClose={() => setOpen(false)}
            // onUnmount={handleReset}
            >
            {submitSuccess ?
            `Submitted!`
            : `${errorString}`}
            </Snackbar>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="driver-station-title"
                aria-describedby="driver-station-image"
                className={styles.modalStuff}
                // sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth:'50vw', maxHeight:'50vh', trans}}
            >
                <ModalDialog layout='fullscreen-padded' sx={{ transition: `opacity $500ms ease-in-out`,}}>
                <ModalClose variant="outlined"/>
                <p id='driver-station-title' className={styles.driverStationTitle}>Driver Station Positions</p>
                <div className={styles.modalImgContainer}>
                    <Image id='driver-station-image' className={styles.driverStationImage} src={Guide} alt='driver station wall figure' fill/>
                </div>
                <small>Credit: <cite>FIRST FRC 2024 Game Manual</cite></small>
                </ModalDialog>
            </Modal>
        </>
    )
}
