'use client'
// import Image from "next/image";
import { Button, Autocomplete, FormControl, FormLabel, Input, RadioGroup, Radio, List, ListItem, Checkbox, FormHelperText, Snackbar } from '@mui/joy'
import MenuButton from "@/components/menu-button";
import { SFLAllTeams } from "./sfl-all-teams";
import { useState, useRef } from "react";

export default function PitSurveyPage() {
  const [teamNumber, setTeamNumber] = useState('')
  const [drivetrain, setDrivetrain] = useState('')
  const [prefPos, setPrefPos] = useState([])
  const [vision, setVision] = useState('')
  const [scoreHeight, setScoreHeight] = useState('')
  const [pickup, setPickup] = useState('')
  const [climb, setClimb] = useState('')
  const [helpClimb, setHelpClimb] = useState('')
  const [scoreClimb, setScoreClimb] = useState('')
  const [investigate, setInvestigate] = useState('')
  const [name, setName] = useState('')

  const [loading, setLoading] = useState(false)
  const formRef = useRef(null);

  //checkboxes
  const [leftChecked, setLeft] = useState(false)
  const [centerChecked, setCenter] = useState(false)
  const [rightChecked, setRight] = useState(false)

  //snackbar state
  const [open, setOpen] = useState(false)
  const [errorString, setErrorString] =useState('')
  const [submitSuccess, setSuccess] = useState(false)

  function handleCheckbox(value, checked){
    console.log(`${value}, ${checked}`)

    if(checked == undefined){
      console.log('returning undefined')
      setPrefPos([...prefPos, value])
    }
    if(checked == true){
      setPrefPos([...prefPos, value])
      console.log('added')
      console.log(prefPos)
    } else if(checked == false) {
      setPrefPos(
        prefPos.filter(a =>
          a !== value
        ))
      console.log('removed')
      console.log(prefPos)
    }
  }

  function handleInputChange(event, value) {
    console.log(value);
    setTeamNumber(value);
  }

  function handleSubmit(e){
    setLoading(true)
    e.preventDefault()

    var allPrefPos = prefPos.join(",");
    console.log(allPrefPos)
 
    // const formData = new FormData(e.target)
    // console.log(formData)

    // console.log(e.target[0].value)
    console.log(teamNumber, drivetrain, vision, scoreHeight, pickup, climb, helpClimb, scoreClimb, investigate, name)

    const data = {
      teamNumber: teamNumber,
      drivetrain: drivetrain,
      prefPos: allPrefPos,
      vision: vision,
      scoreHeight: scoreHeight,
      pickup: pickup,
      climb: climb,
      helpClimb: helpClimb,
      scoreClimb: scoreClimb,
      investigate: investigate,
      name: name
     }

    fetch('/api/pitsurvey', {
      method: 'POST', 
      body: JSON.stringify(data),
      headers:{ 'Content-Type': 'application/json' }
    })
    .then((response => {
      if(!response.ok){
          setSuccess(false)

          switch (response.status) {
              case 400:
                  setErrorString('Validation error! Check required fields.')
                  break;
              case 500:
                  setErrorString('API error!')
                  break;
              default:
                  setErrorString('Error! Please try again.')
                  break;
          }

          // return Promise.reject(response)
      } else { //reset
          setSuccess(true)
          formRef.current.reset();
          setTeamNumber('0')

          setLeft(false)
          setCenter(false)
          setRight(false)

          setDrivetrain('')
          setPrefPos([])
          setVision('')
          setScoreHeight('')
          setPickup('')
          setClimb('')
          setHelpClimb('')
          setScoreClimb('')
          setInvestigate('')
          setName('')
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

        <h1>Pit Survey</h1>
        <p style={{color: 'red'}}>Please fill out all form fields</p>
        <p style={{color: 'red'}}><strong>Current Known Bugs:</strong>: Team Number does not visually reset. The <strong>value is reset on form submit</strong>. Please choose a new number or the field will be empty.</p>
        <form ref={formRef}>
        <h2>General</h2>
        <FormControl>
          <FormLabel>Team Number</FormLabel>
          <Autocomplete
            required
            options={SFLAllTeams}
            inputValue={teamNumber === '' ? '0' : teamNumber}
            onInputChange={handleInputChange}
            // clearOnBlur
            sx={{ width: 300 }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Drivetrain Type</FormLabel>
          <RadioGroup name="radio-buttons-drivetrain"
                value={drivetrain}
                onChange={(e) => setDrivetrain(e.target.value)}
                >
            <Radio value="west-coast" label="West Coast Drive" />
            <Radio value="mecanum" label="Mecanum" />
            <Radio value="tank" label="Tank (treads)" />
            <Radio value="swerve" label="Swerve" />
            <Radio value="other" label="Other" />
          </RadioGroup>
          {/* <FormHelperText>This is helper text.</FormHelperText> */}
        </FormControl>

        {/* <FormControl> */}
          <FormLabel>Preferred Starting Position</FormLabel>
          <FormHelperText>Drive team can have multiple preferences</FormHelperText>
          <div role="group" aria-labelledby="preferred-pos-group">
            <List size="sm">
              <ListItem>
                <Checkbox label="Left" value='left' checked={leftChecked} onChange={(e) => {setLeft(e.target.checked), handleCheckbox(e.target.value, e.target.checked)}}/>
              </ListItem>
              <ListItem>
                <Checkbox label="Center" value='center' checked={centerChecked} onChange={(e) => {setCenter(e.target.checked), handleCheckbox(e.target.value, e.target.checked)}}/>
              </ListItem>
              <ListItem>
                <Checkbox label="Right" value='right'  checked={rightChecked} onChange={(e) => {setRight(e.target.checked), handleCheckbox(e.target.value, e.target.checked)}}/>
              </ListItem>
            </List>
          </div>
        {/* </FormControl> */}

        <FormControl>
          <FormLabel>Does the robot have vision tracking?</FormLabel>
          <RadioGroup name="radio-buttons-vision"
              value={vision}
              onChange={(e) => setVision(e.target.value)}>
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Which heights can the robot score from?</FormLabel>
          <RadioGroup name="radio-buttons-score-height"
          value={scoreHeight}
          onChange={(e) => setScoreHeight(e.target.value)}>
            <Radio value="amp" label="Amp" />
            <Radio value="shooter" label="Shooter" />
            <Radio value="both" label="Both" />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Where can the robot pick up game pieces from?</FormLabel>
          <RadioGroup name="radio-buttons-pickup"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}>
            <Radio value="floor" label="Floor" />
            <Radio value="human player station" label="Human Player Station" />
            <Radio value="both" label="Both" />
          </RadioGroup>
        </FormControl>

        <h2>Endgame</h2>
        <FormControl>
          <FormLabel>Can the robot climb?</FormLabel>
          <RadioGroup name="radio-buttons-climb"
          value={climb}
          onChange={(e) => setClimb(e.target.value)}>
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Can the robot help another robot to climb?</FormLabel>
          <RadioGroup name="radio-buttons-climb-help"
          value={helpClimb}
          onChange={(e) => setHelpClimb(e.target.value)}>
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Can the robot score while climbing?</FormLabel>
          <RadioGroup name="radio-buttons-climb-score"
          value={scoreClimb}
          onChange={(e) => setScoreClimb(e.target.value)}>
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </RadioGroup>
        </FormControl>

        <h2>Information</h2>
        <FormControl>
          <FormLabel>Do you think this robot is worth investigating?</FormLabel>
          <RadioGroup name="radio-buttons-invesitgate"
          value={investigate}
          onChange={(e) => setInvestigate(e.target.value)}>
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Full Name</FormLabel>
          <Input
          required
          onChange={(e) => setName(e.target.value)}
          sx={{ width: 300 }}
          />
        </FormControl>
        
        <Button loading={loading} onClick={handleSubmit}>Submit Survey</Button>
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
    </>


  )
}