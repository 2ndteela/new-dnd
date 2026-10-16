import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { parseFormula, rollDie } from '../../assets/dice'
import DiceRollerDialog from './DiceRollerDialog'

const DiceRollerContext = createContext(null)

const sortedSides = (dice) => Object.keys(dice).map(Number).filter((s) => dice[s] > 0).sort((a, b) => a - b)

function rollAll(dice, modifier, label) {
  const results = sortedSides(dice).flatMap((sides) =>
    Array.from({ length: dice[sides] }, () => ({ sides, value: rollDie(sides) }))
  )
  return {
    id: `${Date.now()}-${Math.random()}`,
    kind: 'dice',
    label,
    dice: results,
    modifier,
    total: results.reduce((sum, d) => sum + d.value, 0) + modifier,
    stale: false
  }
}

// One dice roller for the whole app. Any component can open it, or roll a formula into it:
//   const { rollDice, openDiceRoller } = useDiceRoller()
//   rollDice('d20 + 5', { label: 'Stealth' })
// The dice you set up are kept between opens.
export function DiceRollerProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [dice, setDice] = useState({})          // { [sides]: count }
  const [modifier, setModifier] = useState(0)
  const [roll, setRoll] = useState(null)

  // Changing the setup turns the shown result into "Last roll" and drops the preset's label
  const markChanged = useCallback(() => {
    setLabel('')
    setRoll((r) => (r && !r.stale ? { ...r, stale: true } : r))
  }, [])

  const rollDice = useCallback((formula, { label: rollLabel = '' } = {}) => {
    const parsed = parseFormula(formula)
    setOpen(true)
    setLabel(rollLabel)
    if (!parsed) return

    const nextDice = { [parsed.sides]: parsed.count }
    setDice(nextDice)
    setModifier(parsed.modifier)
    setRoll(rollAll(nextDice, parsed.modifier, rollLabel))
  }, [])

  const openDiceRoller = useCallback(() => {
    setLabel('')
    setOpen(true)
  }, [])

  const actions = useMemo(() => ({
    close: () => setOpen(false),
    addDie: (sides) => { setDice((d) => ({ ...d, [sides]: (d[sides] || 0) + 1 })); markChanged() },
    changeModifier: (delta) => { setModifier((m) => m + delta); markChanged() },
    clear: () => { setDice({}); setModifier(0); setRoll(null); setLabel('') },
    flipCoin: () => {
      setDice({}); setModifier(0); setLabel('')
      const value = rollDie(2) === 1 ? 'Heads' : 'Tails'
      setRoll({ id: `${Date.now()}-${Math.random()}`, kind: 'coin', label: '', dice: [{ sides: 'coin', value }], modifier: 0, total: value, stale: false })
    },
  }), [markChanged])

  const rollCurrent = useCallback(() => {
    setRoll(rollAll(dice, modifier, label))
  }, [dice, modifier, label])

  const value = useMemo(() => ({ rollDice, openDiceRoller }), [rollDice, openDiceRoller])

  return (
    <DiceRollerContext.Provider value={value}>
      {children}
      {open && (
        <DiceRollerDialog
          label={label}
          dice={dice}
          modifier={modifier}
          roll={roll}
          onRoll={rollCurrent}
          {...actions}
        />
      )}
    </DiceRollerContext.Provider>
  )
}

export function useDiceRoller() {
  const context = useContext(DiceRollerContext)
  if (!context) throw new Error('useDiceRoller must be used inside <DiceRollerProvider>')
  return context
}
