import React from 'react';
import './StatBox.css'


export default function StatBox({name, main, save}) {
    return ( 
        <div className="stat-box">
            <span className="stat-name" >{name}</span>
            <h2> {save > 0 ? '+' + save : save}</h2>
            <span className="stat-save">{main}</span>
        </div>
    );
}
