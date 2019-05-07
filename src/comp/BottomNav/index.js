import React, { Component } from 'react';
import {NavLink} from 'react-router-dom'

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

    render() { 
    return (

        <div className="bottom-nav">
            <NavLink to="/spells" className={this.state.inSpells === true ? 'match' : ''} >Spells</NavLink>
            <NavLink to="/fight" className={this.state.inFight === true ? 'match' : ''}>Fight</NavLink>
            <NavLink to='/skills' className={this.state.inSkills === true ? 'match' : ''} >Skills</NavLink>
            <NavLink to='/pack' className={this.state.inPack === true ? 'match' : ''} >Pack</NavLink>
            <NavLink to='/edit' className={this.state.inEdit === true ? 'match' : ''}>Edit</NavLink>
        </div>
    )
    }
}

export default BottomNav