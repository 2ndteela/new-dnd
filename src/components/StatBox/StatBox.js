import React from 'react';
import './StatBox.css'


export default function StatBox({name, main, save, setFormula}) {
    return ( 
        <div className="stat-box" onClick={() => setFormula(`d20 + ${save}`)}>
            <span className="stat-name" >{name}</span>
            <h2> {save > 0 ? '+' + save : save}</h2>
            <span className="stat-save">{main}</span>
        </div>
    );
}
