// Conversion between in-app encounter state and the database shape (see docs/database-schema.md)

const STAT_KEYS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']
const TYPE_ORDER = { character: 0, monster: 1, event: 2 }

export function getDexModifier(entry) {
  if (entry.type !== 'monster') return 0
  return Math.floor((entry.monster.dexterity - 10) / 2)
}

// Blank HP (mid-edit) doesn't count as down
export function isDefeated(entry) {
  return entry.type === 'monster' && entry.currentHp !== '' && Number(entry.currentHp) <= 0
}

// Deterministic so a reloaded encounter comes back in the same order:
// initiative (unrolled last), then dex, then type, then id (stable across renames)
export function sortByInitiative(entries) {
  const rollValue = (e) => (e.roll === '' || e.roll === null || e.roll === undefined ? -Infinity : e.roll)

  return [...entries].sort((a, b) =>
    (rollValue(b) - rollValue(a)) ||
    (getDexModifier(b) - getDexModifier(a)) ||
    (TYPE_ORDER[a.type] - TYPE_ORDER[b.type]) ||
    a.id.localeCompare(b.id)
  )
}

const toInitiative = (roll) => (roll === '' || roll === undefined ? null : roll)
const fromInitiative = (initiative) => (initiative === null || initiative === undefined ? '' : initiative)

// Same shape as a dnd5eapi monster so MonsterCard and the tracker can use it as-is
export function buildMonster({ index, name, type, size, hitPoints, hitDice, armorClass, speed, abilities = [], actions = [], ...stats }) {
  return {
    index,
    custom: true,
    name,
    type: type || 'custom',
    size: size || 'Medium',
    hit_points: hitPoints,
    hit_points_roll: hitDice || '',
    armor_class: [{ value: armorClass ?? 10 }],
    speed: speed ? { walk: speed } : {},
    ...Object.fromEntries(STAT_KEYS.map((k) => [k, stats[k] ?? 10])),
    proficiencies: [],
    special_abilities: abilities.map((a) => ({ name: a.name, desc: a.description || '' })),
    actions: actions.map((a) => ({ name: a.name, desc: a.description || '' }))
  }
}

function customMonsterFields(monster) {
  return {
    type: monster.type,
    size: monster.size,
    hitPoints: monster.hit_points,
    hitDice: monster.hit_points_roll || '',
    armorClass: monster.armor_class?.[0]?.value ?? 10,
    speed: monster.speed?.walk || '',
    ...Object.fromEntries(STAT_KEYS.map((k) => [k, monster[k] ?? 10])),
    abilities: monster.special_abilities.map((a) => ({ name: a.name, description: a.desc })),
    actions: monster.actions.map((a) => ({ name: a.name, description: a.desc }))
  }
}

export function toDbEncounter({ name, entries, turnNumber, round, currentId }) {
  const ofType = (type) => entries.filter((e) => e.type === type)

  return {
    name,
    turnNumber,
    round,
    currentTurnId: currentId ?? null,
    monsters: ofType('monster').map((e) => ({
      id: e.id,
      name: e.name,
      maxHealth: e.maxHp,
      currentHealth: parseInt(e.currentHp, 10) || 0,
      initiative: toInitiative(e.roll),
      ...(e.monster.custom ? customMonsterFields(e.monster) : { databaseKey: e.monster.index })
    })),
    events: ofType('event').map((e) => ({
      id: e.id,
      name: e.name,
      description: e.description || '',
      initiative: toInitiative(e.roll)
    })),
    characters: ofType('character').map((e) => ({
      id: e.id,
      name: e.name,
      initiative: toInitiative(e.roll)
    }))
  }
}

// `handbookMonsters` maps databaseKey -> dnd5eapi monster (missing if the fetch failed)
export function fromDbEncounter(key, record, handbookMonsters) {
  const monsters = (record.monsters || []).map((m) => {
    const monster = m.databaseKey
      ? handbookMonsters[m.databaseKey] || buildMonster({ index: m.databaseKey, name: m.name, hitPoints: m.maxHealth })
      : buildMonster({ ...m, index: m.id })

    return {
      id: m.id,
      type: 'monster',
      name: m.name,
      roll: fromInitiative(m.initiative),
      monster,
      maxHp: m.maxHealth,
      currentHp: m.currentHealth ?? m.maxHealth
    }
  })

  const events = (record.events || []).map((e) => ({
    id: e.id,
    type: 'event',
    name: e.name,
    description: e.description || '',
    roll: fromInitiative(e.initiative)
  }))

  const characters = (record.characters || []).map((c) => ({
    id: c.id,
    type: 'character',
    name: c.name,
    roll: fromInitiative(c.initiative)
  }))

  return {
    key,
    name: record.name,
    turnNumber: record.turnNumber || 0,
    round: record.round || 1,
    currentId: record.currentTurnId || null,
    entries: sortByInitiative([...characters, ...monsters, ...events])
  }
}

export function summarizeEncounter(key, record) {
  return {
    key,
    name: record.name,
    turnNumber: record.turnNumber || 0,
    round: record.round || 1,
    counts: {
      characters: (record.characters || []).length,
      monsters: (record.monsters || []).length,
      events: (record.events || []).length
    }
  }
}
