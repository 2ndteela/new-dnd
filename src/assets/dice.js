// Shared dice helpers for the dice roller (DiceRollerProvider / DiceRollerDialog)

// Standard set shown on the dice roller keypad, smallest to largest
export const KEYPAD_DICE = [4, 6, 8, 10, 12, 20, 100]

// 1..sides, never 0 (Math.random() can return exactly 0)
export const rollDie = (sides) => Math.floor(Math.random() * sides) + 1

// Reads formulas like "d20 + 5", "2d6 + 3", "d20 + -1", "d20 + +5" and tolerates a
// missing or empty modifier ("d20 + undefined", "d20 + ") as +0.
// Returns { count, sides, modifier } or null if there's no "NdS" part.
export function parseFormula(formula) {
  const compact = String(formula ?? '').replace(/\s+/g, '')
  const match = compact.match(/^(\d*)d(\d+)(.*)$/i)
  if (!match) return null

  const count = match[1] ? parseInt(match[1], 10) : 1
  const sides = parseInt(match[2], 10)
  if (!count || !sides) return null

  const rest = match[3]
  const signs = rest.match(/^[+-]*/)[0]
  const digits = rest.slice(signs.length).match(/^\d+/)
  const negative = (signs.match(/-/g) || []).length % 2 === 1
  const modifier = digits ? parseInt(digits[0], 10) * (negative ? -1 : 1) : 0

  return { count, sides, modifier }
}

// " + 4", " − 1" or "" for 0
export const formatModifier = (modifier) => {
  if (!modifier) return ''
  return modifier > 0 ? ` + ${modifier}` : ` − ${Math.abs(modifier)}`
}

// "d20 + 5", "2d6 − 1"
export const formatFormula = ({ count, sides, modifier }) =>
  `${count > 1 ? count : ''}d${sides}${formatModifier(modifier)}`
