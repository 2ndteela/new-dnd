import React, {useState} from 'react'
import './ExpandableCard.css'

export default function ExpandableCard({title, children, width = '100%'}) {

    const [ expanded, setExpanded ] = useState(false)

    const containerStyles = {
        border: '1px solid #333',
        width:  expanded ? '100%' : `${width}`,
        backgroundColor: '#1f1f1f',
        display: 'flex',
        padding: '0px !important',
        margin: '0px',
        marginBottom: '8px',
        transition: '0',
        borderRadius: '4px'
    }
    const headerStyles = {
        display: 'block',
        backgroundColor: '#333',
        width: '100%',
        padding: '8px',
        textAlign: 'left',
    }

    const bodyStyles = {
        padding: expanded ? '8px' : '0px',
        maxHeight: expanded ? 'unset' : '0px',
        overflow: 'hidden',
        display: 'block',
        textAlign: 'left',
        width: '100%'
    }

  return (
    <button onClick={() => setExpanded(!expanded)} style={containerStyles} >
        <h3 style={headerStyles}>{title}</h3>
        <div style={bodyStyles}>{children}</div>
    </button>
  )
}
