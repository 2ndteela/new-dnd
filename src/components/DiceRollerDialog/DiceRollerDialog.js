import React, { useEffect, useMemo, useState } from 'react'
import Dialog from '../Dialog/Dialog'
import Button from '../Button/Button'
import { formatModifier, rollDie, KEYPAD_DICE } from '../../assets/dice'
import './DiceRollerDialog.css'

const ROLL_MS = 900          // how long the dice tumble
const STAGGER_MS = 70        // each extra die starts a little later
const FLICKER_MS = 70        // how often a tumbling die's face changes
const MAX_SHOWN = 12         // more dice than this are summarised

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// One die: the shape matches the die type, the face flickers while it tumbles
function Die({ sides, value, rolling, index }) {
  const [face, setFace] = useState(value)
  const motion = useMemo(() => ({
    '--spin': `${(Math.random() < 0.5 ? -1 : 1) * (2 + Math.floor(Math.random() * 2)) * 360}deg`,
    '--from-x': `${Math.round(Math.random() * 120 - 60)}px`,
    '--delay': `${index * STAGGER_MS}ms`
  }), [index])

  useEffect(() => {
    if (!rolling) { setFace(value); return }
    const flicker = setInterval(() => {
      setFace(sides === 'coin' ? (rollDie(2) === 1 ? 'H' : 'T') : rollDie(sides))
    }, FLICKER_MS)
    return () => clearInterval(flicker)
  }, [rolling, sides, value])

  const shownFace = sides === 'coin' ? (rolling ? face : value[0]) : face
  const crit = !rolling && sides === 20 && (value === 20 ? ' crit-success' : value === 1 ? ' crit-fail' : '')
  const kind = sides === 'coin' ? 'coin' : `d${KEYPAD_DICE.includes(sides) ? sides : 'other'}`

  return (
    <div className={`dice-die dice-${kind}${rolling ? ' rolling' : ' landed'}${crit || ''}`} style={motion} aria-hidden='true'>
      <div className='dice-die-shape'>
        <span className='dice-die-face'>{shownFace}</span>
      </div>
      <span className='dice-die-type'>{sides === 'coin' ? 'coin' : `d${sides}`}</span>
    </div>
  )
}

function describeSetup(dice, modifier) {
  const parts = Object.keys(dice).map(Number).filter((s) => dice[s] > 0).sort((a, b) => a - b).map((s) => `${dice[s]}d${s}`)
  return `${parts.join(' + ')}${formatModifier(modifier)}`.trim()
}

export default function DiceRollerDialog({ label, dice, modifier, roll, onRoll, close, addDie, changeModifier, clear, flipCoin }) {
  const [rolling, setRolling] = useState(false)

  // Each new roll tumbles, then settles; reduced motion skips straight to the result
  useEffect(() => {
    if (!roll || prefersReducedMotion()) { setRolling(false); return }
    setRolling(true)
    const shown = Math.min(roll.dice.length, MAX_SHOWN)
    const settle = setTimeout(() => setRolling(false), ROLL_MS + (shown - 1) * STAGGER_MS)
    return () => clearTimeout(settle)
  }, [roll?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const setup = describeSetup(dice, modifier)
  const hasDice = Object.values(dice).some((n) => n > 0)
  const shownDice = roll ? roll.dice.slice(0, MAX_SHOWN) : []
  const hiddenCount = roll ? roll.dice.length - shownDice.length : 0

  const singleD20 = roll?.kind === 'dice' && roll.dice.length === 1 && roll.dice[0].sides === 20
  const natural = singleD20 && !rolling && (roll.dice[0].value === 20 ? 'Natural 20!' : roll.dice[0].value === 1 ? 'Natural 1' : '')

  const breakdown = roll?.kind === 'dice'
    ? `${roll.dice.map((d) => d.value).join(' + ')}${formatModifier(roll.modifier)}`
    : ''

  return (
    <Dialog title={label || 'Dice Roller'} onClose={close} className='dice-roller-dialog'>
      <div className={`dice-tray${roll?.stale ? ' stale' : ''}`}>
        {roll?.stale && <div className='dice-last-roll'>Last roll{roll.label ? ` · ${roll.label}` : ''}</div>}
        {roll ? (
          <>
            <div className='dice-row'>
              {shownDice.map((d, i) => (
                <Die key={`${roll.id}-${i}`} sides={d.sides} value={d.value} rolling={rolling} index={i} />
              ))}
              {hiddenCount > 0 && <div className='dice-more'>+{hiddenCount} more</div>}
            </div>
            <div className='dice-total' aria-live='polite'>
              {rolling ? <span className='dice-total-pending'>Rolling…</span> : (
                <>
                  <span className={`dice-total-value${roll.kind === 'coin' ? ' coin' : ''}${natural === 'Natural 20!' ? ' crit-success' : natural ? ' crit-fail' : ''}`}>{roll.total}</span>
                  {natural && <span className={`dice-natural${natural === 'Natural 20!' ? ' crit-success' : ' crit-fail'}`}>{natural}</span>}
                  {breakdown && roll.dice.length + (roll.modifier ? 1 : 0) > 1 && <span className='dice-breakdown'>{breakdown}</span>}
                </>
              )}
            </div>
          </>
        ) : (
          <div className='dice-empty'>Add dice below, then roll.</div>
        )}
      </div>

      <div className='dice-setup'>
        <span className='dice-setup-label'>To roll</span>
        <span className='dice-setup-value'>{setup || 'Nothing yet'}</span>
      </div>

      <div className='dice-keypad'>
        {KEYPAD_DICE.map((sides) => (
          <Button key={sides} variant='flat' className={`dice-key${sides === 100 ? ' wide' : ''}`} onClick={() => addDie(sides)}>
            d{sides}
          </Button>
        ))}
        <Button variant='flat' className='dice-key' onClick={() => changeModifier(-1)}>-1</Button>
        <Button variant='flat' className='dice-key' onClick={() => changeModifier(-5)}>-5</Button>
        <Button variant='flat' className='dice-key' onClick={() => changeModifier(1)}>+1</Button>
        <Button variant='flat' className='dice-key' onClick={() => changeModifier(5)}>+5</Button>
        <Button variant='flat' className='dice-key wide' onClick={flipCoin}>Coin Flip</Button>
        <Button variant='flat' className='dice-key' onClick={clear}>Clear</Button>
        <Button className='dice-key' disabled={!hasDice} onClick={onRoll}>Roll</Button>
      </div>
    </Dialog>
  )
}
