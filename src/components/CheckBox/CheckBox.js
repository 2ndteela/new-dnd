import React from 'react';
import './CheckBox.css'

export default function CheckBox({arr, onUpdate, field, idx, model, label}) {
    function handleClick() {
        const temp = !model

        if(arr) onUpdate(temp, field, idx, arr)
        else onUpdate(temp, field)
    }

    return ( 
        <div className='box-container' >
            <div className="outer-box" onClick={handleClick}>
                <div className={model === true ? 'inner-box filled-box' : 'inner-box'} ></div>
            </div>
            <div style={{marginLeft: '8px'}}>{label}</div>
        </div>
    );
}
