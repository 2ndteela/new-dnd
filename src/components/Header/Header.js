import React, { useState } from 'react';
import './Header.css'

export default function Header(props) {

    const { label, children, noActions } = props
    const [ showMenu, setShowMenu ] = useState(false)

    function toggleHamberger() {
        setShowMenu(!showMenu)
    }

    if(noActions) 
        return (
            <div className="header-container center-up">
                <h1>{label}</h1>
            </div>
        )

    return ( 
        <div className="header-container">
            <h1>{label}</h1>
            <div className={showMenu === true ? 'make-ex hamberger-icon': 'hamberger-icon' } onClick={toggleHamberger}>
                <span id="nomal-bar" ></span>
                <span id="flippy-bar"></span>
                <span id='go-away-bar'></span>
            </div>
            <div id="hamberger-drawer" className={showMenu === true ? 'show-menu' : ''}>
                {children}
            </div>
        </div>
        );
}