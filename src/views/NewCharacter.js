import React from 'react'
import { clearCurrentCharacter } from '../assets/utilities'
import Edit from '../components/Edit/Edit'

export default function NewCharacter() {

    clearCurrentCharacter()

    return (
        <>
            <Edit title="New Character"></Edit>
        </>
    )
}