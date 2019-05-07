import React, { Component } from 'react';
import {readInCharacter} from '../services'
import Slot from '../../comp/Slot'
import Input from '../../comp/Input'
import BottomNav from '../../comp/BottomNav'

import './style.css'

class Fight extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            weapons: [],
            customAttacks: [],
            spellSlots: []
         }

        this.updateState = this.updateState.bind(this)
    }

    componentDidMount() {
        this.setState(readInCharacter())
        console.log(readInCharacter())
    }

    updateState(val, field) {
        this.setState({
            [field]: val
        })
    }

    render() { 
        return ( 
            <div>
                <h1 className="header">Fight</h1>
                <div className="page-content with-bottom-nav">
                    <div className="multi-input" style={{paddingBottom: '16px'}}>
                        <Slot label="Health" max={this.state.health} val={this.state.currentHealth} field="currentHealth" onUpdate={this.updateState} ></Slot>
                        <Input add={true} label="Temporary Health" val={this.state.tempHealth} field="tempHealth" onUpdate={this.updateState} ></Input>
                    </div>
                    <div className="read-only-stats" >
                        <div className="some-stat">
                            <span>{this.state.ac}</span>
                            <span className="stat-label">AC</span>
                        </div>
                        <div className="some-stat">
                            <span>{this.state.hitDie}</span>
                            <span className="stat-label">Hit Die</span>
                        </div>
                        <Input add={true} label="Dice left" field="hitDiceNum" val={this.state.hitDiceNum} onUpdate={this.updateState} />
                    </div>
                    <h2 className="sub-header" style={{color: 'grey'}} >{this.state.weapons.length > 0 ? 'Weapons' : ''}</h2>
                    {this.state.weapons.map((w, i) => {
                        return (
                        <div className="weapon-container" key={'wep-' + i} >
                            <div className="weapon-header">
                                <h3>{w.name}</h3>
                                <span>{w.damType}</span>
                            </div>
                            <div className="weapon-stats">
                                <div className="stat-box">
                                    <div>{w.range}</div>
                                    <span>Range</span>
                                </div>
                                <div className="stat-box">
                                    <div>{w.atkBns > 0 ? '+' + w.atkBns : w.atkBns}</div>
                                    <span>Attack Bonus</span>
                                </div>
                                <div className="stat-box">
                                    <div>{w.damage}</div>
                                    <span>Damage</span>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                    <h2 className="sub-header" style={{color: 'grey'}}>{this.state.weapons.length > 0 ? 'Custom Attacks' : ''}</h2>
                    {this.state.customAttacks.map((ca, i) => {
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

                    <h2 className="sub-header" style={{color: 'grey'}}>{this.state.spellSlots.length > 0 ? 'Spell Slots' : ''}</h2>
                    {this.state.spellSlots.map((ss, i) =>{ 
                        return <Slot label={"Level " + (parseInt(i, 10) + 1)} />
                    })}
                </div>
                <BottomNav></BottomNav>
            </div>
         );
    }
}
 
export default Fight;