import React from 'react'
import './CharacterHistory.css'
import { useCharacterContext } from '../../components/MultiPannelViewer/CharacterContext';
import Input from '../../components/Input/Input';

export default function CharacterHistory({editMode}) {

    const {character, updateCharacter} = useCharacterContext()

    function updateValue(val, field) {
        const char = {...character}
        char[field] = val
        
        updateCharacter(char)
    }

    return (
        <div id="character-history-container">
            { !editMode ? <div className='full-width'>
                <div className='information-container'>
                    <h2>{character.name}</h2>
                    <div>{character.backStory}</div>
                </div>
                <div className='information-container'>
                    <div className='information-container-header' >Class</div>
                    <div>{character.class}</div>
                </div>
                <div className='full-width-row two-items'>
                    <div className='information-container'>
                        <div className='information-container-header' >Race</div>
                        <div>{character.race}</div>
                    </div>
                    <div className='information-container'>
                        <div className='information-container-header' >Alignment</div>
                        <div>{character.alignment}</div>
                    </div>
                </div>
                <div className='information-container'>
                    <div className='information-container-header' >Background</div>
                    <div>{character.background}</div>
                </div>
                <div className='information-container'>
                    <div className='information-container-header' >Languages</div>
                    <div>{character.languages}</div>
                </div>
                <div className='full-width-row two-items'>
                    <div className='information-container'>
                        <div className='information-container-header' >Level</div>
                        <div>{character.level}</div>
                    </div>
                    <div className='information-container'>
                        <div className='information-container-header' >Experience Points</div>
                        <div>{character.exp}</div>
                    </div>
                </div>
                <Input textarea label="Notes" val={character.characterNotes} field='characterNotes' onUpdate={updateValue} />
            </div> : 
            <div className='full-width'>
                <Input label="Name" val={character.name} field='name' onUpdate={updateValue} />
                <Input textarea label="Back Story" val={character.backStory} field='backStory' onUpdate={updateValue} />
                <Input label="Class" val={character.class} field='class' onUpdate={updateValue} />
                <Input label="Race" val={character.race} field='race' onUpdate={updateValue} />
                <Input label="Alignment" val={character.alignment} field='alignment' onUpdate={updateValue} />
                <Input label="Background" val={character.background} field='background' onUpdate={updateValue} />
                <Input label="Languages" val={character.languages} field='languages' onUpdate={updateValue} />
                <Input add label="Level" val={character.level} field='level' onUpdate={updateValue} />
                <Input add label="Experience" val={character.exp} field='exp' onUpdate={updateValue} />
            </div>}
        </div>
    )
}