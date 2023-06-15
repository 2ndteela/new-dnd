import React, {useState} from 'react'
import './CharacterCreation.css'
import Stats from './CharacterCreationPages/Stats'
import Class from './CharacterCreationPages/Class'

export default function CharacterCreation() {
  const [ step, setStep ] = useState(0)

  return (
    <div>
      {step === 0 && <Class />}
      {step === 1 && <Stats />}
    </div>
  )
}
