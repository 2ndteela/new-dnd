import React, { useState, useMemo } from 'react';
import StatBox from '../../components/StatBox/StatBox';
import './Skills.css'
import { skillList } from '../../assets/utilities';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi'
import Input from '../../components/Input/Input';
import { useCharacterContext } from '../../components/MultiPanelViewer/CharacterContext'
import { IoMdCloseCircle } from 'react-icons/io'
import ExpandableCard from '../../components/ExpandableCard/ExpandableCard';
import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import { MdAdd } from 'react-icons/md'
import { useDiceRoller } from '../../components/DiceRollerDialog/DiceRollerProvider'

export default function Skills({ editMode }) {
    const { rollDice } = useDiceRoller()
    const [skills] = useState(skillList())
    const [selectedSkill, setSelectedSkill] = useState()
    const [skillFilter, setSkillFilter] = useState('All')
    const [skillOrder, setSkillOrder] = useState('A-Z')
    const skillBases = [
        {
            label: 'All',
            value: 'All'
        },
        {
            label: 'Charisma',
            value: 'Chr'
        },
        {
            label: 'Dexterity',
            value: 'Dex'
        },
        {
            label: 'Integration',
            value: 'Int'
        },
        {
            label: 'Strength',
            value: 'Str'
        },
        {
            label: 'Wisdom',
            value: 'Wis'
        }
    ]
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
    const { character, updateCharacter } = useCharacterContext()
    const currentSkills = useMemo(() => {
        const allSkills = [...skills]

        if (skillOrder === 'a-z') allSkills.sort((a, b) => {
            if (a.name > b.name) return 1
            return -1
        })
        if (skillOrder === 'h-l') allSkills.sort((a, b) => {
            if (character[a.field] > character[b.field]) return -1
            return 1
        })
        if (skillOrder === 'l-h') allSkills.sort((a, b) => {
            if (character[a.field] > character[b.field]) return 1
            return -1
        })

        if (skillFilter === 'All') return allSkills
        return allSkills.filter(s => s.base === skillFilter)
    }, [skillFilter, skills, skillOrder, character])

    function updateField(value, field) {
        const char = { ...character }
        char[field] = value
        updateCharacter(char)
    }

    function updateIndex(value, field, index, array) {
        const char = { ...character }
        char[array][index][field] = value
        updateCharacter(char)
    }

    function addAbility() {
        const char = { ...character }
        if (!char.abilities) char.abilities = []

        char.abilities.push({
            header: '',
            description: ''
        })

        updateCharacter(char)
    }

    function removeAbility(idx) {
        const char = { ...character }
        char.abilities.splice(idx, 1)
        updateCharacter(char)
    }

    function fillSkills() {

        let charVal, strVal, constVal, dexVal, intVal, wisVal = 10

        try {
            charVal = Math.floor((character.charisma - 10) / 2)
            strVal = Math.floor((character.strength - 10) / 2)
            constVal = Math.floor((character.const - 10) / 2)
            dexVal = Math.floor((character.dex - 10) / 2)
            intVal = Math.floor((character.intelligence - 10) / 2)
            wisVal = Math.floor((character.wisdom - 10) / 2)
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

            const char = { ...character }

            statRowOne.forEach(stat => {
                if (!char[stat.main]) char[stat.main] = 10
                if (!char[stat.save]) char[stat.save] = 0
            })

            statRowTwo.forEach(stat => {
                if (!char[stat.main]) char[stat.main] = 10
                if (!char[stat.save]) char[stat.save] = 0
            })

            Object.keys(skills).forEach(skill => {
                char[skill] = skills[skill]
            })

            updateCharacter(char)
        }
    }

    return (
        <div className='skills-view'>
            {
                statRows.map((row, rowNum) => (
                    <div className={`stats-box${(rowNum === 0 && !editMode) ? ' stats-box-spaced' : ''}`}>
                        {row.map(s => {
                            const props = {
                                name: s.name,
                                save: character[s.save],
                                main: character[s.main],
                            }
                            return editMode ?
                                <div className='editable-stat'>
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

            {editMode && <Button onClick={fillSkills}>Fill Skills</Button>}
            <div id='skill-header-and-buttons' >
                <h2 className="sub-header grey-color skills-heading">Skill Checks</h2>
                <div className='skill-filters'>
                    <div className='skill-select skill-select-filter'>
                        <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)} >
                            {skillBases.map(s => <option value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    <div className='skill-select skill-select-order'>
                        <select value={skillOrder} onChange={e => setSkillOrder(e.target.value)} >
                            <option value="a-z">A - Z</option>
                            <option value="h-l">H - L</option>
                            <option value="l-h">L - H</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="skills-box" >
                {currentSkills.map((s, i) => (
                    editMode ? (<Input
                        label={s.name}
                        val={character[s.field]}
                        field={s.field}
                        add
                        onUpdate={updateField} />)
                        : (
                            <div className={selectedSkill === i ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => setSelectedSkill(i)} key={`skillz-${i}`}>
                                <div className='solo-skill-name'>
                                    <IconButton
                                        size='sm'
                                        label={`Roll ${s.name}`}
                                        className='roll-dice-for-skill'
                                        tabIndex={selectedSkill === i ? 0 : -1}
                                        onClick={() => rollDice(`d20 + ${character[s.field]}`, { label: s.name })}
                                    >
                                        <GiDiceTwentyFacesTwenty />
                                    </IconButton>
                                    <div>{s.name}</div>
                                </div>
                                <span>{character[s.field]}</span>
                            </div>
                        )
                ))}
            </div>
            {(character.abilities.length > 0 || editMode) &&
                <div className='full-width-row'>
                    <h2 className="sub-header grey-color">Abilities</h2>
                    {editMode && <IconButton variant='filled' size='sm' label='Add ability' className='skills-add-ability' onClick={addAbility}><MdAdd /></IconButton>}
                </div>}
            <div className='skills-abilities'>
                {character.abilities.map((a, i) => (
                    editMode ?
                        <div className='skills-ability-edit'>
                            <div className='full-width-row'>
                                <div className='skills-ability-fields'>
                                    <Input label="Name" val={a.header} field='header' idx={i} arr='abilities' onUpdate={updateIndex} />
                                    <Input label="Description" textarea val={a.description} field="description" idx={i} arr='abilities' onUpdate={updateIndex} />
                                </div>
                                <div>
                                    <IconButton tone='danger' label='Remove ability' className='skills-remove-ability' onClick={() => removeAbility(i)}>
                                        <IoMdCloseCircle />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                        : <ExpandableCard key={'abil-' + i} title={a.header} width='calc(50% - 4px)'>{a.description}</ExpandableCard>
                )
                )}
            </div>
        </div>
    );
}