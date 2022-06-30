import React, { useState, useEffect } from 'react';
import Input from '../../components/Input/Input'
import { loadCharacter } from '../../assets/utilities';

import './style.css'

export default function Spells() {

        const char = loadCharacter()
        const [ spells ] = useState(char.spells ? char.spells : [])
        const [ filteredSpells, setFilteredSpells] = useState(char.spells ? char.spells : [])
        const [ filterTerm, setFilterTerm ] = useState('lowest')
        const [ searchTerm, setSearchTerm ] = useState('')

    useEffect(() => {
        let arr = []
        let temp =[...spells]
        temp.forEach(s => {
            if(s.name.toUpperCase().includes(searchTerm.toUpperCase()) || s.description.toUpperCase().includes(searchTerm.toUpperCase())) arr.push(s)
        })

        if(filterTerm === 'lowest') arr.sort((a, b) => {
            if(a.level === 'Cantrip' && b.level !== 'Cantrip') return -1
            if(b.level === 'Cantrip' && a.level !== 'Cantrip') return 1 
            if(a.level === b.level) return a.name - b.name
            return a.level - b.level
        })
        else if (filterTerm === 'highest') arr.sort((a, b) => {
            if(a.level === 'Cantrip' && b.level !== 'Cantrip') return 1
            if(b.level === 'Cantrip' && a.level !== 'Cantrip') return -1 
            if(a.level === b.level) return a.name - b.name
            return b.level - a.level
            
        })
        
        else arr.sort((a, b) => (a.name - b.name))

        setFilteredSpells(arr)

    }, [searchTerm, filterTerm, spells])

    return ( 
        <div id="spells-container">
            {spells?.length === 0 && <h3>No spells! Add some in the edit tab.</h3>}
            {spells?.length > 0 && (
                <div>
                <div className="styled-input">
                    <select value={filterTerm} onChange={(e) => setFilterTerm(e.target.value)} >
                        <option value="lowest" >Lowest Level</option>
                        <option value="highest" >Highest Level</option>
                        <option value="alpha" >Alphabetical</option>
                    </select>
                    <span>Filter</span>
                </div>
                <Input label="Search" val={searchTerm} onUpdate={setSearchTerm} ></Input>
                { filteredSpells?.map((s, i) => {
                    return (
                        <div className="spell-box" key={'spel-' + i}>
                            <div className="spell-header">
                                <h3>{s.name}</h3>
                                <span>{s.level === 'Cantrip' || s.level === 'cantrip' ? 'Cantrip' : 'Level ' + s.level}</span>
                            </div>
                            <div style={{paddingBottom: '8px', color: '#1e3b56'}}>
                                {s.con === true ? 'Concentration' : ''}
                            </div>
                            <div style={{paddingBottom: '8px'}}>
                                {s.description}
                            </div>
                            <div className="spell-stats">
                                <div className="spell-stat-container">
                                    <div>{s.range}</div>
                                    <span>Range</span>
                                </div>
                                <div className="spell-stat-container">
                                    <div>{s.damage}</div>
                                    <span>Damage</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>)}
        </div>
    )
}