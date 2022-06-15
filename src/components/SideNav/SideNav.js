import React from 'react'
import './SideNav.css'
import { GiCrossedSwords, GiSkills, GiLightBackpack, GiSpellBook} from "react-icons/gi";
import { FaEdit, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';


export default function SideNav({addPannel, pannels}) {

    const navigate = useNavigate()  

    function makeStyles(which) {

        const windowWidth = window.innerWidth

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
                <button onClick={() => addPannel('fight')} style={makeStyles('fight')} ><GiCrossedSwords></GiCrossedSwords></button>
                <button onClick={() => addPannel('pack')} style={makeStyles('pack')}><GiLightBackpack></GiLightBackpack></button>
                <button onClick={() => addPannel('skills')} style={makeStyles('skills')}><GiSkills></GiSkills></button>
                <button onClick={() => addPannel('spells')} style={makeStyles('spells')}><GiSpellBook></GiSpellBook></button>
                <button onClick={() => addPannel('edit')} style={makeStyles('edit')}><FaEdit></FaEdit></button>
            </div>
            <div>
                <button id="sign-out-button" onClick={() => navigate('/characters')} > <FaSignOutAlt></FaSignOutAlt></button>
            </div>
        </div>
    )
}