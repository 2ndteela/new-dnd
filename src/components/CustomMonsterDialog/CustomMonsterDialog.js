import React, { useState } from 'react'
import Dialog from '../Dialog/Dialog'
import Input from '../Input/Input'
import { buildMonster } from '../InitiativeTracker/encounterData'
import './CustomMonsterDialog.css'
import Button from '../Button/Button'

const STATS = [
  { key: 'strength', label: 'Str' },
  { key: 'dexterity', label: 'Dex' },
  { key: 'constitution', label: 'Con' },
  { key: 'intelligence', label: 'Int' },
  { key: 'wisdom', label: 'Wis' },
  { key: 'charisma', label: 'Cha' }
]

const EMPTY_FORM = {
  name: '',
  type: '',
  size: 'Medium',
  hp: '',
  hitDice: '',
  ac: '',
  speed: '30 ft.',
  ...Object.fromEntries(STATS.map((s) => [s.key, 10])),
  abilities: [],
  actions: []
}

const HIT_DICE_PATTERN = /^(\d+)d(\d+)\s*(?:([+-])\s*(\d+))?$/

// Standard 5e average: dice * (sides + 1) / 2 + modifier
function averageFromHitDice(hitDice) {
  const match = hitDice.trim().match(HIT_DICE_PATTERN)
  if (!match) return null

  const [, count, sides, sign, mod] = match
  const modifier = mod ? parseInt(mod, 10) * (sign === '-' ? -1 : 1) : 0
  return Math.max(1, Math.floor(parseInt(count, 10) * (parseInt(sides, 10) + 1) / 2) + modifier)
}

function toInt(val, fallback) {
  const parsed = parseInt(val, 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

function buildFromForm(form) {
  const hitDice = form.hitDice.trim()
  const cleanEntries = (list) => list
    .filter((e) => e.name.trim())
    .map((e) => ({ name: e.name.trim(), description: e.desc.trim() }))

  return buildMonster({
    index: `custom-${Date.now()}`,
    name: form.name.trim(),
    type: form.type.trim(),
    size: form.size.trim(),
    hitPoints: toInt(form.hp, null) ?? averageFromHitDice(hitDice),
    hitDice: HIT_DICE_PATTERN.test(hitDice) ? hitDice : '',
    armorClass: toInt(form.ac, 10),
    speed: form.speed.trim(),
    ...Object.fromEntries(STATS.map((s) => [s.key, toInt(form[s.key], 10)])),
    abilities: cleanEntries(form.abilities),
    actions: cleanEntries(form.actions)
  })
}

function EntryListEditor({ title, itemLabel, entries, onChange }) {
  function updateEntry(idx, changes) {
    onChange(entries.map((e, i) => (i === idx ? { ...e, ...changes } : e)))
  }

  return (
    <div className='custom-monster-section'>
      <h4 className='custom-monster-section-title'>{title}</h4>
      {entries.map((entry, idx) => (
        <div key={idx} className='custom-monster-entry'>
          <Input label={`${itemLabel} Name`} val={entry.name} onUpdate={(name) => updateEntry(idx, { name })} />
          <Input textarea label='Description' val={entry.desc} onUpdate={(desc) => updateEntry(idx, { desc })} />
          <Button variant='text' className='custom-monster-entry-remove' onClick={() => onChange(entries.filter((_, i) => i !== idx))}>
            Remove {itemLabel}
          </Button>
        </div>
      ))}
      <Button variant='flat' fullWidth className='custom-monster-add' onClick={() => onChange([...entries, { name: '', desc: '' }])}>
        Add {itemLabel}
      </Button>
    </div>
  )
}

export default function CustomMonsterDialog({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  const hitDiceInvalid = form.hitDice.trim() !== '' && !HIT_DICE_PATTERN.test(form.hitDice.trim())
  const hasHealth = toInt(form.hp, 0) > 0 || averageFromHitDice(form.hitDice) !== null
  const canCreate = form.name.trim() && hasHealth && !hitDiceInvalid

  function create() {
    if (!canCreate) return
    onCreate(buildFromForm(form))
    onClose()
  }

  return (
    <Dialog
      wide
      title='Add Custom Monster'
      onClose={onClose}
      actions={(
        <>
          <Button variant='text' onClick={onClose}>Cancel</Button>
          <Button disabled={!canCreate} onClick={create}>Add Monster</Button>
        </>
      )}
    >
      <div className='custom-monster-row'>
        <Input label='Name *' val={form.name} onUpdate={set('name')} />
        <Input label='Type' val={form.type} onUpdate={set('type')} />
      </div>
      <div className='custom-monster-row'>
        <Input label='Hit Points' val={form.hp} onUpdate={set('hp')} />
        <Input label='Hit Dice (e.g. 2d8+2)' val={form.hitDice} onUpdate={set('hitDice')} />
      </div>
      {hitDiceInvalid && <div className='custom-monster-error'>Hit dice should look like 2d8+2.</div>}
      {!hasHealth && !hitDiceInvalid && <div className='hint-text custom-monster-hint'>Enter hit points, hit dice, or both.</div>}
      <div className='custom-monster-row'>
        <Input label='AC' val={form.ac} onUpdate={set('ac')} />
        <Input label='Speed' val={form.speed} onUpdate={set('speed')} />
        <Input label='Size' val={form.size} onUpdate={set('size')} />
      </div>
      <div className='custom-monster-stats'>
        {STATS.map((s) => (
          <Input key={s.key} add label={s.label} val={form[s.key]} minValue='1' onUpdate={set(s.key)} />
        ))}
      </div>
      <EntryListEditor title='Abilities' itemLabel='Ability' entries={form.abilities} onChange={set('abilities')} />
      <EntryListEditor title='Actions' itemLabel='Action' entries={form.actions} onChange={set('actions')} />
    </Dialog>
  )
}
