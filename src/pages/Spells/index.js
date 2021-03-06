import React, { Component } from 'react';
import BottomNav from '../../comp/BottomNav';
import {readInCharacter} from '../services'
import Input from '../../comp/Input'
import Header from '../../comp/Header'
import {NavLink} from 'react-router-dom'

import './style.css'

class Spells extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            spells: [],
            filteredSpells: [],
            filterTerm: 'lowest',
            searchTerm: ''
        }

        this.updateState = this.updateState.bind(this)
    }

    componentDidMount() {
        this.setState(readInCharacter(), () => this.filterSpells())
    }

    updateState(val, field) {
        this.setState({
            [field]: val
        }, () => { this.filterSpells() })
    }

    filterSpells() {
        let arr = []
        let temp =[...this.state.spells]
        temp.forEach(s => {
            if(s.name.toUpperCase().includes(this.state.searchTerm.toUpperCase()) || s.description.toUpperCase().includes(this.state.searchTerm.toUpperCase())) arr.push(s)
        })

        if(this.state.filterTerm === 'lowest') arr.sort((a, b) => {
            if(a.level === 'Cantrip' && b.level !== 'Cantrip') return -1
            if(b.level === 'Cantrip' && a.level !== 'Cantrip') return 1 
            if(a.level === b.level) return a.name - b.name
            return a.level - b.level
        })
        else if (this.state.filterTerm === 'highest') arr.sort((a, b) => {
            if(a.level === 'Cantrip' && b.level !== 'Cantrip') return 1
            if(b.level === 'Cantrip' && a.level !== 'Cantrip') return -1 
            if(a.level === b.level) return a.name - b.name
            return b.level - a.level
            
        })
        
        else arr.sort((a, b) => (a.name - b.name))


        this.setState({
            filteredSpells: arr
        })
    }

    render() { 
        return ( 
            <div>
                <Header label="Spells">
                    <NavLink to='/characters' >Characters</NavLink>
                    <NavLink to='/' >Logout</NavLink>
                </Header>
                <div className="page-content with-bottom-nav">
                <div className="styled-input">
                    <select value={this.state.filterTerm} onChange={(e) => this.updateState(e.target.value, 'filterTerm')} >
                        <option value="lowest" >Lowest Level</option>
                        <option value="highest" >Highest Level</option>
                        <option value="alpha" >Alphabetical</option>
                    </select>
                    <span>Filter</span>
                </div>
                <Input label="Search" val={this.state.searchTerm} field='searchTerm' onUpdate={this.updateState} ></Input>
                    { this.state.filteredSpells.map((s, i) => {
                        return (
                            <div className="spell-box" key={'spel-' + i}>
                                <div className="spell-header">
                                    <h3>{s.name}</h3>
                                    <span>{s.level === 'Cantrip' || s.level === 'cantrip' ? 'Cantrip' : 'Level ' + s.level}</span>
                                </div>
                                <div style={{paddingBottom: '8px', color: '#0A2239'}}>
                                    {s.con === true ? 'Concentration' : ''}
                                </div>
                                <div style={{paddingBottom: '8px'}}>
                                    {s.description}
                                </div>
                                <div className="spell-stats">
                                    <div className="spell-stat-container">
                                        <div>{s.range}</div>
                                        <span>Range</span>
                                    </div>
                                    <div className="spell-stat-container">
                                        <div>{s.damage}</div>
                                        <span>Damage</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <BottomNav></BottomNav>
            </div>
         );
    }
}
 
export default Spells;