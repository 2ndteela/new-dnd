import React, { useState } from 'react';
import { MdExpandMore } from 'react-icons/md'
import './ExpansionPanel.css'

export default function ExpansionPanel({ header, children, bottomBorder }) {

    const [open, setOpen] = useState(false)

    function clickIt() {
        setOpen(!open)
    }


    return (
        <div className={`expansion-panel${bottomBorder ? ' bottom-border' : ''}`}>
            <div onClick={clickIt} className="expansion-panel-header" >
                <h2>{header}</h2>
                <span className={open ? 'flipped-arrow' : ''}>
                    <MdExpandMore></MdExpandMore>
                </span>
            </div>
            <div className={open ? 'expansion-panel-body open-panel' : 'expansion-panel-body'} >
                {children}
            </div>
        </div>
    )
}