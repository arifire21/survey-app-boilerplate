'use client'
// import StartPosSelector from '@/components/start-pos-selector'
import { Box, Button, Autocomplete, FormControl, FormLabel, Input, RadioGroup, Radio, radioClasses, FormHelperText, Snackbar, Textarea, Slider, Modal, ModalDialog, ModalClose } from '@mui/joy'
import Image from 'next/image'
import { useState, useRef } from 'react'
import MenuButton from '@/components/menu-button'
// import CounterButton from '@/components/counter-button'
import styles from './match.module.css'

import Guide from '../../public/images/driver-station-wall.png'

import { orlandoAllTeams } from "../data/orlando-all-teams";

export default function MatchSurveyPage(){
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

    const [attemptDefense, setAttemptDefense] = useState('')
    const [defense, setDefense] = useState(0)
    const [robotDisabled, setRobotDisabled] = useState('')
    const [comments, setComments] = useState('')

    const humanPlayerMarks = [
        {
          value: 0,
          label: '0',
        },
        {
          value: 1,
          label: '1',
        },
        {
          value: 2,
          label: '2',
        },
        {
          value: 3,
          label: '3',
        },
    ];

    const defenseMarks = [
        {
          value: 0,
          label: '0',
        },
        {
          value: 1,
          label: '1',
        },
        {
          value: 2,
          label: '2',
        },
        {
          value: 3,
          label: '3',
        },
        {
         value: 4,
         label: '4',
        },
        {
         value: 5,
         label: '5',
        },
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
        if (teamNumber==='' || !name || !color || !matchType || !startPos){
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
          setErrorString('Comments must be at most 500 chars.')
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
          comments: comments
         }
    
        fetch('/api/match-result', {
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
          }
          setOpen(true)
          setLoading(false)
      }))
      .catch(error => {
          console.log(error.json())
      })
      }

    return (
        <>
            <MenuButton/>
            <h1>Match Survey</h1>
            <form ref={formRef}>
                {/* <h2>Pre-Start</h2> */}
                <FormControl  sx={{ marginBottom: '1rem'}}>
                <FormLabel>First Name <sup className='req'>*</sup></FormLabel>
                <Input
                required
                onChange={(e) => setName(e.target.value)}
                sx={{ width: 300 }}
                />
                </FormControl>

                <FormControl  sx={{ marginBottom: '1rem'}}>
                <FormLabel>Match Number <sup className='req'>*</sup></FormLabel>
                <Input
                type='number'
                required
                onChange={(e) => setMatchNumber(e.target.value)}
                sx={{ width: 300 }}
                slotProps={{input: { inputMode:'decimal' }}}
                />
                </FormControl>

                <FormLabel>Match Type <sup className='req'>*</sup></FormLabel>
                {/* fancy buttons */}
                <RadioGroup
                    orientation="horizontal"
                    aria-label="match type"
                    name="match-type"
                    variant="outlined"
                    value={matchType}
                    onChange={(event) => setMatchType(event.target.value)}
                    sx={{width: 'fit-content', marginBottom: '1rem'}}
                    >
                    {['Practice', 'Qual', 'Playoff', 'Final'].map((item) => (
                        <Box
                        key={item}
                        sx={(theme) => ({
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 'fit-content',
                            height: 48,
                            padding: '0.5rem',
                            '&:not([data-first-child])': {
                            borderLeft: '1px solid',
                            borderColor: 'divider',
                            },
                            [`&[data-first-child] .${radioClasses.action}`]: {
                            borderTopLeftRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                            borderBottomLeftRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                            },
                            [`&[data-last-child] .${radioClasses.action}`]: {
                            borderTopRightRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                            borderBottomRightRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                            },
                        })}
                        >
                        <Radio
                            value={item}
                            disableIcon
                            overlay
                            label={     //values capitalizd for data display 
                            {
                                Practice: 'Practice',
                                Qual: 'Qualification',
                                Playoff: 'Playoff',
                                Final: 'Final'
                            }[item]
                            }
                            variant={matchType === item ? 'solid' : 'plain'}
                            slotProps={{
                            input: { 'aria-label': item,
                            },
                            action: {sx: { borderRadius: 0, transition: 'none' }},
                            label: { sx: { lineHeight: 0 } },
                            }}
                        />
                        </Box>
                    ))}
                </RadioGroup>

                <FormControl sx={{ marginBottom: '1rem'}}>
                <FormLabel>Team Number <sup className='req'>*</sup></FormLabel>
                <Autocomplete
                    required
                    type="number"
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

                <FormLabel>Alliance <sup className='req'>*</sup></FormLabel>
                {/* fancy buttons */}
                <RadioGroup
                    orientation="horizontal"
                    aria-label="alliance color"
                    name="alliance-color"
                    variant="outlined"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    sx={{width: 'fit-content', marginBottom: '1rem'}}
                    >
                    {['red', 'blue'].map((item) => (
                        <Box
                        key={item}
                        sx={(theme) => ({
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 'fit-content',
                            height: 48,
                            padding: '1rem !important',
                            '&:not([data-first-child])': {
                            borderLeft: '1px solid',
                            borderColor: 'divider',
                            },
                            [`&[data-first-child] .${radioClasses.action}`]: {
                            borderTopLeftRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                            borderBottomLeftRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                            },
                            [`&[data-last-child] .${radioClasses.action}`]: {
                            borderTopRightRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                            borderBottomRightRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                            },
                        })}
                        >
                        <Radio
                            value={item}
                            disableIcon
                            overlay
                            label={
                            {
                                red: 'Red',
                                blue: 'Blue'
                            }[item]
                            }
                            variant={color === item ? 'solid' : 'plain'}
                            slotProps={{
                            input: { 'aria-label': item,
                            sx: { backgroundColor: `${color} === 'red' : '#000' ? 'transparent'`}
                            },
                            action: {sx: { borderRadius: 0, transition: 'none' }},
                            label: { sx: { lineHeight: 0 } },
                            radio: { sx: { backgroundColor: `${color} === 'red' : '#000' ? 'transparent'`} }
                            }}
                        />
                        </Box>
                    ))}
                </RadioGroup>

                <div className={styles.startPosLabel}>
                    <FormLabel>Starting Position <sup className='req'>*</sup></FormLabel>
                    <Button
                        variant='outlined'
                        size='sm'
                        onClick={() => setModalOpen(true)}
                        sx={{ml:1}}
                    >View Guide</Button>
                </div>
                <FormControl sx={{marginBottom: '1rem'}}>
                { color === 'blue' && (
                    <RadioGroup
                    name='blue-pos'
                    value={startPos}
                    onChange={(e) => {setStartPos(e.target.value), console.log(startPos)}}
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
                    onChange={(e) => {setStartPos(e.target.value), console.log(startPos)}}
                    >
                        <Radio value='Against R1 Wall' label='Against R1 Wall'/>
                        <Radio value='Against R2 Wall' label='Against R2 Wall'/>
                        <Radio value='Left Diagonal Subwoofer' label='Left Diagonal Subwoofer'/>
                        <Radio value='Centered Subwoofer' label='Centered Subwoofer'/>
                        <Radio value='Right Diagonal Subwoofer' label='Right Diagonal Subwoofer'/>
                        <Radio value='Against R3 Wall' label='Against R3 Wall'/>
                    </RadioGroup>
                )}
                { color === '' && (<p>Select an alliance!</p>)}
                </FormControl>

                <h2>Auto</h2>
                {/* cross auto line */}
                <FormControl sx={{ marginBottom: '1rem'}}>
                    <FormLabel>Did robot cross the Auto Line?</FormLabel>
                    <RadioGroup
                    name='match-auto-line'
                    value={autoLine}
                    onChange={(e) => {setLine(e.target.value), console.log(autoLine)}}
                    >
                        <Radio value='yes' label='Yes'/>
                        <Radio value='no' label='No'/>
                    </RadioGroup>
                </FormControl>

                {/* Note scored in amp */}
                <FormControl sx={{ marginBottom: '1rem'}}>
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
                <FormControl sx={{ marginBottom: '1rem'}}> 
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
                <FormControl sx={{ marginBottom: '1rem'}}>
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
                <FormControl sx={{ marginBottom: '1rem'}}> 
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
                <FormControl sx={{ marginBottom: '1rem'}}> 
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
                <FormControl sx={{ marginBottom: '1rem'}}>
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
                    <FormControl sx={{ marginBottom: '1rem'}}>
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

                    <FormControl sx={{ marginBottom: '1rem'}}>
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

                <FormControl sx={{ marginBottom: '1rem'}}>
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
                <FormControl sx={{ marginBottom: '1rem'}}>
                    <FormLabel>Did robot lose comms at any point (or get disabled)?</FormLabel>
                    <RadioGroup
                    name='attempt-defense'
                    value={robotDisabled}
                    onChange={(e) => {setRobotDisabled(e.target.value)}}
                    >
                        <Radio value='yes' label='Yes'/>
                        <Radio value='no' label='No'/>
                    </RadioGroup>
                </FormControl>

                {attemptDefense === 'yes' && (
                    <FormControl sx={{ marginBottom: '1rem'}}>
                        <FormLabel>Did robot attempt to play defense?</FormLabel>
                        <RadioGroup
                        name='match-disabled'
                        value={attemptDefense}
                        onChange={(e) => {setDefenseAttempt(e.target.value)}}
                        >
                            <Radio value='yes' label='Yes'/>
                            <Radio value='no' label='No'/>
                        </RadioGroup>
                    </FormControl>
                )}

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

                <FormControl  sx={{ marginBottom: '2rem'}}>
                    <FormLabel>Post-Match Comments</FormLabel>
                    <FormHelperText>Why was disabled, any fouls, etc.</FormHelperText>
                    <Textarea
                    minRows={2}
                    onChange={(e) => handleTextareaLimit(e.target.value)}
                    sx={{ maxWidth: 500, minWidth: 300 }}
                    error={comments.length > comments ? true : false}
                    />
                    <FormHelperText><span style={{color: (comments.length > 500 ? 'red' : 'unset' ?? 'unset')}}>{feedback.length}</span>/500</FormHelperText>
                </FormControl>

                <Button loading={loading} onClick={(e) => {handleValidate(e)}}>Submit Survey</Button>
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
