import React, { useState } from 'react';
import Slot from '../../components/Slot/Slot'
import Input from '../../components/Input/Input'
import { writeCharacter, loadCharacter } from '../../assets/utilities';

import './Fight.css'
import CheckBox from '../../components/CheckBox/CheckBox';
import { AiFillCloseCircle, AiOutlineMinusCircle } from 'react-icons/ai';

export default function Fight({setFormula, editMode}) {
    const [ character, setCharacter ] = useState(loadCharacter())

    function updateState(val, field) {
        const newChar = {...character}
        newChar[field] = val

        setCharacter(newChar)
        writeCharacter(newChar)
    }

    function updateArrayValue(val, field, itr = 0, arr) {
        const charCopy = {...character}
        const toUpdate = character[arr]
        const temp = [...toUpdate]
        temp[itr][field] = val
        charCopy[arr] = temp

        updateState(temp, arr)
        writeCharacter(charCopy)
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

        setCharacter(newChar)
        writeCharacter(newChar)
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

        setCharacter(char)
        writeCharacter(char)
    }

    function removeWeapon(idx) {
        const char = {...character}
        if(char.weapons)
            char.weapons.splice(idx, 1)

        setCharacter(char)
        writeCharacter(char)
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

        setCharacter(char)
        writeCharacter(char)
    }

    function removeSpellSlot() {
        const char = {...character}
        if(char.spellSlots)
            char.spellSlots.splice(char.spellSlots.length - 1, 1)

        setCharacter(char)
        writeCharacter(char)
    }

    function addCustomSlot() {
        const char = {...character}
        if(char.weapons)
            char.customFields.push({
                maxValue: 0,
                label: 0
            })
        else 
            char.weapons = []

        setCharacter(char)
        writeCharacter(char)
    }

    function removeCustomSlot(idx) {
        const char = {...character}
        if(char.customFields)
            char.customFields.splice(idx, 1)

        setCharacter(char)
        writeCharacter(char)
    }

    return ( 
        <div>
            <div className>
                <div className="multi-input" style={{paddingBottom: '16px'}}>
                    <Slot label="Health" max={character.health} val={character.currentHealth} field="currentHealth" onUpdate={updateState} ></Slot>
                    <Input add label="Temporary Health" val={character.tempHealth} field="tempHealth" onUpdate={updateState} ></Input>
                </div>
                <div className="read-only-stats" >
                    <Input label='Armor Class' val={character.ac} field="ac" onUpdate={updateState} disabled={!editMode} />
                    <Input label='Hit Die' val={character.hitDie} field="hitDie" onUpdate={updateState} disabled={!editMode} />
                    <Input add label="Dice left" field="hitDiceNum" val={character.hitDiceNum} onUpdate={updateState} />
                </div>
                <Input label='Speed' val={character.speed} field="speed" onUpdate={updateState} disabled={!editMode} />
                <div style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    { (character.weapons || editMode) && <h2 className='sub-header' style={{color: 'grey'}} >Attacks and Weapons</h2>}
                    {editMode && <button onClick={addNewWeapon} style={{marginBottom: '0px'}} className="icon-button">+</button>}
                </div>
                <div id="all-weapons">
                    {character?.weapons.map((w, i) => (
                        editMode ? 
                        <div style={{flexDirection: 'row'}}>
                            <div className='editable-weapon-container' >
                                <div style={{flexDirection: 'row', width: '100%'}}>
                                    <Input label="Name" val={w.name} field="name" arr="weapons" idx={i} onUpdate={updateArrayValue} />
                                    <div style={{width: '16px'}} />
                                    <Input label="Damage Type" val={w.damType} field="damType" arr="weapons" idx={i} onUpdate={updateArrayValue} />
                                </div>
                                <div style={{flexDirection: 'row', width: '100%'}}>
                                    <Input label="Range" val={w.range} field="range" arr="weapons" idx={i} onUpdate={updateArrayValue} />
                                    <div style={{width: '24px'}} />
                                    <Input label="Attack Bonus" val={w.atkBns} field="atkBns" arr="weapons" idx={i} onUpdate={updateArrayValue} />
                                    <div style={{width: '24px'}} />
                                    <Input label="Damage" val={w.damage} field="damage" arr="weapons" idx={i} onUpdate={updateArrayValue} />
                                </div>
                                { w.versitile && <Input label="Versitile Damage" val={w.versitileDamage} field='versitileDamage' arr="weapons" idx={i} onUpdate={updateArrayValue} />}
                                <div style={{flexDirection: 'row', width: '100%'}}>
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

                <div style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    { (character.spellSlots || editMode) && <h2 className='sub-header' style={{color: 'grey'}} >Spell Slots</h2>}
                    {editMode && 
                        <div style={{flexDirection: 'row'}}>
                            <AiOutlineMinusCircle onClick={() => removeSpellSlot()} style={{fontSize: '24px', marginRight: '8px', position: 'relative'}} />
                            <button onClick={addNewSpellSlot} style={{marginBottom: '0px'}} className="icon-button">+</button>
                        </div>
                    }
                </div>
                {character?.spellSlots?.map((ss, i) => (
                        editMode ? 
                        <div style={{width: '100%', paddingBottom: '8px', flexDirection: 'row'}}>
                            <Input label={`Level ${(parseInt(i, 10) + 1)}`} val={ss.maxSlots} idx={i} field="maxSlots" arr="spellSlots" onUpdate={updateArrayValue} add ></Input>
                        </div>
                        : <div style={{width: '100%', paddingBottom: '8px'}}>
                            <Slot max={ss.maxSlots} val={ss.usedSlots} label={"Level " + (parseInt(i, 10) + 1)} idx={i} field="usedSlots" arr="spellSlots" reverse onUpdate={updateArrayValue} />
                        </div>
                    )
                )}

                <div style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    { (character.customFields || editMode) && <h2 className='sub-header' style={{color: 'grey'}} >Custom Fields</h2>}
                    {editMode && <button onClick={addCustomSlot} style={{marginBottom: '0px'}} className="icon-button">+</button>}
                </div>
                {character?.customFields?.map((cs, i) => {

                    if(editMode) 
                        return (
                            <div style={{flexDirection: 'row', width: '100%'}}>
                                <div style={{width: '100%', paddingBottom: '16px'}}>
                                    <div style={{flexDirection: 'row', width: '100%'}}> 
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