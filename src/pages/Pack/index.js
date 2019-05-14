import React, { Component } from 'react';
import BottomNav from '../../comp/BottomNav'
import {readInCharacter} from '../services'
import Input from '../../comp/Input'
import Header from '../../comp/Header'
import {NavLink} from 'react-router-dom'

import './style.css'

class Pack extends Component {
    constructor(props) {
        super(props);
        this.state = {  }

        this.updateState = this.updateState.bind(this)
    }

    componentDidMount() {
        this.setState(readInCharacter())
    }

    updateState(val, field) {
        this.setState({
            [field]: val
        }, () => {localStorage['tempCharacter'] = JSON.stringify(this.state)})
    }

    render() { 
        return ( 
            <div>
                <Header label="Pack">
                    <NavLink to='/characters' >Characters</NavLink>
                    <NavLink to='/' >Logout</NavLink>
                </Header>
                <div className="page-content with-bottom-nav">
                    <div className="multi-input">
                        <Input add={true} label="Gold" val={this.state.gold} field="gold" onUpdate={this.updateState}></Input>
                        <Input add={true} label="Silver" val={this.state.silver} field="silver" onUpdate={this.updateState}></Input>
                        <Input add={true} label="Copper" val={this.state.copper} field="copper" onUpdate={this.updateState}></Input>
                    </div>
                    <div className="pack-height">
                        <Input label="Pack" textarea={true} field="pack" fillHeight={true} val={this.state.pack} onUpdate={this.updateState} />
                    </div>
                </div>
                <BottomNav></BottomNav>
            </div>
         );
    }
}
 
export default Pack;