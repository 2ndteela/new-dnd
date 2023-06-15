import React, {useState} from 'react'
import './CharacterCreation.css'
import Stats from './CharacterCreationPages/Stats'
import Class from './CharacterCreationPages/Class'

export default function CharacterCreation() {
  const [ step, setStep ] = useState(0)
  

  function changePage(increment) {
    if(increment < 0 && step > 0) setStep(step-1) 
    else if(increment > 0 && step < 10) setStep(step+1)
  }

  return (
    <div>
      {step === 0 && <Class />}
      {step === 1 && <Stats />}
      <div style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: '0px 16px', paddingBottom: '16px'}} >
        {step > 0 && <button onClick={() => changePage(-1)} >Back</button>}
        <div/>
        <button className='no-margin-button' onClick={() => changePage(1)} >Next</button>
      </div>
    </div>
  )
}
