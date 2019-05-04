import React, { Component } from 'react';
import Input from '../Input'
import './style.css'
import firebase from '../../firebase';

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            level: 0,
            exp: 2000,
            prof: 0,
            health: 10
         }

        this.updateState = this.updateState.bind(this)
    }

    updateState(value, field) {
        this.setState({
            [field]: value
        })
    }

    saveCharacter() {
        const split = firebase.auth().currentUser.email.split('@')

        firebase.database().ref('/users/' + split[0] + '/characters').push({...this.state})
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


    render() { 
        return ( 
            <div>
                <h1 className="header">{this.props.title}</h1>
                <div className="page-content">
                    
                    <h2 className="sub-header" style={{paddingTop: "0"}} >Details</h2>
                    <Input label="Name" val={this.state.name} field="name" onUpdate={this.updateState} />
                    <Input label="Race" val={this.state.race} field="race" onUpdate={this.updateState} />
                    <Input label="Class" val={this.state.class} field="class" onUpdate={this.updateState} />
                    <div className="styled-input">
                        <select onChange={this.state.alignment} >
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
                    </div>
                    <div className="multi-input">
                        <Input label="Hit Dice" val={this.state.hitDice} field="hitDice" onUpdate={this.updateState} />
                        <Input add={true} label="Number" val={this.state.hitDiceNum} field="hitDiceNum" onUpdate={this.updateState} />
                    </div>

                    <h2 className="sub-header">Stats</h2>
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
                   
                    <h2 className="sub-header">Charisma Skills</h2>
                    <Input add={true} label="Save" val={this.state.charSave} field="charismaSave" onUpdate={this.updateState} />
                    <div className="multi-input">
                        <Input add={true} label="Deception" val={this.state.deception} field="deception" onUpdate={this.updateState} />
                        <Input add={true} label="Intimidation" val={this.state.intim} field="intim" onUpdate={this.updateState} />
                    </div>
                    <div className="multi-input">
                        <Input add={true} label="Performance" val={this.state.perform} field="perform" onUpdate={this.updateState} />
                        <Input add={true} label="Persuasion" val={this.state.persuasion} field="persuasion" onUpdate={this.updateState} />
                    </div>

                    <h2 className="sub-header">Constitution Save</h2>
                    <Input add={true} label="" val={this.state.conSave} field="constitutionSave" onUpdate={this.updateState} />
                    
                    <h2 className="sub-header">Dexterity Skills</h2>
                    <Input add={true} label="Save" val={this.state.dexSave} field="dexSave" onUpdate={this.updateState} />
                    <div className="multi-input">
                        <Input add={true} label="Acrobatics" val={this.state.acrobatics} field="acrobatics" onUpdate={this.updateState} />
                        <Input add={true} label="Slight of Hand" val={this.state.soh} field="soh" onUpdate={this.updateState} />
                        <Input add={true} label="Stealth" val={this.state.stealth} field="stealth" onUpdate={this.updateState} />
                    </div>

                    <h2 className="sub-header">Intelligence Skills</h2>
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

                    <h2 className="sub-header">Strength Skills</h2>
                    <Input add={true} label="Save" val={this.state.strSave} field="strSave" onUpdate={this.updateState} />
                    <Input add={true} label="Athletics" val={this.state.athletics} field="athletics" onUpdate={this.updateState} />

                    <h2 className="sub-header">Wisdom Skills</h2>
                    <Input add={true} label="Save" val={this.state.wisSave} field="wisSave" onUpdate={this.updateState} />
                    <div className="multi-input">
                        <Input add={true} label="Animal Handling" val={this.state.aniHand} field="aniHand" onUpdate={this.updateState} />
                        <Input add={true} label="Insight" val={this.state.insight} field="insight" onUpdate={this.updateState} />
                    </div>
                    <div className="multi-input">
                        <Input add={true} label="Medicine" val={this.state.med} field="med" onUpdate={this.updateState} />
                        <Input add={true} label="Perception" val={this.state.perception} field="history" onUpdate={this.updateState} />
                        <Input add={true} label="Survival" val={this.state.survival} field="survival" onUpdate={this.updateState} />
                    </div>

                    <div className="button-box" >
                        <button className="flat-button" onClick={() => this.saveCharacter()}>Save Character</button>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Edit;