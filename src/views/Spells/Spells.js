import React, { useState, useEffect } from 'react';
import Input from '../../components/Input/Input'
import CheckBox from '../../components/CheckBox/CheckBox';
import { loadCharacter, writeCharacter } from '../../assets/utilities';

import './style.css'
import AllSpellsBottomSheet from '../../components/AllSpellsBottomSheet/AllSpellsBottomSheet';

export default function Spells({editMode, fullSpellList}) {

        const [ char, setChar] = useState(loadCharacter())
        const [ spells ] = useState(char.spells ? char.spells : [])
        const [ filteredSpells, setFilteredSpells] = useState(char.spells ? char.spells : [])
        const [ filterTerm, setFilterTerm ] = useState('lowest')
        const [ searchTerm, setSearchTerm ] = useState('')

        function updateArray(val, field, idx, arr) {
            const c = {...char}
            c[arr][idx][field] = val

            setChar(c)
            writeCharacter(c)
        }

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
            {editMode && <div className='full-width-row' style={{paddingBottom: '16px'}} >
                <AllSpellsBottomSheet spells={fullSpellList} />
            </div>}
            {spells?.length === 0 && <h3>No spells! Add some in the edit tab.</h3>}
            {spells?.length > 0 && (
                <div id="spells-list-container">
                    { !editMode && 
                    <div className="styled-input">
                        <select value={filterTerm} onChange={(e) => setFilterTerm(e.target.value)} >
                            <option value="lowest" >Lowest Level</option>
                            <option value="highest" >Highest Level</option>
                            <option value="alpha" >Alphabetical</option>
                        </select>
                        <span>Order</span>
                    </div>
                    }
                    { !editMode && <Input label="Search" val={searchTerm} onUpdate={setSearchTerm} ></Input>}
                    { filteredSpells?.map((s, i) => (
                        editMode ? 
                        <div className='edit-spell-box'>
                            <Input label="Name" val={s.name} field="name" idx={i} arr="spells" onUpdate={updateArray} />
                            <div className='full-width-row space-styled-inputs'> 
                                <Input label="Range" val={s.range} field="range" idx={i} arr="spells" onUpdate={updateArray} />
                                <Input label="Damage" val={s.damage} field="damage" idx={i} arr="spells" onUpdate={updateArray} />
                                <Input add label="Level" val={s.level} field="level" idx={i} arr="spells" onUpdate={updateArray} />
                            </div>
                            <Input textarea label="Description" val={s.description} field="description" idx={i} arr="spells" onUpdate={updateArray} />
                            <div className='full-width-row'>
                                <CheckBox arr='spells' field="con" idx={i} model={s.con} label="Concentration" onUpdate={updateArray} />
                                <CheckBox arr='spells' field="somatic" idx={i} model={s.somatic} label="Somatic" onUpdate={updateArray} />
                                <CheckBox arr='spells' field="vocal" idx={i} model={s.vocal} label="Vocal" onUpdate={updateArray} />
                            </div>

                        </div> :
                            <div className="spell-box" key={'spel-' + i}>
                                <div className="spell-header">
                                    <h3>{s.name}</h3>
                                    <span>{s.level === 'Cantrip' || s.level === 'cantrip' ? 'Cantrip' : 'Level ' + s.level}</span>
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
                                <div style={{paddingTop: '12px', flexDirection: 'row'}}>
                                { s.con && <div className='spell-requirement'>Concentration</div>}
                                { s.somatic && <div className='spell-requirement'>Somatic</div>}
                                { s.vocal && <div className='spell-requirement'>Vocal</div>}
                                </div>
                            </div>
                        )
                    )}
            </div>)}
        </div>
    )
}