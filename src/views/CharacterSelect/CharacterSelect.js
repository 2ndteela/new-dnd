import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCharacters } from '../../assets/services';
import { clearCurrentCharacter, writeCharacter } from '../../assets/utilities';
import Header from '../../components/Header/Header'
import './CharacterSelect.css'


export default function CharacterSelect() {
    const navigate = useNavigate()  
    const [ characters, setCharacters ] = useState([])


    useEffect(() => {
        clearCurrentCharacter()
        
        getCharacters().then(data => {
            const keys = Object.keys(data.characters)
            const charArray = []

            keys.forEach(k => {
                data.characters[k].key = k
                charArray.push(data.characters[k])
            })

            setCharacters(charArray)
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
        navigate('/multi')
    }

    return ( 
        <div>
            <Header label="Characters">
                <Link to='/' >Logout</Link>
            </Header>
            <div className="page-content">
                {characters.map((char, i) => {
                    return (
                        <div className="char-card" key={"char-" + i} onClick={() => goToCharacter(char)} >
                            <h3>{char.name}</h3>
                            <div>Level {char.level} {char.race} {char.class}</div>
                        </div>
                    )
                })}
                {!characters.length && <h2>Looks like you're new here. Click "New Character" to begin!</h2>}
                <div id='new-character-space' onClick={createNewCharacter}>
                    +
                </div>
            </div>
        </div>
    );
}