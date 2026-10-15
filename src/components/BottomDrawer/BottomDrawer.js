import React, { useState, useEffect } from 'react'
import { MdKeyboardDoubleArrowUp } from "react-icons/md"
import './BottomDrawer.css'

export default function BottomDrawer({ children }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.classList.add('drawer-open')
    } else {
      document.body.classList.remove('drawer-open')
    }

    return () => {
      document.body.classList.remove('drawer-open')
    }
  }, [open])

  return (
    <>
      <div id="drawer-container" className={`${open ? 'open' : 'closed'}`} >
        <button id="expand-button" className="text-button" onClick={() => setOpen((v) => !v)}>
          <MdKeyboardDoubleArrowUp />
        </button>
        <div id="drawer-content">
          {children}
        </div>
      </div>
      <div id="drawer-spacer"></div>
    </>
  )
}
