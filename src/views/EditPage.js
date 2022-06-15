import React, { useEffect } from 'react'
import { writeCharacterToDb } from '../assets/services'
import { loadCharacter } from '../assets/utilities'
import Edit from '../components/Edit/Edit'

export default function EditPage() {
    useEffect(() => {
        const character = loadCharacter()
        if(!character.savedChar)
            writeCharacterToDb()
    }, [])
    
    return (
        <>
            <Edit />
        </>
    )
}