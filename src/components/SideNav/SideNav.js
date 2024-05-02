import React, {useCallback, useState, useMemo} from 'react'
import './SideNav.css'
import { GiCrossedSwords, GiSkills, GiLightBackpack, GiSpellBook, GiBookmarklet, GiDiceTwentyFacesTwenty} from "react-icons/gi";
import { MdClear } from "react-icons/md";
import { FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';


const diceValues = ['d4', 'd6', 'd8', 'd10', 'd12', 'd16', 'd20', 'd100']

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
                {windowWidth < 1099 && <button><GiDiceTwentyFacesTwenty /></button>}
                {windowWidth < 1099 && <button id="sign-out-button" onClick={() => navigate('/characters')} > <FaSignOutAlt></FaSignOutAlt></button>}
            </div>
            <div>
                {windowWidth > 1099 && <button><GiDiceTwentyFacesTwenty onClick={() => setShowRoller(true)}  /></button>}
                {windowWidth > 1099 && <button id="sign-out-button" onClick={() => navigate('/characters')} > <FaSignOutAlt></FaSignOutAlt></button>}
            </div>
            <div id="roller-calc-container" className={showRoller ? 'show-dialog' : ''} >
                <div id="roller-calc-body" className={showRoller ? 'show-dialog' : ''}>
                    <div id="roller-calc-readout">
                        <h1 style={{paddingBottom: '12px', fontSize: '4em'}} >{result}</h1>
                        <div>{rollString}</div>
                    </div>
                    <div id="roller-calc-dice-keypad">{diceValues.map(d => <button onClick={() => addRoll(d)} >{d}</button>)}</div>
                    <div id="roller-calc-value-keypad"> 
                        <button onClick={() => setAddToRoll(addToRoll - 1)} >-1</button>
                        <button onClick={() => setAddToRoll(addToRoll - 5)}>-5</button>
                        <button onClick={() => setAddToRoll(addToRoll + 1)}>+1</button>
                        <button onClick={() => setAddToRoll(addToRoll + 5)} >+5</button>
                        <button style={{width: '132px'}} onClick={flipCoin} >Coin Flip</button>
                        <button onClick={clearRoller}>Clear</button>
                        <button onClick={rollResult} >Roll</button>
                    </div>
                    <button id="close-roller" onClick={() => setShowRoller(false)} > <MdClear /></button>
                </div>
            </div>
        </div>
    )
}