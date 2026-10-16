import React, {useContext, createContext, useState, useEffect} from 'react' 
import { getAllSpells, getAllWeapons } from '../../assets/services'
import { loadCharacter, writeCharacter } from '../../assets/utilities'

export const CharacterContext = createContext()

export default function CharacterContextProvider({children}) {
    const [ character, setCharacter ] = useState(loadCharacter())
    const [ allSpells, setallSpells ] = useState([])
    const [ allWeapons, setallWeapons ] = useState([])

    useEffect(() => {
        async function doSpells() {
            const s = await getAllSpells()
            setallSpells(s)
        }

        async function doWeapons() {
            const w = await getAllWeapons()
            setallWeapons(w)
        }

        doSpells()
        doWeapons()
    }, [])

    function updateCharacter(character) {
        writeCharacter(character)
        setCharacter(character)
    }

    return (
        <CharacterContext.Provider value={{character, updateCharacter, allSpells, allWeapons}}  >
            {children}
        </CharacterContext.Provider>
    )
}

export const useCharacterContext = () => useContext(CharacterContext)