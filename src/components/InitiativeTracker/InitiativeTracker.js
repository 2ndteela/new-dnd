import React, { useState, useEffect, useRef } from 'react'
import { MdChevronLeft, MdChevronRight, MdPerson, MdBolt, MdArrowBack } from 'react-icons/md'
import Dialog from '../Dialog/Dialog'
import { ConfirmDialog } from '../Dialog/Dialog'
import EditableText from '../EditableText/EditableText'
import HealthSlot from '../HealthSlot/HealthSlot'
import { MonsterDetails } from '../MonsterCard/MonsterCard'
import EncounterList from './EncounterList'
import { isDefeated } from './encounterData'
import InitiativeSetup from './InitiativeSetup'
import './InitiativeTracker.css'

const SUBTITLES = {
  character: 'Player Character',
  event: 'Event'
}

// Parses "NdS+M" (e.g. "18d10+36") into the lowest/highest possible hit points
function getHealthRange(monster) {
  const match = monster.hit_points_roll?.match(/(\d+)d(\d+)\s*(?:([+-])\s*(\d+))?/)
  if (!match) return { min: monster.hit_points, max: monster.hit_points }

  const [, count, sides, sign, mod] = match
  const modifier = mod ? parseInt(mod, 10) * (sign === '-' ? -1 : 1) : 0
  const diceCount = parseInt(count, 10)

  return {
    min: Math.max(1, diceCount + modifier),
    max: diceCount * parseInt(sides, 10) + modifier
  }
}

// Matches the Slot component's thresholds
function getHealthStatus(entry) {
  const current = parseInt(entry.currentHp, 10) || 0
  const percent = entry.maxHp > 0 ? Math.min(100, (current / entry.maxHp) * 100) : 0

  if (percent > 50) return { percent, color: 'green' }
  if (percent > 25) return { percent, color: 'yellow' }
  return { percent, color: 'red' }
}

function SquareContent({ entry }) {
  if (entry.type === 'character') return <MdPerson className='initiative-square-icon' />
  if (entry.type === 'event') return <MdBolt className='initiative-square-icon' />
  return <span className='initiative-square-hp'>{entry.currentHp}</span>
}

function InitiativeSquare({ entry, isCurrent, isSelected, onSelect }) {
  const squareRef = useRef(null)

  useEffect(() => {
    if (isSelected) squareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [isSelected])

  const fill = entry.type === 'monster' && getHealthStatus(entry)

  return (
    <div className='initiative-square-wrapper'>
      <div className={`current-turn-indicator${isCurrent ? ' visible' : ''}`} aria-label={isCurrent ? 'Current turn' : undefined} />
      <button
        ref={squareRef}
        className={`initiative-square ${entry.type}${isCurrent ? ' current' : ''}${isSelected ? ' selected' : ''}${isDefeated(entry) ? ' defeated' : ''}`}
        onClick={() => onSelect(entry.id)}
      >
        {fill && <div className={`initiative-square-fill ${fill.color}`} style={{ height: `${fill.percent}%` }} />}
        <span className='initiative-square-name'>{entry.name}</span>
        <SquareContent entry={entry} />
      </button>
    </div>
  )
}

function MonsterCardBody({ entry, onUpdate }) {
  const { min, max } = getHealthRange(entry.monster)

  return (
    <>
      <div className='full-width' style={{ paddingBottom: '16px' }}>
        <HealthSlot
          current={entry.currentHp}
          max={entry.maxHp}
          presets={[
            { label: 'Least', value: min },
            { label: 'Average', value: entry.monster.hit_points },
            { label: 'Most', value: max }
          ]}
          onCurrentChange={(currentHp) => onUpdate(entry.id, { currentHp })}
          onMaxChange={(maxHp, currentHp) => onUpdate(entry.id, currentHp === undefined ? { maxHp } : { maxHp, currentHp })}
        />
      </div>
      <MonsterDetails monster={entry.monster} />
    </>
  )
}

function TrackerCard({ entry, onUpdate, onRemove }) {
  const [confirmingRemove, setConfirmingRemove] = useState(false)

  return (
    <div className='tracker-card'>
      <div className='tracker-card-header'>
        <div className='tracker-card-title'>
          <h2><EditableText value={entry.name} label='Edit name' onSave={(name) => onUpdate(entry.id, { name })} /></h2>
          <div className='tracker-card-subtitle'>{entry.type === 'monster' ? entry.monster.name : SUBTITLES[entry.type]}</div>
        </div>
      </div>
      {entry.type === 'monster' && (
        <div className='tracker-card-body'>
          <MonsterCardBody entry={entry} onUpdate={onUpdate} />
        </div>
      )}
      {entry.type === 'event' && (
        <div className='tracker-card-body'>
          <EditableText
            multiline
            allowEmpty
            value={entry.description}
            label='Edit description'
            placeholder='No description'
            onSave={(description) => onUpdate(entry.id, { description })}
          />
        </div>
      )}
      <div className='tracker-card-actions'>
        <button className='flat-button full-button' onClick={() => setConfirmingRemove(true)}>Remove</button>
      </div>
      {confirmingRemove && (
        <ConfirmDialog
          title={`Remove ${entry.name}?`}
          message='They will be taken out of the initiative order.'
          confirmLabel='Remove'
          onCancel={() => setConfirmingRemove(false)}
          onConfirm={() => onRemove(entry.id)}
        />
      )}
    </div>
  )
}

function EndEncounterDialog({ onCancel, onEnd }) {
  return (
    <Dialog
      title='End initiative?'
      onClose={onCancel}
      actions={(
        <>
          <button className='flat-button' onClick={onCancel}>Cancel</button>
          <div style={{ padding: '0 12px' }} >
            <button className='flat-button' onClick={() => onEnd(false)}>Keep</button>
          </div>
          <button className='dialog-danger-button' onClick={() => onEnd(true)}>Delete</button>
        </>
      )}
    >
      <div>Keep this encounter to re-run it later, or delete it from your saved encounters.</div>
    </Dialog>
  )
}

function EncounterHeader({ name, onBack, onRename }) {
  return (
    <div className='encounter-header'>
      <button className='encounter-back-button' aria-label='Back to encounters' onClick={onBack}>
        <MdArrowBack />
      </button>
      <h3 className='encounter-header-name'>
        <EditableText value={name} label='Edit encounter name' onSave={onRename} />
      </h3>
    </div>
  )
}

// Turn, round and order live in the encounter (and the database); only the viewed card is local
function ActiveInitiative({ entries, currentId, round, onChangeTurn, onUpdate, onRemove, onEdit, onEnd }) {
  const [selectedId, setSelectedId] = useState(null)
  const [confirmingEnd, setConfirmingEnd] = useState(false)

  // Fall back to the first entry if the current one is missing
  const current = entries.find((e) => e.id === currentId) ?? entries[0]
  const selected = entries.find((e) => e.id === selectedId) ?? current

  function changeTurn(step) {
    const nextId = onChangeTurn(step)
    if (nextId) setSelectedId(nextId)
  }

  function handleRemove(id) {
    // Selection follows whoever slides into the removed slot
    if (id === selected?.id) {
      const idx = entries.findIndex((e) => e.id === id)
      const remaining = entries.filter((e) => e.id !== id)
      setSelectedId(remaining.length > 0 ? remaining[idx % remaining.length].id : null)
    }
    onRemove(id)
  }

  return (
    <div className='initiative-tracker'>
      <div className='tracker-top-bar'>
        <h3>Round {round}</h3>
        <div className='tracker-top-bar-actions'>
          <button className='flat-button' onClick={onEdit}>Edit</button>
          <button className='flat-button' onClick={() => setConfirmingEnd(true)}>End Initiative</button>
        </div>
      </div>
      {entries.length < 1 ? (
        <div className='empty-tracker'>Everyone has been removed. End initiative or add more from the monster search.</div>
      ) : (
        <>
          <div className='initiative-list'>
            {entries.map((entry) => (
              <InitiativeSquare
                key={entry.id}
                entry={entry}
                isCurrent={entry.id === current.id}
                isSelected={entry.id === selected.id}
                onSelect={setSelectedId}
              />
            ))}
          </div>
          <TrackerCard
            key={selected.id}
            entry={selected}
            onUpdate={onUpdate}
            onRemove={handleRemove}
          />
          <div className='turn-controls'>
            <button className='flat-button' aria-label='Previous turn' onClick={() => changeTurn(-1)}>
              <MdChevronLeft />
            </button>
            {selected.id !== current.id ? (
              <button className='flat-button back-to-current' onClick={() => setSelectedId(current.id)}>
                Go back to current turn
              </button>
            ) : <div className='turn-controls-label'>{current.name}'s turn</div>}
            <button className='flat-button' aria-label='Next turn' onClick={() => changeTurn(1)}>
              <MdChevronRight />
            </button>
          </div>
        </>
      )}
      {confirmingEnd && <EndEncounterDialog onCancel={() => setConfirmingEnd(false)} onEnd={onEnd} />}
    </div>
  )
}

export default function InitiativeTracker({ initiative }) {
  const { encounter, encounters, loadingKey, error, clearError } = initiative

  const errorBanner = error && (
    <button className='tracker-error' onClick={clearError}>{error} (dismiss)</button>
  )

  if (!encounter) {
    return (
      <>
        {errorBanner}
        <EncounterList
          encounters={encounters}
          loadingKey={loadingKey}
          onOpen={initiative.openEncounter}
          onCreate={initiative.createEncounter}
        />
      </>
    )
  }

  return (
    <>
      {errorBanner}
      <EncounterHeader name={encounter.name} onBack={initiative.closeEncounter} onRename={initiative.renameEncounter} />
      {encounter.turnNumber > 0 && encounter.editing && (
        <div className='editing-banner'>Editing · Round {encounter.round}. Resume to pick up where you left off.</div>
      )}
      {encounter.turnNumber === 0 || encounter.editing ? (
        <InitiativeSetup
          entries={encounter.entries}
          onUpdate={initiative.updateEntry}
          onRemove={initiative.removeEntry}
          onAddCharacter={initiative.addCharacter}
          onAddEvent={initiative.addEvent}
          onRandomize={initiative.randomizeRolls}
          onStart={encounter.editing ? initiative.resumeInitiative : initiative.startInitiative}
          startLabel={encounter.editing ? 'Resume Initiative' : 'Start Initiative'}
        />
      ) : (
        <ActiveInitiative
          key={encounter.key}
          entries={encounter.entries}
          currentId={encounter.currentId}
          round={encounter.round}
          onChangeTurn={initiative.changeTurn}
          onUpdate={initiative.updateEntry}
          onRemove={initiative.removeEntry}
          onEdit={initiative.editInitiative}
          onEnd={initiative.endEncounter}
        />
      )}
    </>
  )
}
