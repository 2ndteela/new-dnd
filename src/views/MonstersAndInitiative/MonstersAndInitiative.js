import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { MdSearch, MdFormatListNumbered } from 'react-icons/md'
import { Navigate } from 'react-router-dom'
import { hasSession } from '../../assets/storage'
import { getFromDnd5eApi, getMonsterFromIndex } from '../../assets/services'
import Input from '../../components/Input/Input'
import "./MonstersAndInitiative.css"
import BottomDrawer from '../../components/BottomDrawer/BottomDrawer'
import CustomMonsterDialog from '../../components/CustomMonsterDialog/CustomMonsterDialog'
import ExpansionPannel from '../../components/ExpansionPannel/ExpansionPannel'
import InitiativeTracker from '../../components/InitiativeTracker/InitiativeTracker'
import useInitiative from '../../components/InitiativeTracker/useInitiative'
import MonsterCard from '../../components/MonsterCard/MonsterCard'
import StackedCards from '../../components/StackedCards/StackedCards'

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handleChange = (e) => setMatches(e.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

// Encounters are stored per user (or per device in guest mode), so this page needs a session
export default function MonstersAndInitiative() {
  if (!hasSession()) return <Navigate to='/' replace />
  return <MonstersAndInitiativePage />
}

function MonstersAndInitiativePage() {
  const [loading, setLoading] = useState(false)
  const [fullList, setFullList] = useState([])
  const [savedMonsters, setSavedMonsters] = useState([])
  const [filterTerm, setFilterTerm] = useState(null)
  const [activeTab, setActiveTab] = useState('search')
  const [customDialogOpen, setCustomDialogOpen] = useState(false)
  const initiative = useInitiative()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const addCustomMonster = useCallback((monster) => {
    setSavedMonsters((v) => [...v, monster])
  }, [])

  const removeFromStack = useCallback((key) => {
    setSavedMonsters((val) => val.filter((m) => m.index !== key))
  }, [])

  useEffect(() => {
    async function getAllMonsters() {
      setLoading(true)
      try {
        const { results } = await getFromDnd5eApi('/monsters')
        setFullList(results)

      }
      catch (err) {
        console.error(err)
        setFullList([{ name: 'error' }])
      }
      setLoading(false)
    }

    if (!loading && fullList.length < 1) getAllMonsters()
  }, [loading, fullList])

  const alphabetizedData = useMemo(() => {
    if (filterTerm) {
      const filteredList = fullList.filter((m) => m.name.toLocaleLowerCase().includes(filterTerm.toLocaleLowerCase()))
      return filteredList.sort((a, b) => {
        if (a.name > b.name) return 1
        if (a.name < b.name) return -1
        return 0
      })
    }


    const sortedData = fullList.reduce((acc, m) => {
      const firstChar = m.name[0].toUpperCase()
      const sectionExists = acc.some((i) => i.sectionHeader === firstChar)

      if (sectionExists) {
        return acc.map((section) =>
          section.sectionHeader === firstChar ? { ...section, monsters: [...section.monsters, m] } : section
        )
      }
      else return [...acc, { sectionHeader: firstChar, monsters: [m] }]
    }, [])

    return sortedData
  }, [filterTerm, fullList])

  const getMonster = useCallback(async (monsterIndex) => {
    if (savedMonsters.some((m) => m.index === monsterIndex)) return

    const data = await getMonsterFromIndex(monsterIndex)
    setSavedMonsters((v) => [...v, data])
  }, [savedMonsters])

  return (
    <div className={`page-content${activeTab === 'tracker' ? ' tracker-active' : ''}`} id="monsters-page">
      <div id="view-splitter">
        <div id="search-pane" className={`initiative-pane${activeTab === 'search' ? ' active' : ''}`}>
        <div id='monster-search-column'>
          <Input className="full-width" label="Search All Monsters" value={filterTerm} onUpdate={setFilterTerm} />
          <button className='flat-button full-button add-custom-monster' onClick={() => setCustomDialogOpen(true)}>
            Add Custom Monster
          </button>
          <div id="monster-list-container">
            {filterTerm?.length < 1 || filterTerm === null ? alphabetizedData.map((section) => (
              <div key={section?.sectionHeader} className="monster-section">
                <ExpansionPannel header={section.sectionHeader} width='100%'>
                  <div className="monsters-list">
                    {section.monsters.map((m) => (
                      <button
                        disabled={savedMonsters.some((i) => i.index === m.index)}
                        className='text-button'
                        key={m.index}
                        onClick={() => getMonster(m.index)}
                      >
                        <div className='single-monster-text'>{m.name}</div>
                      </button>
                    )
                    )}
                  </div>
                </ExpansionPannel>
              </div>
            )) : (
              <div id="monster-filter-results">
                {alphabetizedData.map((monster) => (
                  <button
                    disabled={savedMonsters.some((i) => i.index === monster.index)}
                    className='text-button' key={monster.index}
                    onClick={() => getMonster(monster.index)}
                  >
                    <div className='single-monster-text'>{monster.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Unmounted on the mobile tracker tab so an open drawer can't keep body scroll locked */}
        {(isDesktop || activeTab === 'search') && <BottomDrawer>
          {savedMonsters.length > 0 && !initiative.encounter && (
            <div className='saved-monsters-hint'>Open an encounter in the tracker to add monsters to it.</div>
          )}
          {savedMonsters.length < 1 && <div className='saved-monsters-empty'>Pick a monster from the list to see its stats.</div>}
          <StackedCards>
            {savedMonsters.map((m) => (
              <MonsterCard
                key={m.index}
                monster={m}
                onRemove={removeFromStack}
                onAddToInitiative={initiative.addMonster}
                canAddToInitiative={!!initiative.encounter}
                initiativeCount={(initiative.encounter?.entries || []).filter((e) => e.type === 'monster' && e.monster.index === m.index).length}
              />
            ))}
          </StackedCards>
        </BottomDrawer>}
        </div>
        <div id="tracker-pane" className={`initiative-pane${activeTab === 'tracker' ? ' active' : ''}`}>
          <InitiativeTracker initiative={initiative} />
        </div>
      </div>
      {customDialogOpen && <CustomMonsterDialog onClose={() => setCustomDialogOpen(false)} onCreate={addCustomMonster} />}
      <div className="initiative-tabs">
        <button className={activeTab === 'search' ? 'active' : ''} onClick={() => setActiveTab('search')}>
          <MdSearch />
          <span>Search</span>
        </button>
        <button className={activeTab === 'tracker' ? 'active' : ''} onClick={() => setActiveTab('tracker')}>
          <MdFormatListNumbered />
          <span>Tracker{initiative.encounter?.entries.length > 0 ? ` (${initiative.encounter.entries.length})` : ''}</span>
        </button>
      </div>
    </div >
  )
}
