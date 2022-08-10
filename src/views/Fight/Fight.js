import React, { useState, useEffect } from 'react';
import Slot from '../../components/Slot/Slot'
import Input from '../../components/Input/Input'

import './Fight.css'
import CheckBox from '../../components/CheckBox/CheckBox';
import { AiFillCloseCircle, AiOutlineMinusCircle } from 'react-icons/ai';
import { useCharacterContext } from '../../components/MultiPannelViewer/CharacterContext';
import { searchForWeapon } from '../../assets/services';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

export default function Fight({setFormula, editMode }) {

    const {character, updateCharacter, allWeapons} = useCharacterContext()
    const [ filteredWeapons, setFilteredWeapons ] = useState([])
    const [ weaponSearch, setWeaponSearch ] = useState('')
    const [ selectedWeapon, setSelectedWeapon ] = useState(null)
    const [ showFilteredWeapons, setShowFilteredWeapons ] = useState(true)

    function updateState(val, field) {
        const newChar = {...character}
        newChar[field] = val

        updateCharacter(newChar)
    }

    function updateArrayValue(val, field, itr = 0, arr) {
        const charCopy = {...character}
        const toUpdate = character[arr]
        const temp = [...toUpdate]
        temp[itr][field] = val
        charCopy[arr] = temp

        updateState(temp, arr)
    }

    function longRest() {
        const slots =  [...character.spellSlots]
        slots?.forEach(s => {
            s.usedSlots = 0
        })

        const customs = [...character.customFields]
        customs?.forEach(c => {
            if(!!c.maxValue) c.value = 0
        })

        const dice = parseInt(character.hitDiceNum, 10)
        const lvl = parseInt(character.level, 10) 
        let moreDice = lvl

        if(dice < lvl) {
            const diff = lvl - dice
            moreDice = Math.ceil(diff / 2) + dice
        }

        const newChar = {...character}
        newChar.currentHealth = parseInt(character.health, 10)
        newChar.spellSlots = slots
        newChar.customFields = customs
        newChar.hitDiceNum = moreDice

        updateCharacter(newChar)
    }

    function addNewWeapon() {
        const char = {...character}
        if(char.weapons)
            char.weapons.push({
                dmgType: '',
                damage: ''
            })
        else 
            char.weapons = []

        updateCharacter(char)
    }

    function removeWeapon(idx) {
        const char = {...character}
        if(char.weapons)
            char.weapons.splice(idx, 1)

        updateCharacter(char)
    }

    function addNewSpellSlot() {
        const char = {...character}
        if(char.weapons)
            char.spellSlots.push({
                maxSlots: 0,
                usedSlots: 0
            })
        else 
            char.weapons = []

        updateCharacter(char)
    }

    function removeSpellSlot() {
        const char = {...character}
        if(char.spellSlots)
            char.spellSlots.splice(char.spellSlots.length - 1, 1)

        updateCharacter(char)
    }

    function addCustomSlot() {
        const char = {...character}
        if(char.customFields)
            char.customFields.push({
                maxValue: 0,
                label: 0
            })
        else 
            char.customFields = []

        updateCharacter(char)
    }

    function removeCustomSlot(idx) {
        const char = {...character}
        if(char.customFields)
            char.customFields.splice(idx, 1)

        updateCharacter(char)
    }

    async function getWeaponDetails(weapon) {
        if(weapon.name === selectedWeapon?.name)
            return

        try {
            const w = await searchForWeapon(weapon.index)
            if(w) {
                setWeaponSearch(weapon.name)
                setSelectedWeapon(w)
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if(allWeapons?.equipment) {
            if(!weaponSearch) {
                setFilteredWeapons(allWeapons.equipment)
                setSelectedWeapon(null)
            }

            else {
                setShowFilteredWeapons(true)
                const filtered = allWeapons.equipment.filter(w => w.name.toLowerCase().includes(weaponSearch.toLowerCase()))
                setFilteredWeapons(filtered)
            }

        }
    }, [weaponSearch, allWeapons, selectedWeapon])

    useEffect(() => {
        if(!showFilteredWeapons && selectedWeapon)
            setSelectedWeapon(null)
    }, [showFilteredWeapons, selectedWeapon])

    function addHandbookWeapon() {
        const char = {...character}
        
        const newWeapon = {
            name: selectedWeapon.name,
            damType: selectedWeapon.damage.damage_type.name,
            range: selectedWeapon.range.long ? `${selectedWeapon.range.normal} - ${selectedWeapon.range.long}` : selectedWeapon.range.normal,
            damage: selectedWeapon.damage.damage_dice,
        }

        if(selectedWeapon.two_handed_damage) {
            newWeapon.versitile = true
            newWeapon.versitileDamage = selectedWeapon.two_handed_damage.damage_dice
        }

        char.weapons.push(newWeapon)
        setSelectedWeapon(null)
        updateCharacter(char)
    }

    return ( 
        <div>
            <div>
                <div className="multi-input" style={{paddingBottom: '16px'}}>
                    <Slot label="Health" max={character.health} val={character.currentHealth} field="currentHealth" onUpdate={updateState} ></Slot>
                    <Input add label="Temporary Health" val={character.tempHealth} field="tempHealth" onUpdate={updateState} ></Input>
                </div>
                {editMode && <Input label="Max Health" add val={character.health} field="health" onUpdate={updateState} />}
                <div className="read-only-stats" >
                    <Input label='Armor Class' val={character.ac} field="ac" onUpdate={updateState} disabled={!editMode} />
                    <Input label='Hit Die' val={character.hitDie} field="hitDie" onUpdate={updateState} disabled={!editMode} />
                    <Input add label="Dice left" field="hitDiceNum" val={character.hitDiceNum} onUpdate={updateState} />
                </div>
                <Input label='Speed' val={character.speed} field="speed" onUpdate={updateState} disabled={!editMode} />
                <div className='full-width-row' style={{alignItems: 'center'}}>
                    { (character.weapons || editMode) && <h2 className='sub-header grey-color' >Attacks and Weapons</h2>}
                    {editMode && (
                    <div style={{flexDirection: 'row'}}>
                        <button onClick={addNewWeapon} style={{marginBottom: '0px'}} className="icon-button">+</button>
                    </div>)}
                </div>
                <div id="all-weapons">
                    { editMode && (
                        <div style={{width: '100%'}} >
                            <div className='full-width-row'>
                                <Input label="Search Handbook Weapons" val={weaponSearch} onUpdate={setWeaponSearch} />
                                <div style={{paddingLeft: '8px'}} >
                                    <button className='icon-button' onClick={() => setShowFilteredWeapons(!showFilteredWeapons)} > {showFilteredWeapons ?<MdArrowDropUp /> : <MdArrowDropDown />} </button>
                                </div>
                            </div>
                            <div id='handbook-weapons-chips' className={showFilteredWeapons ? 'open-weapon-chips' : ''} >
                                {filteredWeapons.map(w => (
                                    <div key={w.key} onClick={() => getWeaponDetails(w)} className='weapon-chip'>{w.name}</div>
                                ))}
                            </div>
                            <div id="selected-weapon-info" className={selectedWeapon ? 'open-selected-weapon' : ''} >
                                {selectedWeapon && !selectedWeapon.isMagic && (
                                        <>
                                            <div className='full-width-row' ><strong>Name:</strong> {selectedWeapon.name}</div>
                                            <div className='full-width-row' ><strong>Damage:</strong> {selectedWeapon?.damage?.damage_dice} {selectedWeapon?.two_handed_damage ? `/ ${selectedWeapon.two_handed_damage.damage_dice}` : '' } {selectedWeapon?.damage.damage_type.name} </div>
                                            { selectedWeapon?.range && <div className='full-width-row'><strong>Range:</strong> {selectedWeapon.range.normal} {selectedWeapon.range.long ? `, ${selectedWeapon.range.long}` : '' }</div>}
                                            <div className='full-width-row'>
                                                <div className='full-width-row'>{selectedWeapon?.properties.map(p => <strong>{p.name}</strong>)} </div>
                                            </div>
                                        </>
                                )}
                                {selectedWeapon && selectedWeapon?.isMagic && (
                                    <>
                                        <div className='full-width-row' ><strong>Name:</strong> {selectedWeapon.name}</div>
                                        <div className='full-width-row' ><strong>Rarity:</strong> {selectedWeapon?.rarity?.name}</div>
                                        <div className='full-width-row'>
                                            <div className='magical-description'>{selectedWeapon?.desc.map(d => <span>{d}</span>)} </div>
                                        </div>
                                    </>
                                )}
                                {selectedWeapon && !selectedWeapon?.isMagic && 
                                <div 
                                    className='full-width-row' 
                                    style={{paddingTop: '8px', justifyContent: 'flex-end'}}
                                    onClick={addHandbookWeapon}
                                ><button>Add Weapon</button></div>
                                }
                                {selectedWeapon?.isMagic && <div>This weapon can't be added automatically</div>}
                            </div>
                        </div>
                    )}
                    {character?.weapons.map((w, i) => (
                        editMode ? 
                        <div className='full-width-row'>
                            <div className='editable-weapon-container' >
                                <div className='full-width-row space-styled-inputs'>
                                    <Input label="Name" val={w.name} field="name" arr="weapons" idx={i} onUpdate={updateArrayValue} />
                                    <Input label="Damage Type" val={w.damType} field="damType" arr="weapons" idx={i} onUpdate={updateArrayValue} />
                                </div>
                                <div className='full-width-row space-styled-inputs'>
                                    <Input label="Range" val={w.range} field="range" arr="weapons" idx={i} onUpdate={updateArrayValue} />
                                    <Input label="Attack Bonus" val={w.atkBns} field="atkBns" arr="weapons" idx={i} onUpdate={updateArrayValue} />
                                    <Input label="Damage" val={w.damage} field="damage" arr="weapons" idx={i} onUpdate={updateArrayValue} />
                                </div>
                                { w.versitile && <Input label="Versitile Damage" val={w.versitileDamage} field='versitileDamage' arr="weapons" idx={i} onUpdate={updateArrayValue} />}
                                <div className='full-width-row'>
                                    <CheckBox label='Versitile' model={w.versitile} idx={i} arr="weapons" field="versitile" onUpdate={updateArrayValue} ></CheckBox>
                                </div>
                            </div> 
                            <AiFillCloseCircle onClick={() => removeWeapon(i)} style={{fontSize: '24px', marginLeft: '8px', position: 'relative', top: '-28px'}} />
                        </div>
                        : <div className="weapon-container" key={'wep-' + i} onClick={() => setFormula(`d20 + ${w.atkBns}`)} >
                            <div className="weapon-header">
                                <h3>{w.name}</h3>
                                <span>{w.damType}</span>
                            </div>
                            <div className="weapon-stats">
                                <div className="weapon-stat-box smaller">
                                    <div>{w.range}</div>
                                    <span>Range</span>
                                </div>
                                <div className="weapon-stat-box smaller">
                                    <div>{w.atkBns > 0 ? '+' + w.atkBns : w.atkBns}</div>
                                    <span>Attack Bonus</span>
                                </div>
                                <div className="weapon-stat-box">
                                    <div>{w.damage} {w.versitile && `/ ${w.versitileDamage}`} </div>
                                    <span>Damage</span>
                                </div>
                            </div>
                        </div>
                        )
                    )}
                </div>

                <div className='full-width-row' style={{alignItems: 'center'}}>
                    { (character.spellSlots || editMode) && <h2 className='sub-header grey-color'>Spell Slots</h2>}
                    {editMode && 
                        <div style={{flexDirection: 'row'}}>
                            <AiOutlineMinusCircle onClick={() => removeSpellSlot()} style={{fontSize: '24px', marginRight: '8px', position: 'relative'}} />
                            <button onClick={addNewSpellSlot} style={{marginBottom: '0px'}} className="icon-button">+</button>
                        </div>
                    }
                </div>
                {character?.spellSlots?.map((ss, i) => (
                        editMode ? 
                        <div className='full-width-row' style={{paddingBottom: '8px'}}>
                            <Input label={`Level ${(parseInt(i, 10) + 1)}`} val={ss.maxSlots} idx={i} field="maxSlots" arr="spellSlots" onUpdate={updateArrayValue} add ></Input>
                        </div>
                        : <div style={{width: '100%', paddingBottom: '8px'}}>
                            <Slot max={ss.maxSlots} val={ss.usedSlots} label={"Level " + (parseInt(i, 10) + 1)} idx={i} field="usedSlots" arr="spellSlots" reverse onUpdate={updateArrayValue} />
                        </div>
                    )
                )}

                <div className='full-width-row' style={{alignItems: 'center'}}>
                    { (character.customFields || editMode) && <h2 className='sub-header grey-color' >Custom Fields</h2>}
                    {editMode && <button onClick={addCustomSlot} style={{marginBottom: '0px'}} className="icon-button">+</button>}
                </div>
                {character?.customFields?.map((cs, i) => {

                    if(editMode) 
                        return (
                            <div className='full-width-row'>
                                <div style={{width: '100%', paddingBottom: '16px'}}>
                                    <div className='full-width-row'> 
                                        <div className="styled-input">
                                            <select 
                                                value={cs.type} 
                                                onChange={(e) => updateArrayValue(e.target.value, 'type', i, 'customFields') }>
                                                <option value="small">Text</option>
                                                <option value="big" >Text Area</option>
                                                <option value="number">Number</option>
                                                <option value="slot">Slot</option>
                                            </select>
                                            <span>Input Type</span>
                                        </div>
                                        {cs.type === 'slot' &&  <div style={{width: '16px'}} />}
                                        {cs.type === 'slot' && 
                                            <Input 
                                                label="Max Value" 
                                                val={cs.maxValue} 
                                                onUpdate={updateArrayValue} 
                                                idx={i} 
                                                field="maxValue" 
                                                arr="customFields" 
                                            />
                                        }
                                    </div>
                                    <Input label="Label" val={cs.label} onUpdate={updateArrayValue} idx={i} field="label" arr="customFields" />
                                </div>
                                <AiFillCloseCircle onClick={() => removeCustomSlot(i)} style={{fontSize: '24px', marginLeft: '8px', position: 'relative', top: '-12px'}} />
                            </div>
                        )

                    if(cs.type === 'slot')
                    return ( 
                        <div style={{width: '100%', paddingBottom: '16px'}} >
                            <Slot 
                                max={cs.maxValue} 
                                label={cs.label} 
                                val={cs.value} 
                                onUpdate={updateArrayValue} 
                                idx={i} 
                                field="value" 
                                arr="customFields"
                            ></Slot>
                        </div>
                    )

                    return(
                        <div style={{width: '100%', paddingBottom: '16px'}} >
                            <Input 
                                label={cs.label} 
                                val={cs.value} 
                                onUpdate={updateArrayValue} 
                                idx={i} 
                                field="value" 
                                arr="customFields" 
                                textarea={cs.type === 'big'} 
                                add={cs.type === 'number'} 
                            ></Input>
                        </div>
                    )
                })}
                <button className="full-button" onClick={longRest} >Long Rest</button>
                <br></br>
            </div>
        </div>
        );
}