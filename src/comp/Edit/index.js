import React, { Component } from 'react';
import Input from '../Input'
import './style.css'
import firebase from '../../firebase';
import ExpansionPannel from '../ExpansionPannel';
import {CloseOutlined} from '@material-ui/icons'
import CheckBox from '../CheckBox';
import {readInCharacter} from '../../pages/services'
import Header from '../../comp/Header'
import {NavLink} from 'react-router-dom'

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            level: 0,
            exp: 2000,
            prof: 0,
            health: 10,
            ac: 0,
            speed: 0,
            weapons: [],
            hitDiceNum: 0,
            abilities: [],
            spells: [],
            spellSlots: [],
            customAttacks: [],
            customFields: [],
            charisma: 10,
            const: 10,
            dex: 10,
            intelligence: 10,
            strength: 10,
            wisdom: 10,
            gold: 0,
            silver: 0,
            copper: 0
         }

        this.updateState = this.updateState.bind(this)
        this.updateArrayValue = this.updateArrayValue.bind(this)
    }

    updateState(value, field) {
        this.setState({
            [field]: value
        })
    }

    addAbility() {
        const list = [...this.state.abilities]
        list.push({})
        this.setState({
            abilities: list
        })
    }

    saveCharacter() {
        const split = firebase.auth().currentUser.email.split('@')

        if(this.state.savedChar) {
            const temp = {...this.state}
            temp.savedChar = false

            firebase.database().ref('/users/' + split[0] + '/characters/' + this.state.key).set(temp)
            .then(() => {
                localStorage['tempCharacter'] = JSON.stringify(this.state)
                alert('Character saved')
            })
        }

        else {
            firebase.database().ref('/users/' + split[0] + '/characters').push({...this.state})
            .then(() => {
                this.history.push('/')
            })
        }

    }
    addWeapon() {
        const arr = [...this.state.weapons]
        arr.push({
            name: '',
            damType: '',
            damage: '',
            range: '',
            atkBns: ''
        })

        this.setState({
            weapons: arr
        })
    }

    addSpell() {
        let arr = [...this.state.spells]
        arr.push({
            name: '',
            con: false,
            range: '',
            damage: '',
            level: '',
        })

        this.setState({
            spells: arr
        })
    }

    addSpellSlot() {
        let arr = [...this.state.spellSlots]

        arr.push({
            maxSlots: 0,
            usedSlots: 0
        })
        this.setState({spellSlots: arr})
    }

    addCustomAttack() {
        const arr = [...this.state.customAttacks]
        arr.push({
            name: '',
            description: '',
            damage: '',
            damType: '',
            range: ''
        })

        this.setState({customAttacks: arr})
    }

    addCustom() {
        let arr = [...this.state.customFields]
        arr.push({
            type: 'small',
            label: '',
            maxValue: '',
            value:'',
        })

        this.setState({customFields: arr})
    }

    updateArrayValue(val, field, itr, arr) {
        if(!itr) itr = 0

        let temp = [...this.state[arr]]
        temp[itr][field] = val

        this.setState({[arr]: temp})
    }

    removeArrayValue(arr, itr) {
        let temp = [...this.state[arr]]
        let newArr = []

        temp.forEach((ss, i) => {
            if(i !== itr) newArr.push(ss)
        })
        
        this.setState({[arr]: newArr})
    }

    makeCustom(cf, idx) {
        if (cf.type === 'slot') {
            return (
                <div style={{width: "100%"}} >
                    <Input label="Max Value" val={cf.maxValue} field="maxValue" arr="customFields" idx={idx} onUpdate={this.updateArrayValue} />
                </div>
            )
        }
        return null
    }

    fillSkills() {

        const charVal = Math.floor((this.state.charisma - 10) / 2)
        const strVal = Math.floor((this.state.strength - 10) / 2)
        const constVal = Math.floor((this.state.const - 10) /2)
        const dexVal = Math.floor((this.state.dex - 10) / 2)
        const intVal = Math.floor((this.state.intelligence - 10) /2) 
        const wisVal = Math.floor((this.state.wisdom - 10) / 2 )

        this.setState({
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
        })
    }

    componentDidMount() {
        try {
            const state = readInCharacter()
            this.setState(state)
            this.setState({
                savedChar: true
            })
        }
        catch(err) {
            this.fillSkills()
        }
    }


    render() { 
        return ( 
            <div>
                <Header label={this.props.title}>
                    <NavLink to='/characters' >Charaters</NavLink>
                    <NavLink to='/' >Logout</NavLink>
                </Header>
                <div className={this.state.savedChar !== null ? 'page-content with-nav' : 'page-content not-full' }>
                    <ExpansionPannel header="Details" model={this.state.pannelOne} size="massive" field="pannelOne" flip={this.updateState} >
                        <Input label="Name" val={this.state.name} field="name" onUpdate={this.updateState} />
                        <Input label="Race" val={this.state.race} field="race" onUpdate={this.updateState} />
                        <Input label="Class" val={this.state.class} field="class" onUpdate={this.updateState} />
                        <div className="styled-input">
                            <select onChange={ (e) => this.updateState(e.target.value, 'alignment')} value={this.state.alignment} >
                                <option value="Lawful Good" >Lawful Good</option>
                                <option value="Neutral Good" >Neutral Good</option>
                                <option value="Chaotic Good" >Chaotic Good</option>
                                <option value="Lawful Neutral" >Lawful Neutral</option>
                                <option value="True Neutral" >True Neutral</option>
                                <option value="Chaotic Neutral" >Chaotic Neutral</option>
                                <option value="Lawful Evil" >Lawful Evil</option>
                                <option value="Neutral Evil" >Neutral Evil</option>
                                <option value="Chaotic Evil" >Chaotic Evil</option>
                            </select>
                            <span>Alignment</span>
                        </div>
                        <Input label="Backstory" val={this.state.backStory} field="backStory" textarea={true} onUpdate={this.updateState} />
                        <div className="multi-input" >
                            <Input add={true} label="Level" val={this.state.level} field="level" onUpdate={this.updateState} ></Input>
                            <Input add={true} label="Experience" val={this.state.exp} field="exp" onUpdate={this.updateState} ></Input>
                        </div>
                        <div className="multi-input">
                            <Input add={true} label="Proficiency" val={this.state.prof} field="prof" onUpdate={this.updateState} />
                            <Input add={true} label="Health" val={this.state.health} field="health" onUpdate={this.updateState} />
                            <Input add={true} label="Speed" val={this.state.speed} field="speed" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <div className="styled-input">
                                <select value={this.state.alignment} onChange={(e) => this.updateState(e.target.value, 'hitDie')}>
                                    <option value="d4" >d4</option>
                                    <option value="d6" >d6</option>
                                    <option value="d8" >d8</option>
                                    <option value="d10" >d10</option>
                                    <option value="d12" >d12</option>
                                    <option value="d16" >d16</option>
                                    <option value="d20" >d20</option>
                                </select>
                                <span>Hit Dice</span>
                            </div>
                            <Input add={true} label="Number" val={this.state.hitDiceNum} field="hitDiceNum" onUpdate={this.updateState} />
                        </div>
                    </ExpansionPannel>

                    <ExpansionPannel header="Stats" model={this.state.pannelTwo} size="epic" field="pannelTwo" flip={this.updateState} >
                        <div className="multi-input">
                            <Input add={true} label="Charisma" val={this.state.charisma} field="charisma" onUpdate={this.updateState} />
                            <Input add={true} label="Constitution" val={this.state.const} field="const" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <Input add={true} label="Dexterity" val={this.state.dex} field="dex" onUpdate={this.updateState} />
                            <Input add={true} label="Intelligence" val={this.state.intelligence} field="intelligence" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <Input add={true} label="Strength" val={this.state.strength} field="strength" onUpdate={this.updateState} />
                            <Input add={true} label="Wisdom" val={this.state.wisdom} field="wisdom" onUpdate={this.updateState} />
                        </div>
                            <Input add={true} label="Armor Class" val={this.state.ac} field="ac" onUpdate={this.updateState} />
                        <div className="button-box" style={{paddingBottom: '8px'}}>
                            <button className="flat-button" onClick={() => this.fillSkills()} >Fill Skills</button>
                        </div>
                    
                        <h3 className="sub-header" style={{color: 'grey'}} >Charisma Skills</h3>
                        <Input add={true} label="Save" val={this.state.charSave} field="charSave" onUpdate={this.updateState} />
                        <div className="multi-input">
                            <Input add={true} label="Deception" val={this.state.deception} field="deception" onUpdate={this.updateState} />
                            <Input add={true} label="Intimidation" val={this.state.intim} field="intim" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <Input add={true} label="Performance" val={this.state.perform} field="perform" onUpdate={this.updateState} />
                            <Input add={true} label="Persuasion" val={this.state.persuasion} field="persuasion" onUpdate={this.updateState} />
                        </div>

                        <h3 style={{color: 'grey'}} className="sub-header">Constitution Save</h3>
                        <Input add={true} label="" val={this.state.conSave} field="conSave" onUpdate={this.updateState} />
                        
                        <h3 className="sub-header" style={{color: 'grey'}} >Dexterity Skills</h3>
                        <Input add={true} label="Save" val={this.state.dexSave} field="dexSave" onUpdate={this.updateState} />
                        <div className="multi-input">
                            <Input add={true} label="Acrobatics" val={this.state.acrobatics} field="acrobatics" onUpdate={this.updateState} />
                            <Input add={true} label="Slight of Hand" val={this.state.soh} field="soh" onUpdate={this.updateState} />
                            <Input add={true} label="Stealth" val={this.state.stealth} field="stealth" onUpdate={this.updateState} />
                        </div>

                        <h3 style={{color: 'grey'}} className="sub-header">Intelligence Skills</h3>
                        <Input add={true} label="Save" val={this.state.intSave} field="intSave" onUpdate={this.updateState} />
                        <div className="multi-input">
                            <Input add={true} label="Arcana" val={this.state.arcana} field="arcana" onUpdate={this.updateState} />
                            <Input add={true} label="History" val={this.state.history} field="history" onUpdate={this.updateState} />
                            <Input add={true} label="Investigation" val={this.state.invest} field="invest" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <Input add={true} label="Nature" val={this.state.nature} field="nature" onUpdate={this.updateState} />
                            <Input add={true} label="Religion" val={this.state.religion} field="religion" onUpdate={this.updateState} />
                        </div>

                        <h3 style={{color: 'grey'}} className="sub-header">Strength Skills</h3>
                        <Input add={true} label="Save" val={this.state.strSave} field="strSave" onUpdate={this.updateState} />
                        <Input add={true} label="Athletics" val={this.state.athletics} field="athletics" onUpdate={this.updateState} />

                        <h3 style={{color: 'grey'}} className="sub-header">Wisdom Skills</h3>
                        <Input add={true} label="Save" val={this.state.wisSave} field="wisSave" onUpdate={this.updateState} />
                        <div className="multi-input">
                            <Input add={true} label="Animal Handling" val={this.state.aniHand} field="aniHand" onUpdate={this.updateState} />
                            <Input add={true} label="Insight" val={this.state.insight} field="insight" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <Input add={true} label="Medicine" val={this.state.med} field="med" onUpdate={this.updateState} />
                            <Input add={true} label="Perception" val={this.state.perception} field="perception" onUpdate={this.updateState} />
                            <Input add={true} label="Survival" val={this.state.survival} field="survival" onUpdate={this.updateState} />
                        </div>
                    </ExpansionPannel>

                    <ExpansionPannel header="Inventory" model={this.state.pannelThree} size="big" field="pannelThree" flip={this.updateState}>
                        <h3 className="sub-header" style={{color: 'grey', paddingTop: '0px'}}>Weapons</h3>
                        {this.state.weapons.map((w, itr) => {
                            return (
                            <div key={"weap-" + itr} style={{width: '100%', alignItems: 'flex-end'}} >
                                <button className="icon-button" onClick={() => this.removeArrayValue('weapons' ,itr)} >
                                    <CloseOutlined color="black" />
                                </button>
                                <div className="multi-input">
                                    <Input label="Weapon Name" val={w.name} field="name" arr="weapons" idx={itr} onUpdate={this.updateArrayValue}/>
                                    <Input label="Damage Type" val={w.damType} field="damType" arr="weapons" idx={itr} onUpdate={this.updateArrayValue} />
                                </div>

                                <div className="multi-input">
                                    <Input label="Range" val={w.range} field="range" idx={itr} arr="weapons" onUpdate={this.updateArrayValue} />
                                    <Input label="Attack Bonus" val={w.atkBns} field="atkBns" arr="weapons" idx={itr} onUpdate={this.updateArrayValue} />
                                    <Input label="Damage" val={w.damage} field="damage" arr="weapons" idx={itr} onUpdate={this.updateArrayValue} />
                                </div>
                            </div>
                            )
                        })}
                        <button className="full-button" onClick={() => this.addWeapon()} >Add Weapon</button>
                        <h3 className="sub-header" style={{color: 'grey'}}>Pack</h3>
                        <div className="multi-input">
                            <Input add={true} label="Gold" val={this.state.gold} field="gold" onUpdate={this.updateState} />
                            <Input add={true} label="Silver" val={this.state.silver} field="silver" onUpdate={this.updateState} />
                            <Input add={true} label="Copper" val={this.state.copper} field="copper" onUpdate={this.updateState} />
                        </div>
                        <Input textarea={true} label="Pack" val={this.state.pack} field="pack" onUpdate={this.updateState} />
                    </ExpansionPannel>
                    <ExpansionPannel header="Abilities" size="big" model={this.state.pannelFour} field="pannelFour" flip={this.updateState} >
                        {this.state.abilities.map((a, itr) => {
                            return (
                                <div style={{width: '100%', alignItems: 'flex-end'}} >
                                    <button className="icon-button" onClick={() => this.removeArrayValue('abilities', itr)} >
                                        <CloseOutlined />
                                    </button>
                                    <Input label="Header" val={a.header} field="header" idx={itr} arr="abilities" onUpdate={this.updateArrayValue} />
                                    <Input textarea={true} label="Description" val={a.description} arr="abilities" idx={itr} field="description" onUpdate={this.updateArrayValue} />
                                </div>
                            )
                        })}
                        <button className="full-button" onClick={() => this.addAbility()} >Add Ability</button>
                    </ExpansionPannel>

                    <ExpansionPannel header="Spells" size="big" model={this.state.pannelFive} field="pannelFive" flip={this.updateState} >
                        {this.state.spells.map((s, itr) => {
                            return(
                                <div key={"spl-" + itr} style={{width: '100%', alignItems: 'flex-end'}}>
                                    <button className="icon-button" onClick={() => this.removeArrayValue('spells' ,itr)} >
                                        <CloseOutlined />
                                    </button>
                                    <Input label="Name" val={s.name} field="name" idx={itr} arr="spells" onUpdate={this.updateArrayValue}/>
                                    <div className="multi-input">
                                        <Input label="Range" val={s.range} field="range" idx={itr} arr="spells" onUpdate={this.updateArrayValue} />
                                        <Input label="Damage" val={s.damage} field="damage" idx={itr} arr="spells" onUpdate={this.updateArrayValue} />
                                        <Input label="Level" val={s.level} field="level" idx={itr} arr="spells" onUpdate={this.updateArrayValue} />
                                    </div>
                                    <Input label="Description" textarea={true} val={s.description} arr="spells" field="description" idx={itr} onUpdate={this.updateArrayValue} />
                                    <CheckBox label='Concentration' model={s.con} idx={itr} arr="spells" field="con" onUpdate={this.updateArrayValue} ></CheckBox>
                                </div>
                            )
                        })}
                        <br></br>
                        {this.state.spellSlots.map((ss, itr) => {
                            if(itr === 0) return(
                                <div className="spell-slot-div" key={"slot-" + itr}>
                                    <Input add={true} label="Cantrips" idx={itr} arr="spellSlots" field="maxSlots" val={ss.maxSlots} onUpdate={this.updateArrayValue} />
                                    <button className="icon-button" onClick={() => this.removeArrayValue('spellSlots', itr)} >
                                        <CloseOutlined />
                                    </button>
                                </div>
                            )
                            return(                              
                                <div className="spell-slot-div" key={"slot-" + itr} >
                                    <Input add={true} label={"Level " + itr} idx={itr} arr="spellSlots" field="maxSlots" val={ss.maxSlots} onUpdate={this.updateArrayValue} />
                                    <button className="icon-button" onClick={() => this.removeArrayValue('spellSlots', itr)} >
                                        <CloseOutlined />
                                    </button>
                                </div>
                            )
                        })}
                        <div className="button-box">
                            <button onClick={() => this.addSpell()} >Add Spell</button>
                            <button onClick={() => this.addSpellSlot()} className="flat-button">Add Slot</button>
                        </div>
                    </ExpansionPannel>
                    <ExpansionPannel header="Other Attacks" size="big" model={this.state.pannelSix} field="pannelSix" flip={this.updateState} >
                        {this.state.customAttacks.map((ca, i) => {
                           return( 
                           <div style={{width: '100%', alignItems: 'flex-end'}} key={"ca-" + i} >
                                <button className="icon-button" onClick={() => this.removeArrayValue('customAttacks', i)} >
                                    <CloseOutlined />
                                </button>
                                <Input label="Name" key={'ca-' + i} idx={i} field="name" val={ca.name} arr="customAttacks" onUpdate={this.updateArrayValue}></Input>
                                <div className="multi-input">
                                    <Input label="Range" val={ca.range} field="range" idx={i} arr="customAttacks" onUpdate={this.updateArrayValue} />
                                    <Input label="Damage" val={ca.damage} field="damage" idx={i} arr="customAttacks" onUpdate={this.updateArrayValue} />
                                    <Input label="Damage Type" val={ca.damType} field="damType" idx={i} arr="customAttacks" onUpdate={this.updateArrayValue} />
                                </div>
                                <Input textarea={true} label="Description" val={ca.description} field="description" idx={i} arr="customAttacks" onUpdate={this.updateArrayValue} />
                            </div>
                            )
                        })}
                        <button className="full-button" onClick={() => this.addCustomAttack()}>Add Attack</button>
                    </ExpansionPannel>
                    <ExpansionPannel header="Custom Fields" size="big" model={this.state.pannelSeven} field="pannelSeven" flip={this.updateState} >
                    {this.state.customFields.map((cf, i) => {
                            return (
                                <div style={{width: '100%', alignItems: 'flex-end'}}>
                                    <button className="icon-button" onClick={() => this.removeArrayValue("customFields", i)} >
                                        <CloseOutlined />
                                    </button>
                                    <div className="styled-input">
                                        <select value={cf.type} onChange={(e) => this.updateArrayValue(e.target.value, 'type', i, 'customFields') } >
                                            <option value="small">Text</option>
                                            <option value="big" >Text Area</option>
                                            <option value="number">Number</option>
                                            <option value="slot">Slot</option>
                                        </select>
                                        <span>Input Type</span>
                                    </div>
                                    <Input label="Label" val={cf.label} field="label" arr="customFields" idx={i} onUpdate={this.updateArrayValue} />
                                    {this.makeCustom(cf, i)}
                                </div> 
                            )
                        })}
                        <button className="full-button" onClick={() => this.addCustom()}>Add Custom</button>
                    </ExpansionPannel>
                    <div className={ this.state.savedChar === null ? "button-box to-bottom" : "button-box to-bottom-nav"} >
                        <button className="flat-button" onClick={() => this.saveCharacter()}>Save Character</button>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Edit;