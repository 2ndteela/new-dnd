import React, { useCallback } from 'react'
import CharacterSelect from '../CharacterSelect/CharacterSelect'
import './Resources.css'
import { useNavigate } from 'react-router-dom';

export default function Resources() {

  const navigate = useNavigate()

  const goToMonsters = useCallback(() => {
    navigate('/monsters')
  }, [navigate])

  return (
    <div className='page-content'>
      <div className='resource-container'>
        <h2>DM Resources</h2>
        <button onClick={goToMonsters} id="monster-tracker-button" className='flat-button'>Monster Database and Initiative Tracker</button>
      </div>
      <div className='resource-container'>
        <h2>Characters</h2>
        <CharacterSelect />
      </div>
    </div>
  )
}
