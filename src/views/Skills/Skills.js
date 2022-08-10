import React, { useState, useEffect } from 'react';
import StatBox from '../../components/StatBox/StatBox';
import './Skills.css'
import { skillList } from '../../assets/utilities';
import {GiDiceTwentyFacesTwenty} from 'react-icons/gi'
import Input from '../../components/Input/Input';
import { useCharacterContext } from '../../components/MultiPannelViewer/CharacterContext'
import { IoMdCloseCircle } from 'react-icons/io'

export default function Skills({setFormula, editMode}) {
    const [skills] = useState(skillList())
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
    const { character, updateCharacter} = useCharacterContext()

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

        updateCharacter(char)
    }

    function updateIndex(value, field, index, array) {
        const char = {...character}
        char[array][index][field] = value

        updateCharacter(char)
    }

    function addAbility() {
        const char = {...character}
        if(!char.abilities) char.abilities = []
        
        char.abilities.push({
            header: '',
            description: ''
        })

        updateCharacter(char)
    }

    function removeAbility(idx) {
        const char = {...character}

        char.abilities.splice(idx, 1)

        updateCharacter(char)
    }

    function fillSkills() {

        let charVal, strVal, constVal, dexVal, intVal, wisVal = 10

        try {
            charVal = Math.floor((character.charisma - 10) / 2)
            strVal = Math.floor((character.strength - 10) / 2)
            constVal = Math.floor((character.const - 10) /2)
            dexVal = Math.floor((character.dex - 10) / 2)
            intVal = Math.floor((character.intelligence - 10) /2) 
            wisVal = Math.floor((character.wisdom - 10) / 2 )
        }
        finally {
            const skills = {
                charSave: charVal,
                deception: charVal,
                intim: charVal,
                perform: charVal,
                persuasion: charVal,

                conSave: constVal,

                dexSave: dexVal,
                acrobatics: dexVal,
                soh: dexVal,
                stealth: dexVal,
                
                intSave: intVal,
                arcana: intVal,
                history: intVal,
                invest: intVal,
                nature: intVal,
                religion: intVal,

                strSave: strVal,
                athletics: strVal,

                wisSave: wisVal,
                aniHand: wisVal,
                insight: wisVal,
                med: wisVal,
                perception: wisVal,
                survival: wisVal
            }

            const char = {...character}

            statRowOne.forEach(stat => {
                if(!char[stat.main]) char[stat.main] = 10
                if(!char[stat.save]) char[stat.save] = 0
            })

            statRowTwo.forEach(stat => {
                if(!char[stat.main]) char[stat.main] = 10
                if(!char[stat.save]) char[stat.save] = 0
            })

            Object.keys(skills).forEach(skill => {
                char[skill] = skills[skill]
            })

            updateCharacter(char)
        }
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

        {editMode && <button onClick={fillSkills} >Fill Skills</button>}
        <div id='skill-header-and-buttons' >
            <h2 className="sub-header grey-color" style={{paddingBottom: '4px'}} >Skill Checks</h2>
            <div id="skill-filter-buttons">
            { skillBases.map(s => <button key={s} onClick={() => setSkillFilter(s)} className={`${skillFilter === s ? 'selected-skill-button' : ''}`} >{s}</button>)}
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
        { (character.abilities.length > 0 || editMode) && 
        <div className='full-width-row'>
            <h2 className="sub-header grey-color">Abilities</h2>
            {editMode && <button className='icon-button' onClick={addAbility}>+</button>}
        </div>}
        <div style={{width: '100%'}}>
            {character.abilities.map((a, i) => (
                editMode ? 
                <div style={{width: '100%', paddingBottom: '16px'}}>
                    <div className='full-width-row'>
                        <div style={{width: '100%', marginRight: '8px'}}>
                            <Input label="Name" val={a.header} field='header' idx={i} arr='abilities' onUpdate={updateIndex} />
                            <Input label="Description" textarea val={a.description} field="description" idx={i} arr='abilities' onUpdate={updateIndex} />
                        </div>
                        <div>
                            <IoMdCloseCircle style={{fontSize: '24px'}} onClick={() => removeAbility(i)} />
                        </div>
                    </div>
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