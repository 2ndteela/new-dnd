import React from 'react'
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi'
import { FaSignOutAlt } from 'react-icons/fa'
import IconButton from '../IconButton/IconButton'
import { PANEL_BUTTONS, useSignOut } from '../../assets/characterNav'
import { useDiceRoller } from '../DiceRollerDialog/DiceRollerProvider'
import './BottomNav.css'

// Mobile character sheet nav along the bottom of the screen. One panel shows at a time.
export default function BottomNav({ addPanel, panels }) {
  const signOut = useSignOut()
  const { openDiceRoller } = useDiceRoller()

  return (
    <nav className='bottom-nav' aria-label='Character sheet'>
      {PANEL_BUTTONS.map(({ name, label, Icon }) => (
        <IconButton
          key={name}
          label={label}
          className={`bottom-nav-button${panels[0] === name ? ' selected' : ''}`}
          aria-current={panels[0] === name ? 'page' : undefined}
          onClick={() => addPanel(name)}
        >
          <Icon />
        </IconButton>
      ))}
      <IconButton label='Dice roller' className='bottom-nav-button' onClick={openDiceRoller}><GiDiceTwentyFacesTwenty /></IconButton>
      <IconButton label='Sign out' className='bottom-nav-button' onClick={signOut}><FaSignOutAlt /></IconButton>
    </nav>
  )
}
