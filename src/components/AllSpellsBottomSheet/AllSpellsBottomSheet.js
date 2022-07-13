import React, {useEffect, useState} from 'react'
import { MdClose } from 'react-icons/md'
import { searchForSpell } from '../../assets/services'
import Input from '../Input/Input'
import './AllSpellsBottomSheet.css'

export default function AllSpellsBottomSheet({addSpell, spells}) {
    const [ filteredSpells, setFilteredSpells ] = useState([])
    const [ spellSearch, setSpellSearch ] = useState('')
    const [ show, setShow ] = useState(false)
    const [ selectedSpell, setSelectedSpell ] = useState(null)

    useEffect(() => {
        if(!spellSearch)
            setFilteredSpells(spells.results)
        else {
            const arr = [...spells.results]
            const results = arr.filter(s => s.name.toLocaleLowerCase().includes(spellSearch.toLocaleLowerCase()))
            setFilteredSpells( results )
            if(results.length > 1 || results.length === 0 )
                setSelectedSpell(null)
        }
    }, [spells, spellSearch])

    async function getSpellDetails(spell) {
        try {
            const val = await searchForSpell(spell.index)
            setSpellSearch(spell.name)
            console.log(val)
            setSelectedSpell(val)

        }
        catch(error) {
            console.error(error)
        }
    }

    return (
        <div id="all-spells-side-sheet-container">
            <button onClick={() => setShow(true)} >All Spells</button>
            <div id="sliding-side-sheet" className={show ? 'opened' : ''}>
                <div className='full-width-row' style={{justifyContent: 'flex-end', paddingBottom: '16px'}}>
                    <MdClose style={{fontSize: '24px'}} onClick={() => setShow(false)} />
                </div>
                <div className='full-width-row' >
                    <Input label="Search" val={spellSearch} onUpdate={setSpellSearch} />
                </div>
                <div id="current-spell-list">
                    {filteredSpells.map(s => (
                        <div className='spell-in-list' onClick={() => getSpellDetails(s)} >
                            {s.name}
                            {s.name === selectedSpell.name && <MdClose style={{marginLeft: '8px'}} />}
                        </div>
                    ))}
                </div>
                {selectedSpell && 
                <div id="selected-spell-data">
                    <div className='full-width-row'>
                        <div style={{width: '100%', alignItems: 'flex-start', paddingBottom: '8px'}}>
                            <div className='full-width-row' ><b>Range:</b> <div>{selectedSpell?.range}</div></div>
                            <div className='full-width-row'> <b>School:</b> <div>{selectedSpell?.school?.name}</div></div>
                            <div className='full-width-row'> <b>Level:</b><div>{selectedSpell?.level === 0 ? 'Cantrip': `Level ${selectedSpell.level}`}</div></div>
                            <div className='full-width-row'> <b>Casting Time:</b> <div>{selectedSpell?.casting_time}</div></div>
                            <div className='full-width-row'> <b>Duration:</b> <div>{selectedSpell?.duration}</div></div>
                        </div>
                        <button>Add Spell</button>
                    </div>
                    <div className='full-width-row spell-requirements'>
                        {selectedSpell.concentration && <div className='spell-requirement'>Concentration</div>} 
                        {selectedSpell?.components.includes('V') && <div className='spell-requirement'>Vocal</div>} 
                        {selectedSpell?.components.includes('S') && <div className='spell-requirement'>Somatic</div>}
                    </div>
                    <div>
                        {selectedSpell.desc.map(d => (
                            <div style={{paddingBottom: '8px'}} >{d}</div>
                        ))}
                    </div>
                </div>}
            </div>
        </div>
    )
}