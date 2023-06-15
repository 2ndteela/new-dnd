import React, { useEffect, useState } from 'react'
import { getAllClasses, getFromDnd5eApi } from '../../../assets/services'

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

  return (
    <div className="page-content push-start" style={{alignItems: 'flex-start'}} >
        <h1>What do you want to be?</h1>
        <br />
        <div className="styled-input">
            <select onChange={(e) => setSelectedClass(e.target.value)} value={selectedClass} >
                {classList?.length && classList.map(c => <option key={c.index} value={c.url}>{c.name}</option>)}
            </select>
            <span>Class</span>
        </div>
        {classData && (
          <div>
            <div>
              <h2>Requirements</h2>

              {classData.multi_classing?.prerequisites.map(prereq => <span>{prereq.ability_score.name}: minimum level {prereq.minimum_score}</span>)}
            </div>
            <div>
              <h2>Proficiencies</h2>
              {classData.proficiencies.map(pro => <span>{pro.name}</span>)}
            </div>
            <div>
              <h2>Proficiency Choices</h2>
              {classData.proficiency_choices.map(choice => <span>{choice.desc}</span>)}
            </div>
            <div>
              <h2>Saving Throws</h2>
              {classData.saving_throws.map(st => <span>{st.name}</span>)}
            </div>
            <div>
              <h2>Spell Casting</h2>
              {classData.spellcasting?.spellcasting_ability.name}
            </div>
          </div>
        )}
    </div>
  )
}
