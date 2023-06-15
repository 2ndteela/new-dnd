import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css'
import { loadCharacter } from '../../assets/utilities';

export default function Header() {

    const location = useLocation()

    const titleText = useMemo(() => {
        if(location.pathname === '/character-create') return 'New Character Creation'
        if(location.pathname === '/characters') return 'My Characters'
        if(location.pathname === '/multi') {
            const character = loadCharacter()
            return character?.name ?? ''
        }

        return "Dee n' Dee"
    }, [location])

    return ( 
        <div className="header-container">
            <h1>{titleText}</h1>
        </div>
        );
}