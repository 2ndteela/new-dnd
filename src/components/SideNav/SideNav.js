import React, {useCallback, useState, useMemo} from 'react'
import Button from '../Button/Button'
import IconButton from '../IconButton/IconButton'
import { isDesktopWidth } from '../../assets/breakpoints'
import { signOutUser } from '../../assets/services'
import './SideNav.css'
import { GiCrossedSwords, GiSkills, GiLightBackpack, GiSpellBook, GiBookmarklet, GiDiceTwentyFacesTwenty} from "react-icons/gi";
import { MdClear } from "react-icons/md";
import { FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';


const diceValues = ['d4', 'd6', 'd8', 'd10', 'd12', 'd16', 'd20', 'd100']

export default function SideNav({addPannel, pannels}) {
    const isDesktop = isDesktopWidth()

    let buttons = [
        {name: 'history', icon: <GiBookmarklet />},
        {name: 'fight', icon: <GiCrossedSwords />},
        {name: 'pack', icon: <GiLightBackpack />}, 
        {name: 'skills', icon: <GiSkills />}, 
        {name: 'spells', icon: <GiSpellBook />}, 
    ]

    const navigate = useNavigate()  

    async function signOut() {
        await signOutUser()
        navigate('/', { replace: true })
    }

    const [showRoller, setShowRoller] = useState(false)
    const [rollingDice, setRollingDice] = useState({
        d4: 0,
        d6: 0,
        d8: 0,
        d10: 0,
        d12: 0,
        d16: 0,
        d20: 0,
        d100: 0
    })
    const [addToRoll, setAddToRoll] = useState(0)
    const [result, setResult] = useState(null)

    const rollString = useMemo(() => {
        let string = ''
        diceValues.forEach(d => {
            if(rollingDice[d] > 0) {
                if(string.length > 0) string = `${string} + ${rollingDice[d]}${d}`
                else string = `${string} ${rollingDice[d]}${d}`
            }
        })

        if(addToRoll !== 0) string = `${string} ${addToRoll > 0 ? ` + ${addToRoll}` : ` - ${Math.abs(addToRoll)}`}`
        return string
    }, [rollingDice, addToRoll])

    const addRoll = useCallback((value) => {
        const current = {...rollingDice}
        current[value] += 1
        setRollingDice(current)
    }, [rollingDice])

    const clearRoller = useCallback(() => {
        setRollingDice({        
            d4: 0,
            d6: 0,
            d8: 0,
            d10: 0,
            d12: 0,
            d16: 0,
            d20: 0,
            d100: 0
        })
        setAddToRoll(0)
        setResult(null)
    }, [])

    const rollResult = useCallback(() => {
        let total = 0
        diceValues.forEach(d => {
            const numberOfDice = rollingDice[d]
            const diceValue = parseInt(d.substring(1), 10)
            for(let i = 0; i < numberOfDice; i++) 
                total += Math.ceil(Math.random() * diceValue)
            
        }) 
        if(addToRoll !== 0) total += addToRoll
        setResult(total)
    }, [addToRoll, rollingDice])

    const flipCoin = useCallback(() => {
        clearRoller()
        setResult(Math.round(Math.random()) === 1 ? 'Heads' : 'Tails')
    }, [clearRoller])

    // First panel is primary blue; on desktop the second panel gets the lighter blue
    function selectedClass(which) {
        if(pannels[0] === which) return ' selected'
        if(pannels[1] === which && isDesktop) return ' selected-second'
        return ''
    }

    return (
        <div id='side-nav-container'>
            <div id="side-nav-buttons" >
                {buttons.map(b => <IconButton key={b.name} label={b.name} className={`side-nav-button${selectedClass(b.name)}`} onClick={() => addPannel(b.name)}>{b.icon}</IconButton> )}
                {!isDesktop && <IconButton label="Dice roller" className="side-nav-button" onClick={() => setShowRoller(true)}><GiDiceTwentyFacesTwenty /></IconButton>}
                {!isDesktop && <IconButton label="Sign out" className="side-nav-button" onClick={signOut}><FaSignOutAlt /></IconButton>}
            </div>
            <div>
                {isDesktop && <IconButton label="Dice roller" className="side-nav-button" onClick={() => setShowRoller(true)}><GiDiceTwentyFacesTwenty /></IconButton>}
                {isDesktop && <IconButton label="Sign out" className="side-nav-button" onClick={signOut}><FaSignOutAlt /></IconButton>}
            </div>
            <div id="roller-calc-container" className={showRoller ? 'show-dialog' : ''} >
                <div id="roller-calc-body" className={showRoller ? 'show-dialog' : ''}>
                    <div id="roller-calc-readout">
                        <h1 className="roller-calc-result" >{result}</h1>
                        <div>{rollString}</div>
                    </div>
                    <div id="roller-calc-dice-keypad">{diceValues.map(d => <Button key={d} variant="flat" className="roller-key" onClick={() => addRoll(d)} >{d}</Button>)}</div>
                    <div id="roller-calc-value-keypad"> 
                        <Button variant="flat" className="roller-key" onClick={() => setAddToRoll(addToRoll - 1)} >-1</Button>
                        <Button variant="flat" className="roller-key" onClick={() => setAddToRoll(addToRoll - 5)}>-5</Button>
                        <Button variant="flat" className="roller-key" onClick={() => setAddToRoll(addToRoll + 1)}>+1</Button>
                        <Button variant="flat" className="roller-key" onClick={() => setAddToRoll(addToRoll + 5)} >+5</Button>
                        <Button variant="flat" className="roller-key roller-key-wide" onClick={flipCoin} >Coin Flip</Button>
                        <Button variant="flat" className="roller-key" onClick={clearRoller}>Clear</Button>
                        <Button variant="flat" className="roller-key" onClick={rollResult} >Roll</Button>
                    </div>
                    <IconButton label="Close dice roller" className="roller-close" onClick={() => setShowRoller(false)}><MdClear /></IconButton>
                </div>
            </div>
        </div>
    )
}