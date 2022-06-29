import React from 'react'
import './SideNav.css'
import { GiCrossedSwords, GiSkills, GiLightBackpack, GiSpellBook} from "react-icons/gi";
import { FaEdit, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { loadCharacter } from '../../assets/utilities';


export default function SideNav({addPannel, pannels}) {

    const windowWidth = window.innerWidth
    const character = loadCharacter()

    let buttons = [
        {name: 'fight', icon: <GiCrossedSwords />},
        {name: 'pack', icon: <GiLightBackpack />}, 
        {name: 'skills', icon: <GiSkills />}, 
        {name: 'spells', icon: <GiSpellBook />}, 
        {name: 'edit', icon: <FaEdit />}
    ]

    if(!character?.spells) {
        buttons = [
            {name: 'fight', icon: <GiCrossedSwords />},
            {name: 'pack', icon: <GiLightBackpack />}, 
            {name: 'skills', icon: <GiSkills />}, 
            {name: 'edit', icon: <FaEdit />}
        ]
    }

    const navigate = useNavigate()  

    function makeStyles(which) {

        if(pannels[0] === which) 
            return {
                backgroundColor: "#0A2239",
                color: 'white',
                borderColor: "#0A2239"
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
                {buttons.map(b => <button onClick={() => addPannel(b.name)} style={makeStyles(b.name)}>{b.icon}</button> )}
                { windowWidth < 1099 && <button id="sign-out-button" onClick={() => navigate('/characters')} > <FaSignOutAlt></FaSignOutAlt></button>}
            </div>
            { windowWidth > 1099 && <button id="sign-out-button" onClick={() => navigate('/characters')} > <FaSignOutAlt></FaSignOutAlt></button>}
        </div>
    )
}