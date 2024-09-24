'use client'
import Image from "next/image";
import { Button, Autocomplete, FormControl, FormLabel, Input, RadioGroup, Radio, List, ListItem, Checkbox, FormHelperText, Snackbar, Textarea } from '@mui/joy'
import MenuButton from "@/components/menu-button";
import { orlandoAllTeams } from "../data/orlando-all-teams";
import { useState, useRef } from "react";
import styles from './pit.module.css'

//images
import WCD from '../../public/images/westcoastdrive.png'
import Mec from '../../public/images/mecanumdrive.png'
import Tank from '../../public/images/tankdrive.jpg'
import Swerve from '../../public/images/swervedrive.jpg'

// import type { PutBlobResult } from '@vercel/blob'; //js quickstart does not have typing but has defined w `as`

export default function PitSurveyPage() {
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE;
  const isOffseason = process.env.NEXT_PUBLIC_OFFSEASON;
  const isHiatus = process.env.NEXT_PUBLIC_SEASON_HIATUS;

  const [teamNumber, setTeamNumber] = useState('')
  const [drivetrain, setDrivetrain] = useState('')
  const [prefPos, setPrefPos] = useState([])
  const [vision, setVision] = useState('')
  const [scoreHeight, setScoreHeight] = useState('')
  const [pickup, setPickup] = useState('')
  const [climb, setClimb] = useState('')
  const [helpClimb, setHelpClimb] = useState(null)
  const [scoreClimb, setScoreClimb] = useState(null)
  const [investigate, setInvestigate] = useState('')
  const [feedback, setFeedback] = useState('')
  const [name, setName] = useState('')

  //form state
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null);
  // const [validated, setValidated] = useState(false)

  //checkboxes
  const [leftChecked, setLeft] = useState(false)
  const [centerChecked, setCenter] = useState(false)
  const [rightChecked, setRight] = useState(false)

  //drivetrain radio, managed this way because of the custom "button" divs
  const [westSelected, setWest] = useState(false)
  const [mecanumSelected, setMec] = useState(false)
  const [tankSelected, setTank] = useState(false)
  const [swerveSelected, setSwerve] = useState(false)
  const [isOtherSelected, setOther] = useState(false)

  // const [frontImage, setFrontImage] = useState()
  // const [sideImage, setSideImage] = useState()
  const frontImageRef = useRef(null)
  const sideImageRef = useRef(null)
  // const [frontImageSize, setFrontImageSize] = useState(0.0)
  // const [sideImageSize, setSideImageSize] = useState(0.0)
  // const [unit, setUnit] = useState('MB')

  //snackbar state
  const [open, setOpen] = useState(false)
  const [errorString, setErrorString] =useState('')
  const [submitSuccess, setSuccess] = useState(false) //mainly used for controlling snackbar open duration
  const [color, setColor] = useState('neutral')

  function handleCheckbox(value, checked){
    // console.log(`${value}, ${checked}`)

    if(checked == undefined){
      console.log('returning undefined')
      setPrefPos([...prefPos, value])
    }
    if(checked == true){
      setPrefPos([...prefPos, value])
      // console.log('added')
    } else if(checked == false) {
      setPrefPos(
        prefPos.filter(a =>
          a !== value
      ))
      // console.log('removed')
    }
  }

  function handleInputChange(event, value) {
    setTeamNumber(value);
  }

  function drivetrainHelper(radioValue){
    switch (radioValue) {
      case 'west coast drive':
        setDrivetrain(radioValue)
        setWest(true)
        setMec(false)
        setTank(false)
        setSwerve(false)
        setOther(false)
        break;
      case 'mecanum':
        setDrivetrain(radioValue)
        setMec(true)
        setWest(false)
        setTank(false)
        setSwerve(false)
        setOther(false)
        break;
      case 'tank':
        setDrivetrain(radioValue)
        setTank(true)
        setWest(false)
        setMec(false)
        setSwerve(false)
        setOther(false)
        break;
      case 'swerve':
        setDrivetrain(radioValue)
        setSwerve(true)
        setWest(false)
        setMec(false)
        setTank(false)
        setOther(false)
      break;
      case 'other':
        setOther(true)
        setWest(false)
        setMec(false)
        setTank(false)
        setSwerve(false)
      break;
    }
  }

  function submitHelper(isHiatus, e){
    if(isHiatus && !isDevMode){
      handleisHiatusseasonSubmit()
      return null
    }

    if(!isHiatus || isDevMode){
      handleValidate(e)
    }
  }

  function handleValidate(passedEvent){
    if (teamNumber==='' || !drivetrain || !prefPos || !vision
      || !scoreHeight || !pickup || !climb || !investigate || !name){
    setErrorString('Check required fields!')
    setColor('danger')
    setSuccess(false)
    setOpen(true)
    return false;
    }

    else if(feedback && feedback.length > 500){
      setErrorString('Feedback must be at most 255 chars.')
      setColor('danger')
      setSuccess(false)
      setOpen(true)
      return false;
    }

    //if everything is good, try to upload images here since handleSubmit is async
    uploadAndSubmit(passedEvent)
  }

  async function uploadAndSubmit(passedEvent){
    console.log('starting...')
    let frontImgBlobURL = await uploadImage(frontImageRef);
    console.log(frontImgBlobURL)
    let sideImgBlobURL = await uploadImage(sideImageRef)
    console.log(sideImgBlobURL)
    await handleSubmit(passedEvent, frontImgBlobURL, sideImgBlobURL)
    console.log('done!')
  }

  const handleSubmit = async (e, f, s) => {
    setLoading(true)
    e.preventDefault()

    //join into one string
    var allPrefPos = prefPos.join(",");
 
    console.log(teamNumber, drivetrain, allPrefPos, vision, scoreHeight, pickup, climb, helpClimb, scoreClimb, investigate, feedback, name, f, s)

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
      feedback: feedback,
      name: name,
      frontImageURL: f,
      sideImageURL: s
    }

    let fetchString = '/api/pit-result' //default
    if(isDevMode == "true"){
      fetchString = '/api/dev/pit-result'
    }

    fetch(fetchString, {
      method: 'POST', 
      body: JSON.stringify(data),
      headers:{ 'Content-Type': 'application/json' }
    })
    .then((response => {
      if(!response.ok){
          setSuccess(false)
          setColor('danger')

          switch (response.status) {
            case 400:
                setErrorString('Server validation error! All fields required.')
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
          setColor('success')
          formRef.current.reset();

          // console.log(`frontImageSize: ${frontImageSize}`)
          // if(frontImageSize != 0.0){
          //   setFrontImageSize(0.0)
          //   console.log('front to 0')
          //   setUnit("MB")
          // }
          // console.log(`frontImageSize: ${frontImageSize}`)

          // console.log(`sideImageSize: ${sideImageSize}`)
          // if(sideImageSize != 0.0){
          //   setSideImageSize(0.0)
          //   console.log('side to 0')
          // }
          // console.log(`sideImageSize: ${sideImageSize}`)

          setTeamNumber('')

          setLeft(false)    //setting bc customs
          setCenter(false)
          setRight(false)

          setDrivetrain('') //setting bc customs
          setWest(false)
          setMec(false)
          setTank(false)
          setSwerve(false)
          setOther(false)

          setPrefPos([])
          setVision('')
          setScoreHeight('')
          setPickup('')
          setClimb('')
          setHelpClimb(null)
          setScoreClimb(null)
          setInvestigate('')
          setFeedback('')
          setName('')

          //! set back to null here so File object does not remain
          frontImageRef.current = null;
          sideImageRef.current = null;

          document.querySelectorAll('.preview-img').forEach((img) => {
              img.remove();
          });
      }
      setOpen(true)
      setLoading(false)
  }))
  .catch(error => {
      console.log(error)
  })
  }

  function handleImageAssignmentPreview(e){
    //grab first file from target because this "e.target" is
    //meant to be a array capable of holding multiple images if needed
    //(see MDN docs on File API https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#accessing_selected_files)
    const eventTarget = e.target  //the upload button that is clicked
    const file = eventTarget.files[0] //first (and only) file selected with/using the button element
    const frontPreview = document.getElementById('preview-1')
    const sidePreview = document.getElementById('preview-2')

    //show file size bc Vercel Blob only allows a Server Upload of 4.5 MB
    // const bytes = file.size
    // // console.log(bytes)
    // var convertedSize = 0.0;
    // if(bytes < 1000000){
    //   setUnit('KB')
    //   convertedSize = Math.floor(bytes/1000).toFixed(2);
    // } else{ //use case: if user reuploads an img and it happens to be MB
    //     setUnit('MB')
    //     convertedSize = Math.floor(bytes/1000000).toFixed(2); 
    // }

    if(eventTarget.id === 'front-picture'){
      try {
        frontImageRef.current = file
        // console.log(frontImageRef.current)
        // setFrontImageSize(convertedSize)
        setColor('primary')
        setErrorString('Attached front image!')

        //check if img preview exists first (ex: if re-uploading)
        if(document.getElementById('front-img')){
          document.getElementById('front-img').remove();
        }

        var img = document.createElement("img");
        img.classList.add("preview-img");
        img.id = 'front-img'
        img.file = file;
        frontPreview.appendChild(img);

        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);   //converts to more accessible data url
      } catch (error) {
        setColor('warning')
        setErrorString('Error attaching front image!')
        alert(error)
      }
    }
    
    else if(eventTarget.id === 'side-picture'){
      try {
        sideImageRef.current = file
        console.log(sideImageRef.current)
        // setSideImageSize(convertedSize)
        setColor('primary')
        setErrorString('Attached side image!')  //custom string aside from vanilla "submitted!"

        //check if img preview exists
        if(document.getElementById('side-img')){
          document.getElementById('side-img').remove();
        }

        const img = document.createElement("img");
        img.classList.add("preview-img");
        img.id = 'side-img'
        img.file = file;
        sidePreview.appendChild(img);
      
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setColor('warning')
        setErrorString('Error attaching side image!')
        alert(error)
      }
    }

    setOpen(true) //show snackbar after color/string has been set
  }

  async function uploadImage(ref){
    // if(instantlyKnowIfSubmit == true){ // await only allowed at upper level so wrap in conditional
      console.log('reached img upload')
      const img = ref.current;
      //if nothing was ever attached or was an error,
      //ref will not change and have ALL properties/attributes associated w an Element.
      //Ref with an upload will have File Object properties only.
      if(img == null || img.hasOwnProperty('files')){
        setColor('neutral')
        setErrorString("No image to upload.")
        setSuccess(false) //use longer time duration
        setOpen(true)
        return null;
      }

      setLoading(true)
      setColor('neutral')
      setErrorString("Uploading images...")
      setSuccess(false)
      setOpen(true)

      const response = await fetch(
        `/api/upload-pit-images?filename=${img.name}`,
        {
          method: 'POST',
          body: img,
        },
      ).catch(err => console.log(err))

      const blob = (await response.json());
      // console.log(blob)
      if(blob == null || blob === undefined){
        setColor('danger')
        setErrorString("Error uploading image!")
        console.error(blob)
        return null;
      } else {
        setColor('success')
        setErrorString("Uploaded image!")
        return blob.url;
      }
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
    // setLoading(true)
    setColor('warning')
    setErrorString('HIATUS MODE enabled: cannot submit new records!')
    setSuccess(false)
    setOpen(true)
  }

  // useEffect(() => {
  //   console.log(`frontSize: ${frontImageSize}`);
  // }, [frontImageSize]);

  // useEffect(() => {
  //   console.log(`sideSize: ${sideImageSize}`);
  // }, [sideImageSize]);

  return (
    <>
        <MenuButton/>

        <h1>Pit Survey</h1>
        <form ref={formRef}>
        <h2>General</h2>
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

        <FormControl sx={{ marginBottom: '1rem'}}>
          <FormLabel>Drivetrain Type <sup className='req'>*</sup></FormLabel>
          <RadioGroup name="radio-buttons-drivetrain" value={drivetrain}>
            <div className={styles.radioContainer}>
            <Radio value="west coast drive" checked={westSelected} sx={{display: 'none'}}/>
            <div className={`${styles.customRadio} ${westSelected ? styles.dtSelected : ''}`} onClick={() => drivetrainHelper('west coast drive')}>
              <Image className={styles.customRadioImage} src={WCD} alt='west-coast-example'/>
              West Coast Drive
            </div>
            
            <Radio value="mecanum" checked={mecanumSelected} sx={{display: 'none'}}/>
            <div className={`${styles.customRadio} ${mecanumSelected ? styles.dtSelected : ''}`} onClick={() => drivetrainHelper('mecanum')}>
              <Image className={styles.customRadioImage} src={Mec} alt='mecanum-example'/>
              Mecanum Drive
            </div>
            
            <Radio value="tank" checked={tankSelected} sx={{display: 'none'}}/>
            <div className={`${styles.customRadio} ${tankSelected ? styles.dtSelected : ''}`} onClick={() => drivetrainHelper('tank')}>
              <Image className={styles.customRadioImage} src={Tank} alt='tank-example'/>
              Tank Drive (treads)
            </div>
            
            <Radio value="swerve" checked={swerveSelected} sx={{display: 'none'}}/>
            <div className={`${styles.customRadio} ${swerveSelected ? styles.dtSelected : ''}`} onClick={() => drivetrainHelper('swerve')}>
              <Image className={styles.customRadioImage} src={Swerve} alt='swerve-example'/>
              Swerve Drive
            </div>
            
            <div>
              <Radio value="other" checked={isOtherSelected} sx={{display: 'none', margin: '0 auto'}}/>
              <div className={`${styles.customRadio} ${isOtherSelected ? styles.dtSelected : ''}`} onClick={() => drivetrainHelper('other')}>
                Other
              </div>
              {isOtherSelected && isOtherSelected &&
                <Input
                onChange={(e) => setDrivetrain(e.target.value)}
                sx={{ width: 300 }}
                />
              }
            </div>
            </div>
          </RadioGroup>
        </FormControl>

        <FormControl  sx={{ marginBottom: '1rem'}}>
          <FormLabel>Preferred Starting Position <sup className='req'>*</sup></FormLabel>
          <FormHelperText>Drive team can have multiple preferences</FormHelperText>
          <div role="group" aria-labelledby="preferred-pos-group">
            <List size="sm">
              <ListItem>
                <Checkbox label="Left" value='left' checked={leftChecked} onChange={(e) => {setLeft(e.target.checked), handleCheckbox(e.target.value, e.target.checked)}}/>
              </ListItem>
              <ListItem>
                <Checkbox label="Center/Subwoofer Area" value='center area' checked={centerChecked} onChange={(e) => {setCenter(e.target.checked), handleCheckbox(e.target.value, e.target.checked)}}/>
              </ListItem>
              <ListItem>
                <Checkbox label="Right" value='right'  checked={rightChecked} onChange={(e) => {setRight(e.target.checked), handleCheckbox(e.target.value, e.target.checked)}}/>
              </ListItem>
            </List>
          </div>
        </FormControl>

        <FormControl  sx={{ marginBottom: '1rem'}}>
          <FormLabel>Does the robot have vision tracking? <sup className='req'>*</sup></FormLabel>
          <RadioGroup name="radio-buttons-vision"
              value={vision}
              onChange={(e) => setVision(e.target.value)}>
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </RadioGroup>
        </FormControl>

        <FormControl  sx={{ marginBottom: '1rem'}}>
          <FormLabel>Which heights can the robot score from? <sup className='req'>*</sup></FormLabel>
          <RadioGroup name="radio-buttons-score-height"
          value={scoreHeight}
          onChange={(e) => setScoreHeight(e.target.value)}>
            <Radio value="amp" label="Amp" />
            <Radio value="shooter" label="Shooter" />
            <Radio value="both" label="Both" />
          </RadioGroup>
        </FormControl>

        <FormControl  sx={{ marginBottom: '1rem'}}>
          <FormLabel>Where can the robot pick up game pieces from? <sup className='req'>*</sup></FormLabel>
          <RadioGroup name="radio-buttons-pickup"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}>
            <Radio value="floor" label="Floor" />
            <Radio value="human player station" label="Human Player Station" />
            <Radio value="both" label="Both" />
          </RadioGroup>
        </FormControl>

        <h2>Endgame</h2>
        <FormControl  sx={{ marginBottom: '1rem'}}>
          <FormLabel>Can the robot climb? <sup className='req'>*</sup></FormLabel>
          <RadioGroup name="radio-buttons-climb"
          value={climb}
          onChange={(e) => setClimb(e.target.value)}>
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </RadioGroup>
        </FormControl>

        { climb === 'yes' && (
          <>
          <FormControl  sx={{ marginBottom: '1rem'}}>
            <FormLabel>Can the robot help another robot to climb?</FormLabel>
            <RadioGroup name="radio-buttons-climb-help"
            value={helpClimb}
            onChange={(e) => setHelpClimb(e.target.value)}>
              <Radio value="yes" label="Yes" />
              <Radio value="no" label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl  sx={{ marginBottom: '1rem'}}>
            <FormLabel>Can the robot score while climbing?</FormLabel>
            <RadioGroup name="radio-buttons-climb-score"
            value={scoreClimb}
            onChange={(e) => setScoreClimb(e.target.value)}>
              <Radio value="yes" label="Yes" />
              <Radio value="no" label="No" />
            </RadioGroup>
          </FormControl>
          </>
        )}

        <h2 style={{marginBottom:0}}>Pictures</h2>
        <small>Max size of each image: 4.5 MB</small>
        <FormControl  sx={{ marginBottom: '1rem', height:'fit-content !important'}}>
          <label htmlFor="front-picture"><strong>Front</strong> View:</label>
          <input
            type="file"
            ref={frontImageRef}
            id="front-picture"
            name="picture"
            accept="image/*"
            capture="environment" //! this is what allows for camera functionality on mobile. desktop triggers file browser
            onChange={handleImageAssignmentPreview}
          />
          {/* <output id='filesize-front'><small>{frontImageSize} {unit}</small></output> */}
          <div id="preview-1" className={styles.imgPreview}></div>
        </FormControl>
        
        <FormControl  sx={{ marginBottom: '1rem', height:'fit-content !important'}}>
          <label htmlFor="side-picture"><strong>Side</strong> View:</label>
          <input
            type="file"
            ref={sideImageRef}
            id="side-picture"
            name="picture"
            accept="image/*"
            capture="environment"  //! this is what allows for camera functionality on mobile. desktop triggers file browser
            onChange={handleImageAssignmentPreview}/>
          {/* <output id='filesize-side'><small>{sideImageSize} {unit}</small></output> */}
          <div id="preview-2" className={styles.imgPreview}></div>
        </FormControl>

        <h2>Information</h2>
        <FormControl  sx={{ marginBottom: '1rem'}}>
          <FormLabel>Do you think this robot is worth investigating? <sup className='req'>*</sup></FormLabel>
          <RadioGroup name="radio-buttons-investigate"
          value={investigate}
          onChange={(e) => setInvestigate(e.target.value)}>
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </RadioGroup>

          {investigate && investigate === 'yes' && 
          <div>
            <FormLabel>Why? Explain your reason.</FormLabel>
            <Textarea
            minRows={3}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ minWidth: 300, maxWidth: 500 }}
            error={feedback.length > 500 ? true : false ?? false}
            />
            <FormHelperText><span style={{color: (feedback.length > 500 ? 'red' : 'unset' ?? 'unset')}}>{feedback.length}</span>/500</FormHelperText>
          </div>
          }
        </FormControl>

        <FormControl  sx={{ marginBottom: '1rem'}}>
          <FormLabel>First Name <sup className='req'>*</sup></FormLabel>
          <Input
          required
          onChange={(e) => setName(e.target.value)}
          sx={{ width: 300 }}
          />
        </FormControl>
        
        <Button loading={loading} onClick={(e) => submitHelper(isHiatus, e)}>Submit Survey</Button>
        </form>

        <Snackbar
        variant="solid"
        color={color}
        autoHideDuration={errorString === 'Uploading images...' ? null : (submitSuccess ? 3500 : 5000 ?? 3500)}
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
