import React, { useState, useEffect } from 'react';
import Input from '../../components/Input/Input'
import CheckBox from '../../components/CheckBox/CheckBox';
import { useCharacterContext } from '../../components/MultiPannelViewer/CharacterContext';

import './style.css'
import { MdArrowDropDown, MdArrowDropDownCircle, MdArrowDropUp, MdArrowUpward, MdClose } from 'react-icons/md';
import {searchForSpell} from '../../assets/services'

export default function Spells({editMode}) {

    const { character, updateCharacter, allSpells } = useCharacterContext()
    const [ spells ] = useState(character.spells ? character.spells : [])
    const [ filteredSpells, setFilteredSpells] = useState(character.spells ? character.spells : [])
    const [ filterTerm, setFilterTerm ] = useState('lowest')
    const [ searchTerm, setSearchTerm ] = useState('')
    const [ handbookSpellSearch, setHandbookSpellSearch ] = useState('')
    const [ filteredHandbookSpells, setfilteredHandbookSpells ] = useState([])
    const [ selectedSpell, setSelectedSpell ] = useState()
    const [ showSpellList, setShowSpellList ] = useState(false)

    useEffect(() => {
        const spells = [...character.spells]
        spells.forEach(s => {
            s.castingLevel = parseInt(s.level, 10)
        })
        setFilteredSpells(spells)

    }, [character])

    useEffect(() => {
        if(!handbookSpellSearch)
            setfilteredHandbookSpells(allSpells.results)

        else if(selectedSpell) {
            setfilteredHandbookSpells([selectedSpell])
        }

        else 
            setfilteredHandbookSpells(allSpells.results.filter(s => s.name.toLowerCase().includes(handbookSpellSearch.toLocaleLowerCase())))
    }, [allSpells, handbookSpellSearch])

    function updateState(val, field) {
        const newChar = {...character}
        newChar[field] = val

        updateCharacter(newChar)
    }

    function updateArray(val, field, idx, arr) {
        const charCopy = {...character}
        const toUpdate = character[arr]
        const temp = [...toUpdate]
        temp[idx][field] = val
        charCopy[arr] = temp

        updateState(temp, arr)
    }

    useEffect(() => {
        let arr = []
        let temp =[...spells]
        if(searchTerm)
            temp.forEach(s => {
                if(s.name.toUpperCase().includes(searchTerm.toUpperCase()) || s.description.toUpperCase().includes(searchTerm.toUpperCase())) arr.push(s)
            })
        else arr = temp

        if(filterTerm === 'lowest') arr.sort((a, b) => {
            if(a.level === 'Cantrip' && b.level !== 'Cantrip') return -1
            if(b.level === 'Cantrip' && a.level !== 'Cantrip') return 1 
            if(a.level === b.level) return a.name - b.name
            return a.level - b.level
        })
        else if (filterTerm === 'highest') arr.sort((a, b) => {
            if(a.level === 'Cantrip' && b.level !== 'Cantrip') return 1
            if(b.level === 'Cantrip' && a.level !== 'Cantrip') return -1 
            if(a.level === b.level) return a.name - b.name
            return b.level - a.level
            
        })
        
        else arr.sort((a, b) => (a.name - b.name))

        setFilteredSpells(arr)

    }, [searchTerm, filterTerm, spells])

    function addNewSpellToBook(spell) {
        const char = {...character}
        const newSpell = {
            name: spell.name,
            level: spell.level,
            range: spell.range,
            description: spell.desc.join('\n'),
            con: spell.concentration,
            somatic: spell.components.indexOf('S') > -1,
            vocal: spell.components.indexOf('V') > -1,
            duration: spell.duration,
            castingTime: spell.casting_time,
        }

        if(spell?.damage?.damage_at_slot_level) {
            const keys = Object.keys(spell.damage.damage_at_slot_level)
            newSpell.damage = spell.damage.damage_at_slot_level[keys[0]]
            
            if(keys.length > 1)
                newSpell.description += '\n\nAt higher levels:'

            for(let i = 1; i < keys.length; i++)
                newSpell.description = `${newSpell.description}${i !== 1 ? ', ': ' '} ${keys[i]}: ${spell.damage.damage_at_slot_level[keys[i]]}`

        }
        setSelectedSpell('')
        setHandbookSpellSearch('')
        char.spells.push(newSpell)

        updateCharacter(char)
    }

    function addBlankSpell() {
        const char = {...character}

        char.spells = [{
            name: '', 
            level: 0, 
            description: '',
            castingTime: '',
            duration: '',
            range: '',
            damage: ''
        }, ...char.spells]

        updateCharacter(char)
    }

    function removeSpell(idx) {
        const char = {...character}
        char.spells.splice(idx, 1)

        updateCharacter(char)
    }

    async function getSpellDetails(spell) {
        if(selectedSpell?.name === spell.name) {
            return
        }
        
        try {
            const val = await searchForSpell(spell.index)
            setHandbookSpellSearch(spell.name)
            setSelectedSpell(val)
        }
        catch(error) {
            console.error(error)
        }
    }

    function handleChipClose() {
        setSelectedSpell(null)
        setHandbookSpellSearch('')
    }

    return ( 
        <div id="spells-container">
            {spells?.length > 0 && (
                <div id="spells-list-container">
                    { !editMode && 
                    <div className="styled-input">
                        <select value={filterTerm} onChange={(e) => setFilterTerm(e.target.value)} >
                            <option value="lowest" >Lowest Level</option>
                            <option value="highest" >Highest Level</option>
                            <option value="alpha" >Alphabetical</option>
                        </select>
                        <span>Order</span>
                    </div>
                    }
                    { !editMode && <Input label="Search" val={searchTerm} onUpdate={setSearchTerm} ></Input>}
                    {editMode && <div id="search-new-spell">
                        <div className='full-width-row'>
                            <Input label="Search Handbook Spells" val={handbookSpellSearch} onUpdate={setHandbookSpellSearch} />
                            <button className='icon-button' style={{marginLeft: '8px'}} onClick={() => setShowSpellList(!showSpellList)} > { showSpellList ? <MdArrowDropUp /> : <MdArrowDropDown />} </button>
                        </div>
                        <div id="handbook-spell-list">
                            <div id="current-spell-list" className={(handbookSpellSearch || showSpellList) ? 'show-handbook-spells' : ''} >
                                {filteredHandbookSpells.map(s => (
                                    <div className='spell-in-list' onClick={() => getSpellDetails(s)} key={s.index} >
                                        {s?.name}
                                        {s?.name === selectedSpell?.name && <MdClose style={{position: 'relative', left: '8px'}} onClick={handleChipClose} />}
                                    </div>
                                ))}
                            </div>
                        {selectedSpell && 
                        <div id="selected-spell-data">
                            <div className='full-width-row'>
                                <div style={{width: '100%', alignItems: 'flex-start', paddingBottom: '8px'}}>
                                    <div className='full-width-row' ><b>Range:</b> <div>{selectedSpell?.range}</div></div>
                                    <div className='full-width-row'> <b>School:</b> <div>{selectedSpell?.school?.name}</div></div>
                                    <div className='full-width-row'> <b>Level:</b><div>{selectedSpell?.level === 0 ? 'Cantrip': `Level ${selectedSpell.level}`}</div></div>
                                    <div className='full-width-row'> <b>Casting Time:</b> <div>{selectedSpell?.casting_time}</div></div>
                                    <div className='full-width-row'> <b>Duration:</b> <div>{selectedSpell?.duration}</div></div>
                                </div>
                                <button onClick={() => addNewSpellToBook(selectedSpell)}>Add Spell</button>
                                </div>
                                <div className='full-width-row spell-requirements'>
                                    {selectedSpell.concentration && <div className='spell-requirement'>Concentration</div>} 
                                    {selectedSpell?.components.includes('V') && <div className='spell-requirement'>Vocal</div>} 
                                    {selectedSpell?.components.includes('S') && <div className='spell-requirement'>Somatic</div>}
                                </div>
                                <div>
                                    {selectedSpell.desc.map(d => (
                                        <div key={d} style={{paddingBottom: '8px'}} >{d}</div>
                                    ))}
                                </div>
                            </div>}
                        </div>
                    </div> }
                    {editMode && <div onClick={addBlankSpell} id="add-new-spell-box">New Blank Spell</div>}
                    { filteredSpells.map((s, i) => (
                        editMode ? 
                        <div key={`${i}-edit-spell`} style={{alignItems: 'flex-end'}}>
                            <button className='icon-button' onClick={() => removeSpell(i)}>
                                <MdClose />
                            </button>
                            <div className='edit-spell-box'>
                                <div className='full-width-row' >
                                    <Input label="Name" val={s.name} field="name" idx={i} arr="spells" onUpdate={updateArray} />
                                </div>
                                <div className='full-width-row space-styled-inputs'>
                                    <Input label="Casting Time" val={s.castingTime} field='castingTime' idx={i} arr='spells' onUpdate={updateArray} ></Input>
                                    <Input label="Duration" val={s.duration} field='duration' idx={i} arr='spells' onUpdate={updateArray} ></Input>
                                </div>
                                <div className='full-width-row space-styled-inputs'> 
                                    <Input label="Range" val={s.range} field="range" idx={i} arr="spells" onUpdate={updateArray} />
                                    <Input label="Damage" val={s.damage} field="damage" idx={i} arr="spells" onUpdate={updateArray} />
                                    <Input add label="Level" val={s.level} field="level" idx={i} arr="spells" onUpdate={updateArray} />
                                </div>
                                <Input textarea label="Description" val={s.description} field="description" idx={i} arr="spells" onUpdate={updateArray} />
                                <div className='full-width-row'>
                                    <CheckBox arr='spells' field="con" idx={i} model={s.con} label="Concentration" onUpdate={updateArray} />
                                    <CheckBox arr='spells' field="somatic" idx={i} model={s.somatic} label="Somatic" onUpdate={updateArray} />
                                    <CheckBox arr='spells' field="vocal" idx={i} model={s.vocal} label="Vocal" onUpdate={updateArray} />
                                </div>
                            </div>
                        </div> :
                            <div className="spell-box" key={'spel-' + i}>
                                <div className="spell-header">
                                    <h3>{s.name}</h3>
                                    <span>{s.level === 'Cantrip' || s.level === 'cantrip' ? 'Cantrip' : 'Level ' + s.level}</span>
                                </div>
                                <div style={{paddingBottom: '8px'}}>
                                    {s.description}
                                </div>
                                <div className="spell-stats">
                                    <div className="spell-stat-container">
                                        <div>{s.range}</div>
                                        <span>Range</span>
                                    </div>
                                    <div className="spell-stat-container">
                                        <div>{s.damage}</div>
                                        <span>Damage</span>
                                    </div>
                                </div>
                                <div style={{paddingTop: '12px', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                                    <div className='full-width-row' >
                                        { s.con && <div className='spell-requirement'>Concentration</div>}
                                        { s.somatic && <div className='spell-requirement'>Somatic</div>}
                                        { s.vocal && <div className='spell-requirement'>Vocal</div>}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
            </div>)}
        </div>
    )
}