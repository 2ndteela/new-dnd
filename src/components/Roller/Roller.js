import React, {useEffect, useState} from 'react'

import './Roller.css'

export default function Roller({formula, setFormula}) {

    const [ show, setShow ] = useState(false)
    const [ total, setTotal ] = useState(0)
    const [ finalTotalSet, setFinalTotalSet ] = useState()
    const [ rolls, setRolls ] = useState([])

    useEffect(() => {
        if(formula) {
            setShow(true)
            setFinalTotalSet(false)
            const split = formula.split('+')
            const diceSplice = split[0].split('d')
            const newRolls = []
            let newTotal = 0
    
            let reps = 1
            if(diceSplice[0] !== '')
                reps = parseInt(diceSplice[0], 10)
                
            const diceValue = parseInt(diceSplice[1], 10)
            for(let i = 0; i < reps; i++) {
                const roll = Math.ceil(Math.random() * diceValue)
                newRolls.push(roll)
                newTotal += roll
            }
            setRolls(newRolls)
    
    
            if(formula.includes('+'))
                newTotal += parseInt(split[1], 10)
    
    
            const changeReps = 100
            for(let i = 0; i < changeReps; i++) {
                setTimeout(() => { setTotal(Math.ceil(Math.random() * diceValue)) }, i * 24 )
            }
    
            
            setTimeout(() => {
                setTotal(newTotal)
                setFinalTotalSet(true)
            }, 2500)
        }
    }, [formula])

    function clearRoller() {
        setFormula('')
        setShow(false)
    }

    return (
        (<div id="roller-container" className={show ? 'show-the-roller' : ''} >
            <div id="roller-screen" onClick={clearRoller} ></div>
            <div id="roller-body">
                <div id='roll-formula'>{formula}</div>
                <h1 id='roll-result' className={finalTotalSet ? 'final-color' : ''} >{total}</h1>
                <div id='all-rolls' >
                    {rolls.length > 1 && (rolls.map((r, i) => (<div key={`roll-${i}`}>{r}{i === rolls.length - 1 ? '': ','} </div>)))}
                </div>
            </div>
        </div>)
    )
}