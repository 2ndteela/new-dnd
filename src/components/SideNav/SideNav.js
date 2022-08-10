import React from 'react'
import './SideNav.css'
import { GiCrossedSwords, GiSkills, GiLightBackpack, GiSpellBook, GiBookmarklet} from "react-icons/gi";
import {FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';


export default function SideNav({addPannel, pannels}) {

    const windowWidth = window.innerWidth

    let buttons = [
        {name: 'history', icon: <GiBookmarklet />},
        {name: 'fight', icon: <GiCrossedSwords />},
        {name: 'pack', icon: <GiLightBackpack />}, 
        {name: 'skills', icon: <GiSkills />}, 
        {name: 'spells', icon: <GiSpellBook />}, 
    ]

    const navigate = useNavigate()  

    function makeStyles(which) {

        if(pannels[0] === which) 
            return {
                backgroundColor: "#1e3b56",
                color: 'white',
                borderColor: "#1e3b56"
            }
        
        else if(pannels[1] === which && windowWidth > 1099)
            return {
                backgroundColor: "#1d68ad",
                color: 'white',
                borderColor: "#1d68ad",
            }
    }       

    return (
        <div id='side-nav-container'>
            <div style={{width: '100%'}} id="side-nav-buttons" >
                {buttons.map(b => <button key={b.name} onClick={() => addPannel(b.name)} style={makeStyles(b.name)}>{b.icon}</button> )}
                { windowWidth < 1099 && <button id="sign-out-button" onClick={() => navigate('/characters')} > <FaSignOutAlt></FaSignOutAlt></button>}
            </div>
            { windowWidth > 1099 && <button id="sign-out-button" onClick={() => navigate('/characters')} > <FaSignOutAlt></FaSignOutAlt></button>}
        </div>
    )
}