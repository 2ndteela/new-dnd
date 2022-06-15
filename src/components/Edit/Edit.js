import React, { Component } from 'react';
import Input from '../Input/Input'
import ExpansionPannel from '../ExpansionPannel/ExpansionPannel';
import { MdClose } from 'react-icons/md'
import CheckBox from '../CheckBox/CheckBox';
import {loadCharacter} from '../../assets/utilities'
import './Edit.css'
import { writeCharacterToDb } from '../../assets/services';
import { writeCharacter } from '../../assets/utilities';

const alignments = [
    'Lawful Good',
    'Neutral Good',
    'Chaotic Good',
    'Lawful Neutral',
    'True Neutral',
    'Chaotic Neutral',
    'Lawful Evil',
    'Neutral Evil',
    'Chaotic Evil',
]

const dice = [4, 6, 8, 10, 12, 16, 20]

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            level: 0,
            exp: 0,
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

    async saveCharacter() {

        const temp = {...this.state}
        try {
            writeCharacter(temp)
            await writeCharacterToDb(temp)
            alert('Character Saved!')
        }
        catch(err) {
            console.error(err)
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
            const state = loadCharacter()
            this.setState(state)

            if(!state.savedChar)
                writeCharacterToDb()
        }
        catch(err) {
            this.fillSkills()
        }
    }


    render() { 
        return ( 
            <div>
                <div id="edit-page-container" >
                    <div>
                    <ExpansionPannel header="Details">
                        <Input label="Name" val={this.state.name} field="name" onUpdate={this.updateState} />
                        <Input label="Race" val={this.state.race} field="race" onUpdate={this.updateState} />
                        <Input label="Class" val={this.state.class} field="class" onUpdate={this.updateState} />
                        <div className="styled-input">
                            <select onChange={ (e) => this.updateState(e.target.value, 'alignment')} value={this.state.alignment} >
                                {alignments.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <span>Alignment</span>
                        </div>
                        <Input label="Backstory" val={this.state.backStory} field="backStory" textarea onUpdate={this.updateState} />
                        <br></br>
                        <div className="multi-input" >
                            <Input add label="Level" val={this.state.level} field="level" onUpdate={this.updateState} ></Input>
                            <Input add label="Experience" val={this.state.exp} field="exp" onUpdate={this.updateState} ></Input>
                        </div>
                        <div className="multi-input">
                            <Input add label="Proficiency" val={this.state.prof} field="prof" onUpdate={this.updateState} />
                            <Input add label="Health" val={this.state.health} field="health" onUpdate={this.updateState} />
                            <Input add label="Speed" val={this.state.speed} field="speed" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <div className="styled-input">
                                <select value={this.state.hitDie} onChange={(e) => this.updateState(e.target.value, 'hitDie')}>
                                    {dice.map(d => <option key={d} value={`d${d}`}>{`d${d}`}</option>)}
                                </select>
                                <span>Hit Dice</span>
                            </div>
                            <Input add label="Number" val={this.state.hitDiceNum} field="hitDiceNum" onUpdate={this.updateState} />
                        </div>
                    </ExpansionPannel>

                    <ExpansionPannel header="Stats">
                        <div className="multi-input">
                            <Input add label="Charisma" val={this.state.charisma} field="charisma" onUpdate={this.updateState} />
                            <Input add label="Constitution" val={this.state.const} field="const" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <Input add label="Dexterity" val={this.state.dex} field="dex" onUpdate={this.updateState} />
                            <Input add label="Intelligence" val={this.state.intelligence} field="intelligence" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <Input add label="Strength" val={this.state.strength} field="strength" onUpdate={this.updateState} />
                            <Input add label="Wisdom" val={this.state.wisdom} field="wisdom" onUpdate={this.updateState} />
                        </div>
                            <Input add label="Armor Class" val={this.state.ac} field="ac" onUpdate={this.updateState} />
                        <div className="button-box" style={{paddingBottom: '8px'}}>
                            <button className="flat-button" onClick={() => this.fillSkills()} >Fill Skills</button>
                        </div>
                        <br></br>
                    
                        <h3 className="sub-header" style={{color: 'grey'}} >Charisma Skills</h3>
                        <Input add label="Save" val={this.state.charSave} field="charSave" onUpdate={this.updateState} />
                        <div className="multi-input">
                            <Input add label="Deception" val={this.state.deception} field="deception" onUpdate={this.updateState} />
                            <Input add label="Intimidation" val={this.state.intim} field="intim" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <Input add label="Performance" val={this.state.perform} field="perform" onUpdate={this.updateState} />
                            <Input add label="Persuasion" val={this.state.persuasion} field="persuasion" onUpdate={this.updateState} />
                        </div>
                        <br></br>

                        <h3 style={{color: 'grey'}} className="sub-header">Constitution Save</h3>
                        <Input add label="Save" val={this.state.conSave} field="conSave" onUpdate={this.updateState} />
                        <br></br>
                        
                        <h3 className="sub-header" style={{color: 'grey'}} >Dexterity Skills</h3>
                        <Input add label="Save" val={this.state.dexSave} field="dexSave" onUpdate={this.updateState} />
                        <div className="multi-input">
                            <Input add label="Acrobatics" val={this.state.acrobatics} field="acrobatics" onUpdate={this.updateState} />
                            <Input add label="Slight of Hand" val={this.state.soh} field="soh" onUpdate={this.updateState} />
                            <Input add label="Stealth" val={this.state.stealth} field="stealth" onUpdate={this.updateState} />
                        </div>
                        <br></br>

                        <h3 style={{color: 'grey'}} className="sub-header">Intelligence Skills</h3>
                        <Input add label="Save" val={this.state.intSave} field="intSave" onUpdate={this.updateState} />
                        <div className="multi-input">
                            <Input add label="Arcana" val={this.state.arcana} field="arcana" onUpdate={this.updateState} />
                            <Input add label="History" val={this.state.history} field="history" onUpdate={this.updateState} />
                            <Input add label="Investigation" val={this.state.invest} field="invest" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <Input add label="Nature" val={this.state.nature} field="nature" onUpdate={this.updateState} />
                            <Input add label="Religion" val={this.state.religion} field="religion" onUpdate={this.updateState} />
                        </div>
                        <br></br>

                        <h3 style={{color: 'grey'}} className="sub-header">Strength Skills</h3>
                        <Input add label="Save" val={this.state.strSave} field="strSave" onUpdate={this.updateState} />
                        <Input add label="Athletics" val={this.state.athletics} field="athletics" onUpdate={this.updateState} />
                        <br></br>

                        <h3 style={{color: 'grey'}} className="sub-header">Wisdom Skills</h3>
                        <Input add label="Save" val={this.state.wisSave} field="wisSave" onUpdate={this.updateState} />
                        <div className="multi-input">
                            <Input add label="Animal Handling" val={this.state.aniHand} field="aniHand" onUpdate={this.updateState} />
                            <Input add label="Insight" val={this.state.insight} field="insight" onUpdate={this.updateState} />
                        </div>
                        <div className="multi-input">
                            <Input add label="Medicine" val={this.state.med} field="med" onUpdate={this.updateState} />
                            <Input add label="Perception" val={this.state.perception} field="perception" onUpdate={this.updateState} />
                            <Input add label="Survival" val={this.state.survival} field="survival" onUpdate={this.updateState} />
                        </div>
                        <br></br>
                    </ExpansionPannel>

                    <ExpansionPannel header="Inventory">
                        <h3 className="sub-header" style={{color: 'grey', paddingTop: '0px'}}>Weapons</h3>
                        {this.state.weapons.map((w, itr) => {
                            return (
                            <div key={"weap-" + itr} style={{width: '100%', alignItems: 'flex-end'}} >
                                <button className="icon-button" onClick={() => this.removeArrayValue('weapons' ,itr)} >
                                    <MdClose color="black" />
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
                        <br></br>
                        <h3 className="sub-header" style={{color: 'grey'}}>Pack</h3>
                        <div className="multi-input">
                            <Input add label="Gold" val={this.state.gold} field="gold" onUpdate={this.updateState} />
                            <Input add label="Silver" val={this.state.silver} field="silver" onUpdate={this.updateState} />
                            <Input add label="Copper" val={this.state.copper} field="copper" onUpdate={this.updateState} />
                        </div>
                        <Input textarea label="Pack" val={this.state.pack} field="pack" onUpdate={this.updateState} />
                    </ExpansionPannel>
                    <ExpansionPannel header="Abilities">
                        {this.state.abilities.map((a, itr) => {
                            return (
                                <div key={`${itr}-abs`} style={{width: '100%', alignItems: 'flex-end'}} >
                                    <button className="icon-button" onClick={() => this.removeArrayValue('abilities', itr)} >
                                        <MdClose />
                                    </button>
                                    <Input label="Header" val={a.header} field="header" idx={itr} arr="abilities" onUpdate={this.updateArrayValue} />
                                    <Input textarea label="Description" val={a.description} arr="abilities" idx={itr} field="description" onUpdate={this.updateArrayValue} />
                                </div>
                            )
                        })}
                        <button className="full-button" onClick={() => this.addAbility()} >Add Ability</button>
                    </ExpansionPannel>

                    <ExpansionPannel header="Spells">
                        {this.state.spells.map((s, itr) => {
                            return(
                                <div key={"spl-" + itr} style={{width: '100%', alignItems: 'flex-end'}}>
                                    <button className="icon-button" onClick={() => this.removeArrayValue('spells' ,itr)} >
                                        <MdClose />
                                    </button>
                                    <Input label="Name" val={s.name} field="name" idx={itr} arr="spells" onUpdate={this.updateArrayValue}/>
                                    <div className="multi-input">
                                        <Input label="Range" val={s.range} field="range" idx={itr} arr="spells" onUpdate={this.updateArrayValue} />
                                        <Input label="Damage" val={s.damage} field="damage" idx={itr} arr="spells" onUpdate={this.updateArrayValue} />
                                        <Input label="Level" val={s.level} field="level" idx={itr} arr="spells" onUpdate={this.updateArrayValue} />
                                    </div>
                                    <Input label="Description" textarea val={s.description} arr="spells" field="description" idx={itr} onUpdate={this.updateArrayValue} />
                                    <CheckBox label='Concentration' model={s.con} idx={itr} arr="spells" field="con" onUpdate={this.updateArrayValue} ></CheckBox>
                                </div>
                            )
                        })}
                        <br></br>
                        {this.state.spellSlots.map((ss, itr) => {
                            return(
                                <div className="spell-slot-div" key={"slot-" + itr}>
                                    <Input add label={itr === 0 ? "Cantrips" : `Level ${itr}`} idx={itr} arr="spellSlots" field="maxSlots" val={ss.maxSlots} onUpdate={this.updateArrayValue} />
                                    <button className="icon-button" onClick={() => this.removeArrayValue('spellSlots', itr)} >
                                        <MdClose  />
                                    </button>
                                </div>
                            )
                        })}
                        <div className="button-box">
                            <button onClick={() => this.addSpell()} >Add Spell</button>
                            <button onClick={() => this.addSpellSlot()} className="flat-button">Add Slot</button>
                        </div>
                    </ExpansionPannel>
                    <ExpansionPannel header="Other Attacks">
                        {this.state.customAttacks.map((ca, i) => {
                            return( 
                                <div style={{width: '100%', alignItems: 'flex-end'}} key={"ca-" + i} >
                                    <button className="icon-button" onClick={() => this.removeArrayValue('customAttacks', i)} >
                                        <MdClose />
                                    </button>
                                    <Input label="Name" key={'ca-' + i} idx={i} field="name" val={ca.name} arr="customAttacks" onUpdate={this.updateArrayValue}></Input>
                                    <div className="multi-input">
                                        <Input label="Range" val={ca.range} field="range" idx={i} arr="customAttacks" onUpdate={this.updateArrayValue} />
                                        <Input label="Damage" val={ca.damage} field="damage" idx={i} arr="customAttacks" onUpdate={this.updateArrayValue} />
                                        <Input label="Damage Type" val={ca.damType} field="damType" idx={i} arr="customAttacks" onUpdate={this.updateArrayValue} />
                                    </div>
                                    <Input textarea label="Description" val={ca.description} field="description" idx={i} arr="customAttacks" onUpdate={this.updateArrayValue} />
                                </div>
                                )
                        })}
                        <button className="full-button" onClick={() => this.addCustomAttack()}>Add Attack</button>
                    </ExpansionPannel>
                    <ExpansionPannel header="Custom Fields">
                    {this.state.customFields.map((cf, i) => {
                            return (
                                <div key={`${i}-custs`} style={{width: '100%', alignItems: 'flex-end'}}>
                                    <button className="icon-button" onClick={() => this.removeArrayValue("customFields", i)} >
                                        <MdClose />
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
                    </div>
                    <div className={ this.state.savedChar === null ? "button-box to-bottom" : "button-box to-bottom-nav"} >
                        <button className="flat-button" onClick={() => this.saveCharacter()}>Save Character</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Edit;