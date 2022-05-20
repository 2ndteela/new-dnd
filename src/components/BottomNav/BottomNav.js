import React from 'react';
import {Link} from 'react-router-dom'
import { getFromLocalStorage } from '../../assets/utilities.js';
import './BottomNav.css'

export default function BottomNav() {
    const route = window.location.pathname
    const character = getFromLocalStorage('tempCharacter')
    const links = [
        {
            name: 'Spells',
            link: '/spells'
        },
        {
            name: 'Fight',
            link: '/fight'
        },
        {
            name: 'Skills',
            link: '/skills'
        },
        {
            name: 'Pack',
            link: '/pack'
        },
        {
            name: 'Edit',
            link: '/edit'
        }
    ]

    function makeRoutes() {
        let newLinks = [...links]
        if(!character?.spells) 
            newLinks = newLinks.splice(1)

        return (
            newLinks.map(l => {
                return <Link to={l.link} className={route === l.link ? 'match' : ''} key={l.name} >{l.name}</Link>
            })
        )
    }

    return (
        <div className="bottom-nav">
            <div className="nav-container">
                {makeRoutes()}
            </div>
        </div>
    )
}
