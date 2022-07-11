import React, { useState, useEffect } from 'react';
import StatBox from '../../components/StatBox/StatBox';
import './Skills.css'
import { skillList, loadCharacter } from '../../assets/utilities';
import {GiDiceTwentyFacesTwenty} from 'react-icons/gi'

export default function Skills({setFormula}) {
    const skills = skillList()
    const character = loadCharacter()
    const [ selectedSkill, setSelectedSkill ] = useState()
    const [ currentSkills, setCurrentSkills ] = useState(skills)
    const [ skillFilter, setSkillFilter ] = useState('All')
    const skillBases = ['All', 'Chr', 'Dex', 'Int', 'Str', 'Wis']

    useEffect(() => {
        const allSkills = [...skills]

        if(skillFilter === 'All')
            setCurrentSkills(allSkills)

        else 
            setCurrentSkills(allSkills.filter(s => s.base === skillFilter))    
        }, [skillFilter, skills])

    return ( 
        <div>
            <div>
                <div className="stats-box" style={{paddingBottom: '24px'}}>
                    <StatBox name="Charisma" save={character.charSave} main={character.charisma} setFormula={setFormula} ></StatBox>
                    <StatBox name="Constitution" save={character.conSave} main={character.const} setFormula={setFormula}></StatBox>
                    <StatBox name="Dexterity" save={character.dexSave} main={character.dex} setFormula={setFormula}></StatBox>
                </div>
                <div className="stats-box" >
                    <StatBox name="Intelligence" save={character.intSave} main={character.intelligence} setFormula={setFormula}></StatBox>
                    <StatBox name="Strength" save={character.strSave} main={character.strength} setFormula={setFormula}></StatBox>
                    <StatBox name="Wisdom" save={character.wisSave} main={character.wisdom} setFormula={setFormula}></StatBox>
                </div>
                <div id='skill-header-and-buttons' >
                    <h2 className="sub-header" style={{color: 'grey', paddingBottom: '4px'}} >Skill Checks</h2>
                    <div id="skill-filter-buttons">
                    {
                        skillBases.map(s => <button onClick={() => setSkillFilter(s)} className={`${skillFilter === s ? 'selected-skill-button' : ''}`} >{s}</button>)
                    }
                    </div>
                </div>
                <div className="skills-box" >
                    {currentSkills.map((s, i) => {
                        return (
                            <div className={selectedSkill === i ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => setSelectedSkill(i)} key={`s-${i}`}>
                                <div style={{display: 'flex', flexDirection: 'row', height: '24px'}}>
                                    <div className='roll-dice-for-skill' onClick={() => setFormula(`d20 + ${character[s.field]}`)}> <GiDiceTwentyFacesTwenty /> </div>
                                    <h3>{s.name}</h3> 
                                </div>
                                <span> {character[s.field]}</span>
                            </div>  
                        )
                    })}
                </div>
                <h2 className="sub-header" style={{color: 'grey'}} >Abilities</h2>
                <div style={{width: '100%'}}>
                    {character.abilities.map((a, i) => {
                        return (
                            <div 
                            className='class-ability' 
                            key={'abil-' + i}
                            >
                                <h3>{a.header}</h3>
                                <div>{a.description}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}