import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { getFromDnd5eApi, getMonsterFromIndex } from '../../assets/services'
import Input from '../../components/Input/Input'
import "./MonstersAndInitiative.css"
import BottomDrawer from '../../components/BottomDrawer/BottomDrawer'
import ExpansionPannel from '../../components/ExpansionPannel/ExpansionPannel'
import StackedCards, { StackedCard, StackedCardActions, StackedCardBody, StackedCardHeader } from '../../components/StackedCards/StackedCards'

function MonsterStatBox({ name, value, save }) {
  const bonus = save ? save : Math.floor((value - 10) / 2)

  return (
    <div className='monster-stat-box'>
      <div className='monster-box-title'>
        {name}
      </div>
      <div className='monster-box-stats-container'>
        <h2 className={`monster-box-bonus${save ? ' has-save' : ''}`}>{bonus > 0 ? `+${bonus}` : bonus}</h2>
        <div className='monster-box-base-stat'>{value}</div>
      </div>
    </div>
  )
}

function MonsterStats({ monster }) {
  const stats = useMemo(() => [
    {
      name: 'Charisma',
      abbreviation: 'Cha'
    },
    {
      name: 'Constitution',
      abbreviation: 'Con'
    },
    {
      name: 'Dexterity',
      abbreviation: 'Dex'
    },
    {
      name: 'Intelligence',
      abbreviation: 'Int'
    },
    {
      name: 'Strength',
      abbreviation: 'Str'
    },
    {
      name: 'Wisdom',
      abbreviation: 'Wis'
    },
  ], [])

  const baseStats = useMemo(() => {
    return stats.map((s) => {
      const LCStatName = s.name.toLocaleLowerCase()
      const LCStatAbbr = s.abbreviation.toLocaleLowerCase()
      const proficiencyCheck = monster.proficiencies.find((p) => p.proficiency.index === `saving-throw-${LCStatAbbr}`)

      const base = {
        name: s.abbreviation,
        value: monster[LCStatName]
      }

      if (proficiencyCheck) base.save = proficiencyCheck.value
      return base
    })
  }, [monster, stats])


  return (
    <div className="monster-stats-table" style={{ flexDirection: 'row', width: '100%' }}>
      {baseStats.map((s) => <MonsterStatBox key={`${monster.index}-${s.name}`} {...s} />)}
    </div>
  )
}

function MonsterProficiencies({ monster }) {
  const proficienciesCheck = monster.proficiencies.filter((p) => p?.proficiency?.name?.includes('Skill:'))

  return proficienciesCheck.length < 1 ? null : (
    <ExpansionPannel header="More Stats" bottomBorder>
      <div style={{ width: '100%' }} >
        {proficienciesCheck.map((p) => (
          <div className='other-prof-row'>
            <h4>{p.proficiency.name.split(':')[1]}</h4>
            <div>+{p.value}</div>
          </div>
        ))}
        <div className='other-prof-row'>
          <h4>AC</h4>
          <div>{monster.armor_class[0].value}</div>
        </div>
        <div className='other-prof-row'>
          <h4>Size</h4>
          <div>{monster.size}</div>
        </div>
        <div className='other-prof-row'>
          <h4>Speed</h4>
          <div>
            {Object.keys(monster.speed).map((k) => <div>{k}: {monster.speed[k]}</div>)}
          </div>
        </div>
      </div>
    </ExpansionPannel>
  )
}

export default function MonstersAndInitiative() {
  const [loading, setLoading] = useState(false)
  const [fullList, setFullList] = useState([])
  const [savedMonsters, setSavedMonsters] = useState([])
  const [filterTerm, setFilterTerm] = useState(null)

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
    <div className="page-content">
      <div id="view-splitter">
        <div id='monster-list-container' >
          <Input className="full-width" label="Search All Monsters" value={filterTerm} onUpdate={setFilterTerm} />
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
        <BottomDrawer>
          <StackedCards>
            {savedMonsters.map((m) => (
              <StackedCard key={m.index} >
                <StackedCardHeader title={m.name} subtitle={m.type} detail={
                  <div style={{ alignItems: 'flex-end' }} >
                    <h4>Health</h4>
                    <div style={{ textAlign: 'right' }} >{m.hit_points_roll} ({m.hit_points})</div>
                  </div>
                } />
                <StackedCardBody>
                  <MonsterStats monster={m} />
                  <div className='full-width' style={{ marginTop: '16px' }} >
                    <MonsterProficiencies monster={m} />
                  </div>
                  <div className="full-width" style={{ paddingTop: '16px' }}>
                    {m.special_abilities.length > 0 &&
                      <ExpansionPannel header="Abilities" bottomBorder>
                        {m.special_abilities.map((ability) => (
                          <div style={{ width: '100%', alignItems: 'flex-start', paddingBottom: '8px' }} >
                            <h5>{ability.name}</h5>
                            <div>{ability.desc}</div>
                          </div>
                        ))}
                      </ExpansionPannel>}
                  </div>
                  <div className='full-width' style={{ paddingTop: '16px' }} >
                    {m.actions.length > 0 && (
                      <ExpansionPannel header="Actions" bottomBorder>
                        {m.actions.map((a) => (
                          <div style={{ width: '100%', alignItems: 'flex-start', paddingBottom: '8px' }}>
                            <h5>{a.name}</h5>
                            <div>{a.desc}</div>
                          </div>
                        ))}
                      </ExpansionPannel>
                    )}
                  </div>
                </StackedCardBody>
                <StackedCardActions>
                  <div style={{ paddingInlineEnd: '8px' }}>
                    <button className='text-button' onClick={() => removeFromStack(m.index)} >Remove</button>
                  </div>
                  <button className='flat-button'>Add To Initiative</button>
                </StackedCardActions>
              </StackedCard>
            ))}
          </StackedCards>
        </BottomDrawer>
      </div>
    </div >
  )
}
