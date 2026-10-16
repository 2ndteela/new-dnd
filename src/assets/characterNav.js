import { GiCrossedSwords, GiSkills, GiLightBackpack, GiSpellBook, GiBookmarklet } from 'react-icons/gi'
import { useNavigate } from 'react-router-dom'
import { signOutUser } from './services'

// Character sheet panels in nav order. Shared by SideNav (desktop) and BottomNav (mobile).
export const PANEL_BUTTONS = [
  { name: 'history', label: 'History', Icon: GiBookmarklet },
  { name: 'fight', label: 'Fight', Icon: GiCrossedSwords },
  { name: 'pack', label: 'Pack', Icon: GiLightBackpack },
  { name: 'skills', label: 'Skills', Icon: GiSkills },
  { name: 'spells', label: 'Spells', Icon: GiSpellBook }
]

export function useSignOut() {
  const navigate = useNavigate()

  return async function signOut() {
    await signOutUser()
    navigate('/', { replace: true })
  }
}
