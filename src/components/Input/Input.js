import React from 'react';
import './Input.css'

export default function Input(props) {

    const { 
        onUpdate, 
        textarea, 
        hidden, 
        add, 
        maxValue,
        minValue,
        idx, 
        field, 
        arr, 
        val, 
        label, 
        fillHeight,
        disabled,
    } = props

    function handleInput(val) {
        if(idx !== undefined) 
            onUpdate(val, field, idx, arr)
        else 
            onUpdate(val, field)
    }

    function dec() {
        if(minValue)
            if(val <= parseInt(minValue, 10))
                return 
        
        const temp = val - 1
        if(idx === 0 || idx) onUpdate(temp, field, idx, arr)
        else onUpdate(temp, field)
    }

    function inc() {
        if(maxValue)
            if(val >= parseInt(maxValue, 10))
                return 

        const temp = parseInt(val, 10) + 1
        if(idx === 0 || idx) onUpdate(temp, field, idx, arr)
        else onUpdate(temp, field)
    }

    if(textarea) {
        return ( 
            <div className={ fillHeight === true ? "styled-input fill-height" : "styled-input"} >
                {disabled ? 
                    <div className='textarea-standin'>{val}</div> : 
                    <textarea onChange={(e) => handleInput(e.target.value, field)}  value={val} ></textarea> 
                }
                <span>{label}</span>
            </div>
        );
    }
    if(hidden) {
        return(
            <div className="styled-input" >
                <input onChange={(e) => handleInput(e.target.value, field)} type="password" value={val} autoComplete='current-password' ></input>
                <span>{label}</span>
            </div>
        )
    }

    if(add) {
        return (
            <div className="styled-input add" >
                <button onClick={dec} >-</button>
                <input onChange={(e) => handleInput(e.target.value, field)} type="number" value={val} ></input>
                <button onClick={inc}>+</button>
                <span>{label}</span>
            </div>
        )
    }

    return ( 
        <div className="styled-input" autoComplete={label === 'Email' ? 'username' : ''} >
            { disabled ?
                <div className='text-field-standin'>{val}</div> :
                <input onChange={(e) => handleInput(e.target.value, field)} value={val} ></input>
            }
            <span>{label}</span>
        </div>
    )
}