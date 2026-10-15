import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCloudDone } from 'react-icons/md';
import { useLocalValue } from '../../assets/storage';
import './Header.css'
import { loadCharacter } from '../../assets/utilities';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';

export default function Header() {

    const location = useLocation()
    const navigate = useNavigate()
    // Login has no session yet, and Resources is where this goes
    const showBack = location.pathname !== '/' && location.pathname !== '/resources'
    const signedIn = !!useLocalValue('uid')
    const guest = useLocalValue('guest') === true && !signedIn
    const onLogin = location.pathname === '/'

    const titleText = useMemo(() => {
        if (location.pathname === '/character-create') return 'New Character Creation'
        if (location.pathname === '/resources') return 'Resources'
        if (location.pathname === '/monsters') return 'Monsters and Initiative'
        if (location.pathname === '/multi') {
            const character = loadCharacter()
            return character?.name ?? ''
        }

        return "Dee n' Dee"
    }, [location])

    return (
        <div className="header-container">
            <h1>{titleText}</h1>
            {showBack && (
                <IconButton label="Back to resources" size="lg" tone="on-color" className="header-back-button" onClick={() => navigate('/resources')}>
                    <MdArrowBack />
                </IconButton>
            )}
            {!onLogin && signedIn && (
                <div className="header-account-status" role="img" aria-label="Signed in, changes sync to your account" title="Signed in, changes sync to your account">
                    <MdCloudDone />
                </div>
            )}
            {!onLogin && guest && (
                <Button variant="outline" size="sm" className="header-sign-in-button" onClick={() => navigate('/')}>Sign in</Button>
            )}
        </div>
    );
}