import React, { useState } from 'react';
import Input from '../../components/Input/Input'

import './Pack.css'
import { loadCharacter, writeCharacter } from '../../assets/utilities';

export default function Pack() {
    const [character, setCharacter] = useState(loadCharacter)

    function updateState(val, field) {
        const c = {...character}
        c[field] = val
        setCharacter(c)
        writeCharacter(c)
    }

    return ( 
        <div>
            <div>
                <div className="multi-input">
                    <Input add={true} label="Gold" val={character.gold} field="gold" onUpdate={updateState}></Input>
                    <Input add={true} label="Silver" val={character.silver} field="silver" onUpdate={updateState}></Input>
                    <Input add={true} label="Copper" val={character.copper} field="copper" onUpdate={updateState}></Input>
                </div>
                <div className="pack-height">
                    <Input label="Pack" textarea={true} field="pack" fillHeight={true} val={character.pack} onUpdate={updateState} />
                </div>
                <div className="note-height">
                    <Input label="Notes" textarea={true} field="notes" fillHeight={true} val={character.notes} onUpdate={updateState} />
                </div>
            </div>
        </div>
    );
}