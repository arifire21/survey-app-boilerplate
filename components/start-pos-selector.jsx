import Image from 'next/image'
import styles from '@/styles/startpos.module.css'
import Field from '../public/images/field-render.png'
import { RadioGroup, Radio, FormControl, Box } from '@mui/joy'
import { radioClasses } from '@mui/joy'
import { useState } from 'react'

export default function StartPosSelector(){
    const [startPos, setStartPos] = useState('')

    // const [isRed, setRed] = useState(null)
    const [color, setColor] = useState('');

    const [redLeftSelected, setRedLeft] = useState(false)
    const [redCenterSelected, setRedCenter] = useState(false)
    const [redRightSelected, setRedRight] = useState(false)
    const [blueLeftSelected, setBlueLeft] = useState(false)
    const [blueCenterSelected, setBlueCenter] = useState(false)
    const [blueRightSelected, setBlueRight] = useState(false)

    function redRadioHelper(radioValue){
      console.log(radioValue)
      switch (radioValue) {
        case 'red left':
          setStartPos(radioValue)
          setRedLeft(true)
          setRedCenter(false)
          setRedRight(false)
          break;
        case 'red center':
          setStartPos(radioValue)
          setRedLeft(false)
          setRedCenter(true)
          setRedRight(false)
          break;
        case 'red right':
          setStartPos(radioValue)
          setRedLeft(false)
          setRedCenter(false)
          setRedRight(true)
          break;
      }
    }

    function blueRadioHelper(radioValue){
      console.log(radioValue)
      switch (radioValue) {
        case 'blue left':
          setStartPos(radioValue)
          setBlueLeft(true)
          setBlueCenter(false)
          setBlueRight(false)
          break;
        case 'blue center':
          setStartPos(radioValue)
          setBlueLeft(false)
          setBlueCenter(true)
          setBlueRight(false)
          break;
        case 'blue right':
          setStartPos(radioValue)
          setBlueLeft(false)
          setBlueCenter(false)
          setBlueRight(true)
          break;
      }
    }

    return(
      <>

    <RadioGroup
      orientation="horizontal"
      aria-label="alliance color"
      name="alliance-color"
      variant="outlined"
      value={color}
      onChange={(event) => setColor(event.target.value)}
      sx={{width: 'fit-content'}}
    >
      {['red', 'blue'].map((item) => (
        <Box
          key={item}
          sx={(theme) => ({
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 48,
            height: 48,
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
              input: { 'aria-label': item },
              action: {sx: { borderRadius: 0, transition: 'none' }},
              label: { sx: { lineHeight: 0 } },
              radio: { sx: { backgroundColor: `${color} === 'red' : '#000' ? 'transparent'`} }
            }}
          />
        </Box>
      ))}
    </RadioGroup>

      <p>Positions are from <strong>driver's POV (facing the field)</strong></p>
      <p>Selected: {startPos}</p>
      <div className={styles.selectorContainer}>
        <div className={styles.imageContainer}>
                {/* render buttons first, use z index to make sure */}

          <div className={styles.gridContainer}>
            <div>1</div>
            <div>2</div>
            <div>3</div>  
            <div>4</div>
            <div>5</div> 

            <div>7</div>
            <div>8</div>
            <div>10</div>  
            <div>11</div>
            <div>12</div> 

            <div>13</div>
            <div>14</div>
            <div>15</div>  
            <div>16</div>
            <div>17</div>

            <div>18</div>
            <div>19</div>
            <div>20</div>  
            <div>21</div>
            <div>22</div>

            <div>23</div>
            <div>24</div>
            <div>25</div>  
            <div>26</div>
            <div>27</div> 

      {/* <div className={styles.buttonContainer}> */}
      {/* { color === '' && (
            <p className={styles.selectRender}>Select an alliance!</p>
      )}
      ,
      { color === 'red' && (
        <RadioGroup name="radio-buttons-start" value={startPos} className={styles.redRender}>
          <Radio value="red left" checked={redLeftSelected} sx={{display: 'none'}}/>
          <div className={`${styles.option} ${redLeftSelected ? styles.posSelected : ''}`} onClick={() => redRadioHelper('red left')}>
            red left
          </div>
          
          <Radio value="red center" checked={redCenterSelected} sx={{display: 'none'}}/>
          <div className={`${styles.option} ${redCenterSelected ? styles.posSelected : ''}`} onClick={() => redRadioHelper('red center')}>
            red center
          </div>
          
          <Radio value="red right" checked={redRightSelected} sx={{display: 'none'}}/>
          <div className={`${styles.option} ${redRightSelected ? styles.posSelected : ''}`} onClick={() => redRadioHelper('red right')}>
            red right
          </div>
          </RadioGroup>
        )}
          
        { color === 'blue' && (
          <RadioGroup name="radio-buttons-start" value={startPos} className={styles.blueRender}>
          <Radio value="blue left" checked={blueLeftSelected} sx={{display: 'none'}}/>
          <div className={`${styles.option} ${blueLeftSelected ? styles.posSelected : ''}`} onClick={() => blueRadioHelper('blue left')}>
            blue left
          </div>
          
          <Radio value="blue center" checked={blueCenterSelected} sx={{display: 'none'}}/>
          <div className={`${styles.option} ${blueCenterSelected ? styles.posSelected : ''}`} onClick={() => blueRadioHelper('blue center')}>
            blue center
          </div>
          
          <Radio value="blue right" checked={blueRightSelected} sx={{display: 'none'}}/>
          <div className={`${styles.option} ${blueRightSelected ? styles.posSelected : ''}`} onClick={() => blueRadioHelper('blue right')}>
            BR
          </div>
          </RadioGroup>
        )} */}
          {/* </div> */}
          </div>
          {/* CREDIT: https://www.chiefdelphi.com/t/2024-crescendo-top-down-field-renders/447764     */}
          <Image src={Field} alt='2024-field' fill style={{objectFit: 'contain'}}/>
        </div>
      </div>
      </>
    )
}