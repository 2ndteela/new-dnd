import React from 'react';
import './Slot.css'

export default function Slot(props) {
    const {val, field, idx, arr, max, reverse, label, onUpdate} = props

    function inc() {
        let newVal = !!val ? parseInt(val, 10) : 0
        const temp = newVal + 1
        if(temp <= max) 
            if(arr) handleUpdate(temp, idx, arr)
            else handleUpdate(temp)
    }

    function dec() {
        let newVal = !!val ? parseInt(val, 10) : 0
        const temp = newVal - 1
        if(temp > -1) 
            if(arr) handleUpdate(temp, idx, arr)
            else handleUpdate(temp)
    }


    function handleUpdate(Val, Idx, Arr) {

        if(parseInt(Val, 10) > parseInt(max)) Val = parseInt(max, 10) 
        if(Arr) onUpdate(Val, field, Idx, Arr)
        else onUpdate(Val, field)
    }

    function makeBackground() {
        const percent = (parseInt(val, 10) / parseInt(max, 10)) * 100

        if(reverse) {
            if(percent > 75) return <div className='slot-background' style={{width: percent + '%'}}></div>
            else if (percent > 50) return <div className='slot-background yellow-back' style={{width: percent + '%'}}></div>
    
            return <div className='slot-background green-back' style={{width: percent + '%'}}></div>
        }

        if(percent > 50) return <div className='slot-background green-back' style={{width: percent + '%'}}></div>
        else if (percent > 25) return <div className='slot-background yellow-back' style={{width: percent + '%'}}></div>

        return <div className='slot-background' style={{width: percent + '%'}}></div>
    }

    return ( 
        <div className="slot-box">
            <span>{label}</span>
            <div className="slot-container">
                <button onClick={dec} >-</button>
                <div className="main-slot-container">
                    <input value={val} onChange={(e) => handleUpdate(e.target.value) } type="number"></input>
                    <div className="slot-max-number" >/ {max}</div>
                </div>
                <button onClick={inc} >+</button>
                {makeBackground()}
            </div>
        </div>
    );
}