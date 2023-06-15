import React from 'react'
import { Link } from 'react-router-dom'
import { clearCurrentCharacter } from '../assets/utilities'
import Edit from '../components/Edit/Edit'
import Header from '../components/Header/Header'

export default function NewCharacter() {

    clearCurrentCharacter()

    return (
        <div style={{width: '100%', display: 'flex', alignItems: 'center'}}>
            <Edit></Edit>
        </div>
    )
}