import React, { useMemo } from 'react'
import ExpansionPanel from '../ExpansionPanel/ExpansionPanel'
import { StackedCard, StackedCardActions, StackedCardBody, StackedCardHeader } from '../StackedCards/StackedCards'
import './MonsterCard.css'
import Button from '../Button/Button'

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
    <div className="monster-stats-table">
      {baseStats.map((s) => <MonsterStatBox key={`${monster.index}-${s.name}`} {...s} />)}
    </div>
  )
}

function MonsterProficiencies({ monster }) {
  const proficienciesCheck = monster.proficiencies.filter((p) => p?.proficiency?.name?.includes('Skill:'))

  // Always shown: AC/size/speed matter even without skill proficiencies
  return (
    <ExpansionPanel header="More Stats" bottomBorder>
      <div className='full-width'>
        {proficienciesCheck.map((p) => (
          <div key={p.proficiency.index} className='other-prof-row'>
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
            {Object.keys(monster.speed).map((k) => <div key={k}>{k}: {monster.speed[k]}</div>)}
          </div>
        </div>
      </div>
    </ExpansionPanel>
  )
}
export function MonsterDetails({ monster }) {
  return (
    <>
      <MonsterStats monster={monster} />
      <div className='full-width monster-details-section'>
        <MonsterProficiencies monster={monster} />
      </div>
      <div className='full-width monster-details-section'>
        {monster.special_abilities.length > 0 &&
          <ExpansionPanel header="Abilities" bottomBorder>
            {monster.special_abilities.map((ability) => (
              <div key={ability.name} className='monster-detail-entry'>
                <h5>{ability.name}</h5>
                <div>{ability.desc}</div>
              </div>
            ))}
          </ExpansionPanel>}
      </div>
      <div className='full-width monster-details-section'>
        {monster.actions.length > 0 && (
          <ExpansionPanel header="Actions" bottomBorder>
            {monster.actions.map((a) => (
              <div key={a.name} className='monster-detail-entry'>
                <h5>{a.name}</h5>
                <div>{a.desc}</div>
              </div>
            ))}
          </ExpansionPanel>
        )}
      </div>
    </>
  )
}
export default function MonsterCard({ monster, onRemove, onAddToInitiative, canAddToInitiative = true, initiativeCount = 0 }) {
  return (
    <StackedCard>
      <StackedCardHeader title={monster.name} subtitle={monster.type} detail={
        <div className='monster-card-health'>
          <h4>Health</h4>
          <div>{monster.hit_points_roll ? `${monster.hit_points_roll} (${monster.hit_points})` : monster.hit_points}</div>
        </div>
      } />
      <StackedCardBody>
        <MonsterDetails monster={monster} />
      </StackedCardBody>
      <StackedCardActions>
        <Button variant='text' onClick={() => onRemove(monster.index)}>Remove</Button>
        <Button variant='flat' disabled={!canAddToInitiative} onClick={() => onAddToInitiative(monster)}>
          Add To Initiative
          {initiativeCount > 0 && <span className='initiative-count' aria-label={`${initiativeCount} in initiative`}>{initiativeCount}</span>}
        </Button>
      </StackedCardActions>
    </StackedCard>
  )
}
