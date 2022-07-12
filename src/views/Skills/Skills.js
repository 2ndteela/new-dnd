import React, { useState, useEffect } from 'react';
import StatBox from '../../components/StatBox/StatBox';
import './Skills.css'
import { skillList, loadCharacter, writeCharacter } from '../../assets/utilities';
import {GiDiceTwentyFacesTwenty} from 'react-icons/gi'
import Input from '../../components/Input/Input';

export default function Skills({setFormula, editMode}) {
    const [skills] = useState(skillList())
    const [ character, setCharacter ] = useState(loadCharacter())
    const [ selectedSkill, setSelectedSkill ] = useState()
    const [ currentSkills, setCurrentSkills ] = useState(skills)
    const [ skillFilter, setSkillFilter ] = useState('All')
    const skillBases = ['All', 'Chr', 'Dex', 'Int', 'Str', 'Wis']
    const statRowOne = [ 
        {   
            name: 'Charisma',
            save: 'charSave',
            main: 'charisma'
        },
        {   
            name: 'Constitution',
            save: 'conSave',
            main: 'const'
        },
        {   
            name: 'Dexterity',
            save: 'dexSave',
            main: 'dex'
        },
    ]
    const statRowTwo = [ 
        {   
            name: 'Intelligence',
            save: 'intSave',
            main: 'intelligence'
        },
        {   
            name: 'Strength',
            save: 'strSave',
            main: 'strength'
        },
        {   
            name: 'Wisdom',
            save: 'wisSave',
            main: 'wisdom'
        },
    ]
    const statRows = [statRowOne, statRowTwo]

    useEffect(() => {
        const allSkills = [...skills]

        if(skillFilter === 'All')
            setCurrentSkills(allSkills)

        else 
            setCurrentSkills(allSkills.filter(s => s.base === skillFilter))    
    }, [skillFilter, skills])

    function updateField(value, field) {
        const char = {...character}
        char[field] = value

        writeCharacter(char)
        setCharacter(char)
    }

    function updateIndex(value, field, index, array) {
        const char = {...character}
        char[array][index][field] = value

        writeCharacter(char)
        setCharacter(char)
    }

    return ( 
        <div style={{width: '100%'}}>
            {
                statRows.map((row, rowNum) => (
                    <div className="stats-box" style={ (rowNum === 0 && !editMode) ? {paddingBottom: '24px'} : {}}>
                    {row.map(s => {
                        const props = {
                            name: s.name,
                            save: character[s.save],
                            main: character[s.main],
                            setFormula,
                        }
                        return editMode ? 
                        <div className='editible-stat'> 
                            <Input 
                            label={s.name} 
                            val={props.main} 
                            field={s.main} 
                            add 
                            onUpdate={updateField} /> 
                            <Input 
                            label="Save" 
                            val={props.save} 
                            field={s.save} 
                            add 
                            onUpdate={updateField} /> 
                        </div> 
                        : <StatBox {...props} ></StatBox>
                    })}
                    </div>
                ))
            }

        <div id='skill-header-and-buttons' >
            <h2 className="sub-header" style={{color: 'grey', paddingBottom: '4px'}} >Skill Checks</h2>
            <div id="skill-filter-buttons">
            {
                !editMode && skillBases.map(s => <button key={s} onClick={() => setSkillFilter(s)} className={`${skillFilter === s ? 'selected-skill-button' : ''}`} >{s}</button>)
            }
            </div>
        </div>
        <div className="skills-box" >
            {currentSkills.map((s, i) => (
                editMode ? <Input 
                label={s.name} 
                val={character[s.field]} 
                field={s.field} 
                add 
                onUpdate={updateField}  />:
                (
                    <div className={selectedSkill === i ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => setSelectedSkill(i)} key={`skillz-${i}`}>
                        <div style={{display: 'flex', flexDirection: 'row', height: '24px'}}>
                            <div className='roll-dice-for-skill' onClick={() => setFormula(`d20 + ${character[s.field]}`)}> <GiDiceTwentyFacesTwenty /> </div>
                            <h3>{s.name}</h3> 
                        </div>
                        <span> {character[s.field]}</span>
                    </div>  
                )
            ))}
        </div>
        <h2 className="sub-header" style={{color: 'grey'}} >Abilities</h2>
        <div style={{width: '100%'}}>
            {character.abilities.map((a, i) => (
                editMode ? 
                <div style={{width: '100%', paddingBottom: '16px'}}>
                    <Input label="Name" val={a.header} field='header' idx={i} arr='abilities' onUpdate={updateIndex} />
                    <Input label="Description" textarea val={a.description} field="description" idx={i} arr='abilities' onUpdate={updateIndex} />
                </div> 
                : <div 
                    className='class-ability' 
                    key={'abil-' + i}
                    >
                        <h3>{a.header}</h3>
                        <div>{a.description}</div>
                    </div>
                )
            )}
        </div>
    </div>
    );
}