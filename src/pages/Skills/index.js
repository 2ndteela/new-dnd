import React, { Component } from 'react';
import StatBox from '../../comp/StatBox'
import {readInCharacter} from '../services.js'
import BottomNav from '../../comp/BottomNav'
import Header from '../../comp/Header'
import {NavLink} from 'react-router-dom'
import './style.css'

class Skills extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            abilities: []
         }
    }

    componentDidMount() {
        const data = readInCharacter()
        this.setState(data)
    }

    setSelectedSkill(idx) {
        this.setState({
            selectedSkill: idx
        })
    }

    render() { 
        return ( 
            <div>
                <Header label="Skills">
                    <NavLink to='/characters' >Characters</NavLink>
                    <NavLink to='/' >Logout</NavLink>
                </Header>
                <div className="page-content with-bottom-nav">
                    <div className="stats-box" >
                        <StatBox name="Charisma" save={this.state.charSave} main={this.state.charisma}></StatBox>
                        <StatBox name="Constitution" save={this.state.conSave} main={this.state.const}></StatBox>
                        <StatBox name="Dexterity" save={this.state.dexSave} main={this.state.dex}></StatBox>
                    </div>
                    <div className="stats-box" >
                        <StatBox name="Intelligence" save={this.state.intSave} main={this.state.intelligence}></StatBox>
                        <StatBox name="Strength" save={this.state.strSave} main={this.state.strength}></StatBox>
                        <StatBox name="Wisdom" save={this.state.wisSave} main={this.state.wisdom}></StatBox>
                    </div>
                    <h2 className="sub-header" style={{color: 'grey'}} >Skill Checks</h2>
                    <div className="skills-box" >
                        <div 
                        className={ this.state.selectedSkill === 0 ? "solo-skill selected-skill" : 'solo-skill'} 
                        onClick={() => this.setSelectedSkill(0)}>
                            <h3>Acrobatics</h3><span>{this.state.acrobatics}</span>
                        </div>
                        <div 
                        className={ this.state.selectedSkill === 1 ? "solo-skill selected-skill" : 'solo-skill'}
                        onClick={() => this.setSelectedSkill(1)}>
                            <h3>Animal Handling</h3><span>{this.state.aniHand}</span>
                        </div>
                        <div 
                        className={ this.state.selectedSkill === 2 ? "solo-skill selected-skill" : 'solo-skill'}
                        onClick={() => this.setSelectedSkill(2)}>
                            <h3>Arcana</h3><span>{this.state.arcana}</span>
                        </div>
                        <div 
                        className={ this.state.selectedSkill === 3 ? "solo-skill selected-skill" : 'solo-skill'} 
                        onClick={() => this.setSelectedSkill(3)}>
                            <h3>Athletics</h3><span>{this.state.athletics}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 4 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(4)}>
                            <h3>Deception</h3><span>{this.state.deception}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 5 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(5)}>
                            <h3>History</h3><span>{this.state.history}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 6 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(6)}>
                            <h3>Insight</h3><span>{this.state.insight}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 7 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(7)}>
                            <h3>Initimidation</h3><span>{this.state.intim}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 8 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(8)}>
                            <h3>Invesitgation</h3><span>{this.state.invest}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 9 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(9)}>
                            <h3>Medicine</h3><span>{this.state.med}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 10 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(10)}>
                            <h3>Nature</h3><span>{this.state.nature}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 11 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(11)}>
                            <h3>Perception</h3><span>{this.state.perception}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 12 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(12)}>
                            <h3>Performance</h3><span>{this.state.perform}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 13 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(13)}>
                            <h3>Persuasion</h3><span>{this.state.persuasion}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 14 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(14)}>
                            <h3>Religion</h3><span>{this.state.religion}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 15 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(15)}>
                            <h3>Slight of Hand</h3><span>{this.state.soh}</span>
                        </div>
                        <div className={ this.state.selectedSkill === 16 ? "solo-skill selected-skill" : 'solo-skill'} onClick={() => this.setSelectedSkill(16)}>
                            <h3>Sealth</h3><span>{this.state.stealth}</span>
                        </div>
                    </div>
                    <h2 className="sub-header" style={{color: 'grey'}} >Abilities</h2>
                    <div>
                        {this.state.abilities.map((a, i) => {
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
}
 
export default Skills;