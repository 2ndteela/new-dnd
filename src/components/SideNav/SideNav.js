import React from 'react'
import IconButton from '../IconButton/IconButton'
import { PANEL_BUTTONS, useSignOut } from '../../assets/characterNav'
import { useDiceRoller } from '../DiceRollerDialog/DiceRollerProvider'
import './SideNav.css'
import { GiDiceTwentyFacesTwenty } from "react-icons/gi";
import { FaSignOutAlt } from 'react-icons/fa'

// Desktop character sheet nav: panels at the top, dice roller and sign out at the bottom
export default function SideNav({ addPanel, panels }) {
    const signOut = useSignOut()
    const { openDiceRoller } = useDiceRoller()

    // First panel is the brand blue, the second panel the lighter blue
    function selectedClass(which) {
        if(panels[0] === which) return ' selected'
        if(panels[1] === which) return ' selected-second'
        return ''
    }

    return (
        <div id='side-nav-container'>
            <div id="side-nav-buttons" >
                {PANEL_BUTTONS.map(({ name, label, Icon }) => (
                    <IconButton key={name} label={label} className={`side-nav-button${selectedClass(name)}`} onClick={() => addPanel(name)}><Icon /></IconButton>
                ))}
            </div>
            <div>
                <IconButton label="Dice roller" className="side-nav-button" onClick={openDiceRoller}><GiDiceTwentyFacesTwenty /></IconButton>
                <IconButton label="Sign out" className="side-nav-button" onClick={signOut}><FaSignOutAlt /></IconButton>
            </div>
        </div>
    )
}
