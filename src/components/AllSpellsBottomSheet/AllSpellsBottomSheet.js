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
        if(!spellSearch || spellSearch === '') {
            setFilteredSpells(spells.results)
            setSelectedSpell(null)
        }
        else {
            const arr = [...spells.results]
            const results = arr.filter(s => s.name.toLocaleLowerCase().includes(spellSearch.toLocaleLowerCase()))
            setFilteredSpells( results )
            if(results.length > 1 || results.length === 0 )
                setSelectedSpell(null)
        }
    }, [spells, spellSearch])

    function addSpellToList(spell) {
        setSpellSearch('')
        addSpell(spell)

        alert(`${spell.name} added to your spell book`)
    }

    return (
        <div id="all-spells-side-sheet-container">
            <button onClick={() => setShow(true)} >Search Spells</button>
            <div id="all-spells-skrim" className={show ? 'opened' : ''}>
                <div id="sliding-side-sheet" className={show ? 'opened' : ''}>
                    <div className='full-width-row' style={{justifyContent: 'flex-end', paddingBottom: '16px'}}>
                        <MdClose style={{fontSize: '24px'}} onClick={() => setShow(false)} />
                    </div>
                    <div className='full-width-row' >
                        <Input label="Search" val={spellSearch} onUpdate={setSpellSearch} />
                    </div>
                    
                </div>
            </div>
        </div>
    )
}