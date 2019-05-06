import React, { Component } from 'react';
import {readInCharacter} from '../services'
import Slot from '../../comp/Slot'
import {NavLink} from 'react-router-dom'
import Input from '../../comp/Input'

import './style.css'

class Fight extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            weapons: [],
            customAttacks: []
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
                    <h3 className="sub-header" style={{color: 'grey'}} >Weapons</h3>
                    {this.state.weapons.map((w, i) => {
                        return (
                        <div className="weapon-container">
                            <h3>{w.name}</h3>
                        </div>
                        )
                    })}
                </div>
                <div className="bottom-nav">
                    <NavLink to="/spells">Spells</NavLink>
                    <NavLink to="/fight">Fight</NavLink>
                    <NavLink to='/skills'>Skills</NavLink>
                    <NavLink to='/pack'>Pack</NavLink>
                    <NavLink to='/edit'>Edit</NavLink>
                </div>
            </div>
         );
    }
}
 
export default Fight;