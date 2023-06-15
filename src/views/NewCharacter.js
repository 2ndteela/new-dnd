import React from 'react'
import { clearCurrentCharacter } from '../assets/utilities'
import Edit from '../components/Edit/Edit'

export default function NewCharacter() {

    clearCurrentCharacter()

    return (
        <div style={{width: '100%', display: 'flex', alignItems: 'center'}}>
            <Edit></Edit>
        </div>
    )
}