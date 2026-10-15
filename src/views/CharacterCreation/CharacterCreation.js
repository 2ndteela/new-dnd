import React, {useState} from 'react'
import './CharacterCreation.css'
import Stats from './CharacterCreationPages/Stats'
import Class from './CharacterCreationPages/Class'
import Button from '../../components/Button/Button'

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
      <div className='creation-nav' >
        {step > 0 && <Button onClick={() => changePage(-1)} >Back</Button>}
        <div/>
        <Button onClick={() => changePage(1)} >Next</Button>
      </div>
    </div>
  )
}
