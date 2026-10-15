import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'
import CheckBox from '../CheckBox/CheckBox'
import EditableText from '../EditableText/EditableText'
import Input from '../Input/Input'
import { getDexModifier } from './encounterData'
import './InitiativeSetup.css'

const SECTIONS = [
  { type: 'character', title: 'Characters', empty: 'No characters yet.' },
  { type: 'monster', title: 'Monsters', empty: 'Add monsters from the monster search.' },
  { type: 'event', title: 'Events', empty: 'No events yet.' }
]

function SetupRow({ entry, onUpdate, onRemove }) {
  const dex = getDexModifier(entry)

  function updateRoll(val) {
    const parsed = parseInt(val, 10)
    onUpdate(entry.id, { roll: Number.isNaN(parsed) ? '' : parsed })
  }

  return (
    <div className='setup-row'>
      <div className='setup-row-name'>
        <EditableText value={entry.name} label='Edit name' onSave={(name) => onUpdate(entry.id, { name })} />
        {entry.type === 'monster' && <span className='setup-row-dex'>Dex {dex >= 0 ? `+${dex}` : dex}</span>}
      </div>
      <input
        className='setup-roll-input'
        type='number'
        inputMode='numeric'
        placeholder='Roll'
        aria-label={`${entry.name} initiative roll`}
        value={entry.roll}
        onChange={(e) => updateRoll(e.target.value)}
      />
      <button className='setup-remove-button' aria-label={`Remove ${entry.name}`} onClick={() => onRemove(entry.id)}>
        <MdClose />
      </button>
    </div>
  )
}

function AddCharacterForm({ onAdd }) {
  const [name, setName] = useState('')

  function submit() {
    if (!name.trim()) return
    onAdd(name.trim())
    setName('')
  }

  return (
    <div className='setup-add-form'>
      <Input label='Character Name' val={name} onUpdate={setName} />
      <button className='flat-button setup-add-button' disabled={!name.trim()} onClick={submit}>Add Character</button>
    </div>
  )
}

function AddEventForm({ onAdd }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  function submit() {
    if (!name.trim()) return
    onAdd(name.trim(), description.trim())
    setName('')
    setDescription('')
  }

  return (
    <div className='setup-add-form'>
      <Input label='Event Name' val={name} onUpdate={setName} />
      <Input textarea label='Description' val={description} onUpdate={setDescription} />
      <button className='flat-button setup-add-button' disabled={!name.trim()} onClick={submit}>Add Event</button>
    </div>
  )
}

export default function InitiativeSetup({ entries, onUpdate, onRemove, onAddCharacter, onAddEvent, onRandomize, onStart, startLabel = 'Start Initiative' }) {
  const [includePlayers, setIncludePlayers] = useState(false)

  return (
    <div className='initiative-tracker initiative-setup'>
      {SECTIONS.map((section) => {
        const items = entries.filter((e) => e.type === section.type)
        return (
          <div key={section.type} className='setup-section'>
            <h3 className='setup-section-title'>{section.title}</h3>
            {items.length < 1 && <div className='setup-empty'>{section.empty}</div>}
            {items.map((entry) => (
              <SetupRow key={entry.id} entry={entry} onUpdate={onUpdate} onRemove={onRemove} />
            ))}
            {section.type === 'character' && <AddCharacterForm onAdd={onAddCharacter} />}
            {section.type === 'event' && <AddEventForm onAdd={onAddEvent} />}
          </div>
        )
      })}
      <CheckBox label='Include players when randomizing' model={includePlayers} onUpdate={setIncludePlayers} />
      <div className='turn-controls setup-controls'>
        <button className='flat-button' disabled={entries.length < 1} onClick={() => onRandomize(includePlayers)}>
          Randomize Order
        </button>
        <button disabled={entries.length < 1} onClick={onStart}>{startLabel}</button>
      </div>
    </div>
  )
}
