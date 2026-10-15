import React, { useState } from 'react'
import './ExpandableCard.css'

export default function ExpandableCard({ title, children, width = '100%' }) {

    const [expanded, setExpanded] = useState(false)

    return (
        <button
            className={`expandable-card${expanded ? ' expanded' : ''}`}
            style={{ width: expanded ? '100%' : width }}
            onClick={() => setExpanded(!expanded)}
        >
            <h3 className='expandable-card-header'>{title}</h3>
            <div className='expandable-card-body'>{children}</div>
        </button>
    )
}
