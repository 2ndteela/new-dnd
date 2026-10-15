import { useState, useEffect, useCallback, useRef } from 'react'
import { getEncounters, createEncounter, saveEncounter, deleteEncounter, getMonsterFromIndex } from '../../assets/services'
import { getDexModifier, isDefeated, sortByInitiative, toDbEncounter, fromDbEncounter, summarizeEncounter } from './encounterData'


function rollD20() {
  return Math.floor(Math.random() * 20) + 1
}

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Picks up numbering where it left off ("Goblin 3" -> next is "Goblin 4")
function countMonsters(entries) {
  const tally = {}
  const highest = {}

  entries.forEach((e) => {
    if (e.type !== 'monster') return
    const { index, name } = e.monster
    const match = e.name.match(new RegExp(`^${escapeRegExp(name)} (\\d+)$`))
    tally[index] = (tally[index] || 0) + 1
    highest[index] = Math.max(highest[index] || 0, match ? parseInt(match[1], 10) : 0)
  })

  return Object.fromEntries(Object.keys(tally).map((index) => [index, Math.max(tally[index], highest[index])]))
}

// Saves happen on create, start, every turn move, leaving an encounter, and ending (keep).
// Edits between those points live only in memory.
export default function useInitiative() {
  const [encounters, setEncounters] = useState(null) // summaries; null while loading
  const [encounter, setEncounterState] = useState(null) // the open encounter
  const [loadingKey, setLoadingKey] = useState(null)
  const [error, setError] = useState(null)

  // Mirrors `encounter` so actions can compute the next state and save it in one step
  const encounterRef = useRef(null)
  const recordsRef = useRef({})
  const monsterCounts = useRef({})
  const nextId = useRef(0)

  const setEncounter = useCallback((updater) => {
    const next = typeof updater === 'function' ? updater(encounterRef.current) : updater
    encounterRef.current = next
    setEncounterState(next)
    return next
  }, [])

  const makeId = useCallback((prefix) => {
    nextId.current += 1
    return `${prefix}-${Date.now().toString(36)}${nextId.current.toString(36)}`
  }, [])

  const persist = useCallback((enc) => {
    const record = toDbEncounter(enc)
    recordsRef.current[enc.key] = record
    setEncounters((list) => (list || []).map((s) => (s.key === enc.key ? summarizeEncounter(enc.key, record) : s)))
    saveEncounter(enc.key, record).catch((err) => {
      console.error(err)
      setError('Could not save the encounter.')
    })
  }, [])

  useEffect(() => {
    getEncounters()
      .then((records) => {
        recordsRef.current = records
        setEncounters(Object.entries(records).map(([key, record]) => summarizeEncounter(key, record)))
      })
      .catch((err) => {
        console.error(err)
        setEncounters([])
        setError('Could not load encounters.')
      })
  }, [])

  const createNewEncounter = useCallback(async (name) => {
    const fresh = { name, entries: [], turnNumber: 0, round: 1, currentId: null }
    const record = toDbEncounter(fresh)

    try {
      const key = await createEncounter(record)
      recordsRef.current[key] = record
      setEncounters((list) => [...(list || []), summarizeEncounter(key, record)])
      monsterCounts.current = {}
      setEncounter({ ...fresh, key })
    }
    catch (err) {
      console.error(err)
      setError('Could not create the encounter.')
    }
  }, [setEncounter])

  const openEncounter = useCallback(async (key) => {
    const record = recordsRef.current[key]
    if (!record) return

    setLoadingKey(key)
    // Handbook monsters only store their key; the stat block comes from the API again
    const databaseKeys = [...new Set((record.monsters || []).map((m) => m.databaseKey).filter(Boolean))]
    const fetched = await Promise.all(databaseKeys.map((k) => getMonsterFromIndex(k)))
    const handbookMonsters = Object.fromEntries(
      databaseKeys.map((k, i) => [k, fetched[i]]).filter(([, monster]) => monster && !monster.error)
    )

    const enc = fromDbEncounter(key, record, handbookMonsters)
    monsterCounts.current = countMonsters(enc.entries)
    setEncounter(enc)
    setLoadingKey(null)
  }, [setEncounter])

  const closeEncounter = useCallback(() => {
    if (encounterRef.current) persist(encounterRef.current)
    setEncounter(null)
  }, [persist, setEncounter])

  const renameEncounter = useCallback((name) => {
    setEncounter((enc) => ({ ...enc, name }))
  }, [setEncounter])

  // Mid-fight additions are sorted in so the order matches what a reload would produce
  const addEntry = useCallback((entry) => {
    setEncounter((enc) => {
      if (!enc) return enc
      const entries = [...enc.entries, entry]
      return { ...enc, entries: enc.turnNumber > 0 ? sortByInitiative(entries) : entries }
    })
  }, [setEncounter])

  const addMonster = useCallback((monster) => {
    if (!encounterRef.current) return
    const count = (monsterCounts.current[monster.index] || 0) + 1
    monsterCounts.current[monster.index] = count

    addEntry({
      id: makeId(monster.index),
      type: 'monster',
      name: `${monster.name} ${count}`,
      roll: '',
      monster,
      maxHp: monster.hit_points,
      currentHp: monster.hit_points
    })
  }, [addEntry, makeId])

  const addCharacter = useCallback((name) => {
    addEntry({ id: makeId('character'), type: 'character', name, roll: '' })
  }, [addEntry, makeId])

  const addEvent = useCallback((name, description) => {
    addEntry({ id: makeId('event'), type: 'event', name, description, roll: '' })
  }, [addEntry, makeId])

  const updateEntry = useCallback((id, changes) => {
    setEncounter((enc) => ({ ...enc, entries: enc.entries.map((e) => (e.id === id ? { ...e, ...changes } : e)) }))
  }, [setEncounter])

  const removeEntry = useCallback((id) => {
    setEncounter((enc) => {
      // Hand the turn to whoever slides into the removed slot
      const idx = enc.entries.findIndex((e) => e.id === id)
      const remaining = enc.entries.filter((e) => e.id !== id)
      const currentId = id === enc.currentId
        ? (remaining.length > 0 ? remaining[idx % remaining.length].id : null)
        : enc.currentId

      return { ...enc, entries: remaining, currentId }
    })
  }, [setEncounter])

  const randomizeRolls = useCallback((includeCharacters) => {
    setEncounter((enc) => ({
      ...enc,
      entries: enc.entries.map((e) => {
        if (e.type === 'character' && !includeCharacters) return e
        return { ...e, roll: rollD20() + getDexModifier(e) }
      })
    }))
  }, [setEncounter])

  const startInitiative = useCallback(() => {
    const enc = encounterRef.current
    const entries = sortByInitiative(enc.entries)
    persist(setEncounter({ ...enc, entries, turnNumber: 1, round: 1, currentId: entries[0]?.id ?? null }))
  }, [persist, setEncounter])

  // Edit mode is in-memory only: the fight's turn/round are untouched until it resumes
  const editInitiative = useCallback(() => {
    setEncounter((enc) => ({ ...enc, editing: true }))
  }, [setEncounter])

  const resumeInitiative = useCallback(() => {
    const enc = encounterRef.current
    const entries = sortByInitiative(enc.entries)
    const currentId = entries.some((e) => e.id === enc.currentId) ? enc.currentId : entries[0]?.id ?? null
    persist(setEncounter({ ...enc, editing: false, entries, currentId }))
  }, [persist, setEncounter])

  // Walks past defeated monsters; the round changes if we pass the end/start of the order
  const changeTurn = useCallback((step) => {
    const enc = encounterRef.current
    const { entries } = enc
    const idx = Math.max(0, entries.findIndex((e) => e.id === enc.currentId))
    let wrapped = false

    for (let i = 1; i <= entries.length; i++) {
      const raw = idx + step * i
      if (raw >= entries.length || raw < 0) wrapped = true

      const next = entries[(raw % entries.length + entries.length) % entries.length]
      if (isDefeated(next)) continue

      const round = wrapped ? (step > 0 ? enc.round + 1 : Math.max(1, enc.round - 1)) : enc.round
      persist(setEncounter({
        ...enc,
        currentId: next.id,
        round,
        turnNumber: Math.max(1, enc.turnNumber + step)
      }))
      return next.id
    }
    return null
  }, [persist, setEncounter])

  const endEncounter = useCallback(async (deleteFromDb) => {
    const enc = encounterRef.current
    setEncounter(null)

    if (!deleteFromDb) {
      // Back to setup with everyone (and their HP/rolls) kept so it can be re-run
      persist({ ...enc, turnNumber: 0, round: 1, currentId: null })
      return
    }

    try {
      await deleteEncounter(enc.key)
      delete recordsRef.current[enc.key]
      setEncounters((list) => list.filter((s) => s.key !== enc.key))
    }
    catch (err) {
      console.error(err)
      setError('Could not delete the encounter.')
    }
  }, [persist, setEncounter])

  return {
    encounters,
    encounter,
    loadingKey,
    error,
    clearError: () => setError(null),
    createEncounter: createNewEncounter,
    openEncounter,
    closeEncounter,
    renameEncounter,
    addMonster,
    addCharacter,
    addEvent,
    updateEntry,
    removeEntry,
    randomizeRolls,
    startInitiative,
    editInitiative,
    resumeInitiative,
    changeTurn,
    endEncounter
  }
}
