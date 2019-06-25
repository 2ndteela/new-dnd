import React, { Component } from 'react';
import {readInCharacter} from '../services'
import Slot from '../../comp/Slot'
import Input from '../../comp/Input'
import BottomNav from '../../comp/BottomNav'
import firebase from '../../firebase'
import Header from '../../comp/Header'
import {NavLink} from 'react-router-dom'

import './style.css'

class Fight extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            weapons: [],
            customAttacks: [],
            spellSlots: [],
            customFields: []
         }

        this.updateState = this.updateState.bind(this)
        this.updateArrayValue = this.updateArrayValue.bind(this)
    }

    componentDidMount() {
        this.setState(readInCharacter())
    }

    componentWillUnmount(){
        const split = firebase.auth().currentUser.email.split('@')
        const temp = {...this.state}
        temp.savedChar = false

        firebase.database().ref('/users/' + split[0] + '/characters/' + this.state.key).set(temp)
        .then(() => {
            localStorage['tempCharacter'] = JSON.stringify(this.state)
        })
    }

    updateState(val, field) {
        this.setState({
            [field]: val
        }, () => {localStorage['tempCharacter'] = JSON.stringify(this.state)})
    }

    updateArrayValue(val, field, itr, arr) {
        if(!itr) itr = 0

        let temp = [...this.state[arr]]
        temp[itr][field] = val

        this.setState({[arr]: temp})

        localStorage['tempCharacter'] = JSON.stringify(this.state)
    }

    longRest() {
        const slots =  [...this.state.spellSlots]
        slots.forEach(s => {
            s.usedSlots = 0
        })

        const customs = [...this.state.customFields]
        customs.forEach(c => {
            if(!!c.maxValue) c.value = 0
        })

        const dice = parseInt(this.state.hitDiceNum, 10)
        const lvl = parseInt(this.state.level, 10) 
        let moreDice = lvl

        if(dice < lvl) {
            const diff = lvl - dice
            moreDice = Math.ceil(diff / 2) + dice
        }

        this.setState({
            currentHealth:  parseInt(this.state.health, 10),
            spellSlots: slots,
            customFields: customs,
            hitDiceNum: moreDice
        }, () => {localStorage['tempCharacter'] = JSON.stringify(this.state)})
    }

    render() { 
        return ( 
            <div>
                <Header label="Fight">
                    <NavLink to='/characters' >Characters</NavLink>
                    <NavLink to='/' >Logout</NavLink>
                </Header>
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
                    <h2 className={this.state.weapons.length > 0 ? 'sub-header' : ''} style={{color: 'grey'}} >{this.state.weapons.length > 0 ? 'Weapons' : ''}</h2>
                    <div id="all-weapons">
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
                    </div>
                    <h2 className={this.state.customAttacks.length > 0 ? 'sub-header' : ''} style={{color: 'grey'}}>{this.state.customAttacks.length > 0 ? 'Custom Attacks' : ''}</h2>
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

                    <h2 className={this.state.spellSlots.length > 0 ? 'sub-header' : ''} style={{color: 'grey'}}>{this.state.spellSlots.length > 0 ? 'Spell Slots' : ''}</h2>
                    {this.state.spellSlots.map((ss, i) =>{ 
                        return (
                            <div style={{width: '100%', paddingBottom: '16px'}}>
                                <Slot max={ss.maxSlots} val={ss.usedSlots} label={"Level " + (parseInt(i, 10) + 1)} idx={i} field="usedSlots" arr="spellSlots" onUpdate={this.updateArrayValue} />
                            </div>
                        )
                    })}

                    <h2 className="sub-header" style={{color: 'grey'}}>{this.state.customFields.length > 0 ? 'Custom Slots' : ''}</h2>
                    {this.state.customFields.map((cs, i) => {
                        if(cs.type === 'slot')
                        return ( 
                            <div style={{width: '100%', paddingBottom: '16px'}} >
                                <Slot max={cs.maxValue} label={cs.label} val={cs.value} onUpdate={this.updateArrayValue} idx={i} field="value" arr="customFields"></Slot>
                            </div>
                        )
                        if(cs.type === 'small')
                        return(
                            <div style={{width: '100%', paddingBottom: '16px'}} >
                                <Input label={cs.label} val={cs.value} onUpdate={this.updateArrayValue} idx={i} field="value" arr="customFields"></Input>
                            </div>
                        )
                        if(cs.type === 'big')
                        return(
                            <div style={{width: '100%', paddingBottom: '16px'}} >
                                <Input textarea={true} label={cs.label} val={cs.value} onUpdate={this.updateArrayValue} idx={i} field="value" arr="customFields"></Input>
                            </div>
                        )

                        return(
                            <div style={{width: '100%', paddingBottom: '16px'}}>
                                <Input add={true} label={cs.label} val={cs.value} onUpdate={this.updateArrayValue} idx={i} field="value" arr="customFields"></Input>
                            </div>
                        )
                    })}
                    <button className="full-button" onClick={() => this.longRest()} >Long Rest</button>
                    <br></br>
                </div>
                <BottomNav></BottomNav>
            </div>
         );
    }
}
 
export default Fight;