'use client'
import Image from "next/image";
import { Button, Autocomplete, FormControl, FormLabel, Input, RadioGroup, Radio, List, ListItem, Checkbox, FormHelperText } from '@mui/joy'
import MenuButton from "@/components/menu-button";
import { SFLAllTeams } from "./sfl-all-teams";
import { useState } from "react";

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

  function handleSubmit(e){
    e.preventDefault()
 
    // const formData = new FormData(e.target)
    // console.log(formData)

    // console.log(e.target[0].value)
    console.log(teamNumber, drivetrain, prefPos, vision, scoreHeight, pickup, climb, helpClimb, scoreClimb, investigate)
  }

  return (
    <>
        <MenuButton/>

        <h1>Pit Survey</h1>
        <p style={{color: 'red'}}>Please fill out all form fields</p>
        <form>
        <h2>General</h2>
        <FormControl>
          <FormLabel>Team Number</FormLabel>
          <Autocomplete
            required
            options={SFLAllTeams}
            onChange={(e) => setTeamNumber(e.target.value)}
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
                <Checkbox label="Left" value='left' onChange={(e) => setPrefPos([...prefPos, e.target.value])}/>
              </ListItem>
              <ListItem>
                <Checkbox label="Center" value='center' onChange={(e) => setPrefPos([...prefPos, e.target.value])}/>
              </ListItem>
              <ListItem>
                <Checkbox label="Right" value='right' onChange={(e) => setPrefPos([...prefPos, e.target.value])}/>
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
        </form>

        <Button onClick={handleSubmit}>Submit Survey</Button>
    </>
  )
}