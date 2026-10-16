import React from 'react';
import './StatBox.css'
import { useDiceRoller } from '../DiceRollerDialog/DiceRollerProvider'


export default function StatBox({name, main, save}) {
    const { rollDice } = useDiceRoller()
    return ( 
        <div className="stat-box" onClick={() => rollDice(`d20 + ${save}`, { label: `${name} save` })}>
            <span className="stat-name" >{name}</span>
            <h2> {save > 0 ? '+' + save : save}</h2>
            <span className="stat-save">{main}</span>
        </div>
    );
}
