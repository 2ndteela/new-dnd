import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCharacters } from '../../assets/services';
import { clearCurrentCharacter, writeCharacter } from '../../assets/utilities';
import Header from '../../components/Header/Header'
import './CharacterSelect.css'


export default function CharacterSelect() {
    const navigate = useNavigate()  
    const [ characters, setCharacters ] = useState([])
    const [ loading, setLoading ] = useState(false)


    useEffect(() => {
        setLoading(true)
        clearCurrentCharacter()
        
        getCharacters().then(data => {
            const keys = Object.keys(data.characters)
            const charArray = []

            keys.forEach(k => {
                data.characters[k].key = k
                charArray.push(data.characters[k])
            })

            setCharacters(charArray)
            setLoading(false)
        })
    }, [])

    function goToCharacter(char) {
        writeCharacter(char)
        navigate('/multi')
    }

    function createNewCharacter() {
        const char = {
            name: 'New Character',
            con: 10,
            dex: 10,
            str: 10,
            int: 10,
            wis: 10,
            char: 10,
            abilities: [],
            spellSlots: [],
            customFields: [],
            weapons: [],
            spells: []
        }

        writeCharacter(char)
        navigate('/character-create')
    }

    return ( 
        <div>
            <div className="page-content">
                {loading && <h1>Fetching Characters...</h1>}
                {characters.map((char, i) => {
                    return (
                        <div className="char-card" key={"char-" + i} onClick={() => goToCharacter(char)} >
                            <h3>{char.name}</h3>
                            <div>Level {char.level} {char.race} {char.class}</div>
                        </div>
                    )
                })}
                {!characters.length && !loading && <h2>Looks like you're new here. Click "New Character" to begin!</h2>}
                {!loading && <div id='new-character-space' onClick={createNewCharacter}>
                    +
                </div>}
            </div>
        </div>
    );
}