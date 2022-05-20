import React, { useState, useEffect } from 'react';
import BottomNav from '../../components/BottomNav/BottomNav'
import Header from '../../components/Header/Header'
import StatBox from '../../components/StatBox/StatBox';
import { Link } from 'react-router-dom'
import './Skills.css'
import { skillList, loadCharacter } from '../../assets/utilities';
import { writeCharacterToDb } from '../../assets/services';

export default function Skills() {
    const skills = skillList()
    const character = loadCharacter()
    const [ selectedSkill, setSelectedSkill ] = useState()

    useEffect(() => {
        if(!character.savedChar)
            writeCharacterToDb()
    })

    return ( 
        <div>
            <Header label="Skills">
                <Link to='/characters' >Characters</Link>
                <Link to='/' >Logout</Link>
            </Header>
            <div className="page-content with-bottom-nav">
                <div className="stats-box" >
                    <StatBox name="Charisma" save={character.charSave} main={character.charisma}></StatBox>
                    <StatBox name="Constitution" save={character.conSave} main={character.const}></StatBox>
                    <StatBox name="Dexterity" save={character.dexSave} main={character.dex}></StatBox>
                </div>
                <div className="stats-box" >
                    <StatBox name="Intelligence" save={character.intSave} main={character.intelligence}></StatBox>
                    <StatBox name="Strength" save={character.strSave} main={character.strength}></StatBox>
                    <StatBox name="Wisdom" save={character.wisSave} main={character.wisdom}></StatBox>
                </div>
                <h2 className="sub-header" style={{color: 'grey'}} >Skill Checks</h2>
                <div className="skills-box" >
                    {skills.map((s, i) => {
                        return (
                            <div className={selectedSkill === i ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => setSelectedSkill(i)} key={`s-${i}`}>
                                <h3>{s.name}</h3><span>{character[s.field]}</span>
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
            <BottomNav></BottomNav>
        </div>
    );
}