import React, { useState, useEffect } from 'react';
import Slot from '../../components/Slot/Slot'
import Input from '../../components/Input/Input'
import { writeCharacter, loadCharacter } from '../../assets/utilities';
import { writeCharacterToDb } from '../../assets/services';

import './Fight.css'

export default function Fight() {
    const [ character, setCharacter ] = useState(loadCharacter())
    

    useEffect(() => {
        if(!character.savedChar)
            writeCharacterToDb()
    }, [])



    function updateState(val, field) {
        const newChar = {...character}
        newChar[field] = val

        setCharacter(newChar)
        writeCharacter(newChar)
    }

    function updateArrayValue(val, field, itr = 0, arr) {
        const toUpdate = character[arr]
        const temp = [...toUpdate]
        temp[itr][field] = val

        updateState(temp, arr)
        writeCharacter(temp)
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

    return ( 
        <div>
            {/* <Header label="Fight">
                <Link to='/characters' >Characters</Link>
                <Link to='/' >Logout</Link>
            </Header> */}
            <div className>
                <div className="multi-input" style={{paddingBottom: '16px'}}>
                    <Slot label="Health" max={character.health} val={character.currentHealth} field="currentHealth" onUpdate={updateState} ></Slot>
                    <Input add label="Temporary Health" val={character.tempHealth} field="tempHealth" onUpdate={updateState} ></Input>
                </div>
                <div className="read-only-stats" >
                    <div className="some-stat">
                        <span>{character.ac}</span>
                        <span className="stat-label">AC</span>
                    </div>
                    <div className="some-stat">
                        <span>{character.hitDie}</span>
                        <span className="stat-label">Hit Die</span>
                    </div>
                    <Input add label="Dice left" field="hitDiceNum" val={character.hitDiceNum} onUpdate={updateState} />
                </div>
                <h2 className={character.weapons.length > 0 ? 'sub-header' : ''} style={{color: 'grey'}} >{character.weapons.length > 0 ? 'Weapons' : ''}</h2>
                <div id="all-weapons">
                    {character.weapons.map((w, i) => {
                        return (
                        <div className="weapon-container" key={'wep-' + i} >
                            <div className="weapon-header">
                                <h3>{w.name}</h3>
                                <span>{w.damType}</span>
                            </div>
                            <div className="weapon-stats">
                                <div className="weapon-stat-box">
                                    <div>{w.range}</div>
                                    <span>Range</span>
                                </div>
                                <div className="weapon-stat-box">
                                    <div>{w.atkBns > 0 ? '+' + w.atkBns : w.atkBns}</div>
                                    <span>Attack Bonus</span>
                                </div>
                                <div className="weapon-stat-box">
                                    <div>{w.damage}</div>
                                    <span>Damage</span>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
                <h2 className={character?.customAttacks?.length > 0 ? 'sub-header' : ''} style={{color: 'grey'}}>{character?.customAttacks?.length > 0 ? 'Custom Attacks' : ''}</h2>
                {character?.customAttacks?.map((ca, i) => {
                    return (
                    <div key={'ca-' + i} className="weapon-container">
                        <div className="weapon-header" style={{paddingBottom: '8px'}}>
                            <h3>{ca.name}</h3>
                            <span>{ca.damType}</span>
                        </div>
                        <div className="custom-description">
                            {ca.description}
                        </div>
                        <div className="weapon-stats">
                            <div className="custom-stat-box">
                                <div>{ca.damage}</div>
                                <span>Damage</span>
                            </div>
                            <div className="custom-stat-box">
                                <div>{ca.range}</div>
                                <span>Range</span>
                            </div>
                        </div>
                    </div>
                    )
                })}

                <h2 className={character?.spellSlots?.length > 0 ? 'sub-header' : ''} style={{color: 'grey'}}>{character?.spellSlots?.length > 0 ? 'Spell Slots' : ''}</h2>
                {character?.spellSlots?.map((ss, i) =>{ 
                    return (
                        <div style={{width: '100%', paddingBottom: '16px'}}>
                            <Slot max={ss.maxSlots} val={ss.usedSlots} label={"Level " + (parseInt(i, 10) + 1)} idx={i} field="usedSlots" arr="spellSlots" reverse onUpdate={updateArrayValue} />
                        </div>
                    )
                })}

                <h2 className="sub-header" style={{color: 'grey'}}>{character?.customFields?.length > 0 ? 'Custom Slots' : ''}</h2>
                {character?.customFields?.map((cs, i) => {
                    if(cs.type === 'slot')
                    return ( 
                        <div style={{width: '100%', paddingBottom: '16px'}} >
                            <Slot max={cs.maxValue} label={cs.label} val={cs.value} onUpdate={updateArrayValue} idx={i} field="value" arr="customFields"></Slot>
                        </div>
                    )
                    if(cs.type === 'small')
                    return(
                        <div style={{width: '100%', paddingBottom: '16px'}} >
                            <Input label={cs.label} val={cs.value} onUpdate={updateArrayValue} idx={i} field="value" arr="customFields"></Input>
                        </div>
                    )
                    if(cs.type === 'big')
                    return(
                        <div style={{width: '100%', paddingBottom: '16px'}} >
                            <Input textarea label={cs.label} val={cs.value} onUpdate={updateArrayValue} idx={i} field="value" arr="customFields"></Input>
                        </div>
                    )

                    return(
                        <div style={{width: '100%', paddingBottom: '16px'}}>
                            <Input add label={cs.label} val={cs.value} onUpdate={updateArrayValue} idx={i} field="value" arr="customFields"></Input>
                        </div>
                    )
                })}
                <button className="full-button" onClick={longRest} >Long Rest</button>
                <br></br>
            </div>
            {/* <BottomNav></BottomNav> */}
        </div>
        );
}