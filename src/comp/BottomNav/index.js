import React, { Component } from 'react';
import {NavLink} from 'react-router-dom'
import {readInCharacter} from '../../pages/services.js'

import './style.css'

class BottomNav extends Component {
    constructor(props) {
        super(props)

        this.state = {
            inSpells: false,
            inFight: false,
            inSkills: false,
            inPack: false,
            inEdit: false
        }
    }

    componentDidMount() {
        this.matchRoute()

    }

    matchRoute() {
        const route = window.location.pathname
        
        if(route === '/fight') this.setState({inFight: true})
        else if (route === '/skills') this.setState({inSkills: true})
        else if (route === '/spells') this.setState({inSpells: true})
        else if (route === '/pack') this.setState({inPack: true})
        else this.setState({inEdit: true})
    }

    checkSpells() {
        const char = readInCharacter()

        if(char.spells) return <NavLink to="/spells" className={this.state.inSpells === true ? 'match' : ''} >Spells</NavLink>
        return null
    }

    render() { 
    return (
        <div className="bottom-nav">
            <div className="nav-container">
                {this.checkSpells()}
                <NavLink to="/fight" className={this.state.inFight === true ? 'match' : ''}>Fight</NavLink>
                <NavLink to='/skills' className={this.state.inSkills === true ? 'match' : ''} >Skills</NavLink>
                <NavLink to='/pack' className={this.state.inPack === true ? 'match' : ''} >Pack</NavLink>
                <NavLink to='/edit' className={this.state.inEdit === true ? 'match' : ''}>Edit</NavLink>
            </div>
        </div>
    )
    }
}

export default BottomNav