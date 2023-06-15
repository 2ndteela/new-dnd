import React, { useEffect, useMemo, useState } from 'react'
import { getAllClasses, getFromDnd5eApi } from '../../../assets/services'

import '../CharacterCreation.css'

export default function Class() {
  const [ selectedClass, setSelectedClass ] = useState({})
  const [ classData, setClassData ] = useState({})
  const [ classList, setClassList ] = useState([])

  useEffect(() => {
    async function f() {
      const list = await getAllClasses()
      setClassList(list)
    }

    f()
  }, [])

  useEffect(() => {
    async function f() {
      const data = await getFromDnd5eApi(selectedClass)
      console.log(data)
      setClassData(data)
    }

    f()
  }, [selectedClass])

  const prerequisites = useMemo(() => {
    if(classData?.multi_classing?.prerequisites) return classData.multi_classing.prerequisites
    return []
  }, [classData])

  const spellcasting = useMemo(() => {
    if(classData?.spellcasting) return classData.spellcasting
    return { 
      spellcasting_ability: {}
    }
  }, [classData])

  const proficiencies = useMemo(() => {
    if(classData?.proficiencies) return classData.proficiencies
    return []
  }, [classData])

  const proficiencesChoices = useMemo(() => {
    if(classData?.proficiency_choices) return classData.proficiency_choices
    return []
  }, [classData])

  const savingThrows = useMemo(() => {
    if(classData?.saving_throws) return classData?.saving_throws
    return []
  }, [classData])

  const startingGear = useMemo(() => {
    if(classData?.starting_equipment) return classData.starting_equipment
    return []
  }, [classData])

  const gearOptions = useMemo(() => {
    if(classData?.starting_equipment_options) return classData.starting_equipment_options
    return []
  }, [classData])

  return (
    <div className="page-content push-start" style={{alignItems: 'flex-start', minHeight:'unset' }} >
        <h2>What class do you want to be?</h2>
        <br />
        <div id="class-table">
          <div id="class-options">
            {classList.map(c => <span className={selectedClass === c.url ? 'selected-class' : ''}  onClick={() => setSelectedClass(c.url)} >{c.name}</span>)}
          </div>
          {classData ? (
            <div id="class-description">
              {prerequisites.length > 0 && (
                <div className='class-detail' >
                  <h3>Requirements</h3>
                  {prerequisites.map(prereq => <span>{prereq.ability_score.name}: minimum level {prereq.minimum_score}</span>)}
                </div>
              )}
              <div className='class-detail'>
                <h3>Proficiencies</h3>
                {proficiencies.map(pro => <span>{pro.name}</span>)}
              </div>
              <div className='class-detail'>
                <h3>Proficiency Choices</h3>
                {proficiencesChoices.map(choice => <span>{choice.desc}</span>)}
              </div>
              <div className='class-detail'>
                <h3>Saving Throws</h3>
                {savingThrows.map(st => <span>{st.name}</span>)}
              </div>
              {spellcasting.spellcasting_ability?.name && (
                  <div className='class-detail'>
                    <h3>Spell Casting</h3>
                    <span>{spellcasting.spellcasting_ability.name}</span>
                  </div>
              )}
              {startingGear.length > 0 && (
                <div className='class-detail'>
                  <h3>Starting Equipment</h3>
                  {startingGear.map(sg => <span>{sg.equipment.name}</span>)}
                </div>
              )}
              {gearOptions.length > 0 && (
                <div className='class-detail'>
                  <h3>Other gear options</h3>
                  {gearOptions.map(go => <span>{go.desc}</span>)}
                </div>
              )}
            </div>
          ) : <h3 style={{padding: '16px', fontWeight: 300}} >Select a class to begin</h3>}
        </div>
    </div>
  )
}
