import React, { useState } from 'react'
import { MdChevronRight } from 'react-icons/md'
import Input from '../Input/Input'
import Button from '../Button/Button'

function describeEncounter({ turnNumber, round, counts }) {
  const status = turnNumber > 0 ? `Round ${round}` : 'Not started'
  const parts = [
    counts.characters && `${counts.characters} character${counts.characters === 1 ? '' : 's'}`,
    counts.monsters && `${counts.monsters} monster${counts.monsters === 1 ? '' : 's'}`,
    counts.events && `${counts.events} event${counts.events === 1 ? '' : 's'}`
  ].filter(Boolean)

  return [status, ...parts].join(' · ')
}

export default function EncounterList({ encounters, loadingKey, onOpen, onCreate }) {
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  async function create() {
    if (!name.trim() || creating) return
    setCreating(true)
    await onCreate(name.trim())
    setCreating(false)
    setName('')
  }

  return (
    <div className='initiative-tracker encounter-list'>
      <h3 className='setup-section-title'>Encounters</h3>
      {encounters === null && <div className='setup-empty'>Loading encounters...</div>}
      {encounters?.length === 0 && <div className='setup-empty'>No encounters yet. Create one to get started.</div>}
      {encounters?.map((enc) => (
        <Button
          key={enc.key}
          variant='flat'
          fullWidth
          className='encounter-list-item'
          disabled={loadingKey !== null}
          onClick={() => onOpen(enc.key)}
        >
          <div className='encounter-list-text'>
            <span className='encounter-list-name'>{enc.name}</span>
            <span className='encounter-list-detail'>
              {loadingKey === enc.key ? 'Loading...' : describeEncounter(enc)}
            </span>
          </div>
          <MdChevronRight />
        </Button>
      ))}
      <div className='setup-add-form'>
        <Input label='Encounter Name' val={name} onUpdate={setName} />
        <Button variant='flat' fullWidth disabled={!name.trim() || creating} onClick={create}>
          {creating ? 'Creating...' : 'New Encounter'}
        </Button>
      </div>
    </div>
  )
}
