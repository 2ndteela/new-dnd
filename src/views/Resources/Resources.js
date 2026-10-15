import React, { useCallback } from 'react'
import CharacterSelect from '../CharacterSelect/CharacterSelect'
import './Resources.css'
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

export default function Resources() {

  const navigate = useNavigate()

  const goToMonsters = useCallback(() => {
    navigate('/monsters')
  }, [navigate])

  return (
    <div className='page-content'>
      <div className='resource-container'>
        <h2>DM Resources</h2>
        <Button variant='flat' fullWidth className='monster-tracker-button' onClick={goToMonsters}>Monster Database and Initiative Tracker</Button>
      </div>
      <div className='resource-container'>
        <h2>Characters</h2>
        <CharacterSelect />
      </div>
    </div>
  )
}
