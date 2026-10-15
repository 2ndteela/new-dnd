import React, { useState } from 'react';
import { MdExpandMore } from 'react-icons/md'
import './ExpansionPannel.css'

export default function ExpansionPannel({ header, children, bottomBorder }) {

    const [open, setOpen] = useState(false)

    function clickIt() {
        setOpen(!open)
    }


    return (
        <div className={`expansion-pannel${bottomBorder ? ' bottom-border' : ''}`}>
            <div onClick={clickIt} className="expansion-pannel-header" >
                <h2>{header}</h2>
                <span className={open ? 'flipped-arrow' : ''}>
                    <MdExpandMore></MdExpandMore>
                </span>
            </div>
            <div className={open ? 'expansion-pannel-body open-pannel' : 'expansion-pannel-body'} >
                {children}
            </div>
        </div>
    )
}