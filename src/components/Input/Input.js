import React from 'react';
import './Input.css'

export default function Input(props) {

    const { 
        onUpdate, 
        textarea, 
        hidden, 
        add, 
        idx, 
        field, 
        arr, 
        val, 
        label, 
        fillHeight 
    } = props

    function handleInput(val) {
        if(idx !== undefined) {
            onUpdate(val, field, idx, arr)
        }
        else {
            onUpdate(val, field)
        }
    }

    function dec() {
        const temp = val - 1
        if(idx === 0 || idx) onUpdate(temp, field, idx, arr)
        else onUpdate(temp, field)
    }

    function inc() {
        const temp = parseInt(val, 10) + 1
        if(idx === 0 || idx) onUpdate(temp, field, idx, arr)
        else onUpdate(temp, field)
    }

    if(textarea) {
        return ( 
            <div className={ fillHeight === true ? "styled-input fill-height" : "styled-input"} >
                <textarea onChange={(e) => handleInput(e.target.value, field)}  value={val} ></textarea>
                <span>{label}</span>
            </div>
        );
    }
    if(hidden) {
        return(
            <div className="styled-input" >
                <input onChange={(e) => handleInput(e.target.value, field)} type="password" value={val} ></input>
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
        <div className="styled-input" >
            <input onChange={(e) => handleInput(e.target.value, field)} value={val} ></input>
            <span>{label}</span>
        </div>
    )
}