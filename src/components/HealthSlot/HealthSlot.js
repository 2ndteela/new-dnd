import React, { useState, useEffect, useRef } from 'react'
import { MdMoreVert } from 'react-icons/md'
import Slot from '../Slot/Slot'
import Input from '../Input/Input'
import './HealthSlot.css'

export default function HealthSlot({ label = 'Health', current, max, presets = [], onCurrentChange, onMaxChange }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [maxDraft, setMaxDraft] = useState(max)
  const containerRef = useRef(null)
  // Captured when the menu opens so intermediate keystrokes (5 -> 50) can't flip it
  const wasFullRef = useRef(false)

  useEffect(() => {
    setMaxDraft(max)
  }, [max])

  useEffect(() => {
    if (!menuOpen) return

    function handleOutsideClick(e) {
      if (!containerRef.current?.contains(e.target)) setMenuOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [menuOpen])

  function updateCurrent(val) {
    if (val === '') return onCurrentChange('')
    const parsed = parseInt(val, 10)
    onCurrentChange(Number.isNaN(parsed) ? 0 : Math.max(0, parsed))
  }

  function toggleMenu() {
    if (!menuOpen) wasFullRef.current = parseInt(current, 10) === max
    setMenuOpen((v) => !v)
  }

  // Full health stays full: current follows max when it was full on open
  function commitMax(newMax) {
    onMaxChange(newMax, wasFullRef.current ? newMax : undefined)
  }

  function updateMax(val) {
    setMaxDraft(val)
    const parsed = parseInt(val, 10)
    if (!Number.isNaN(parsed) && parsed > 0) commitMax(parsed)
  }

  return (
    <div className="health-slot" ref={containerRef}>
      <Slot label={label} val={current} max={max} onUpdate={updateCurrent} />
      <button
        className="health-slot-menu-button"
        aria-label="Health options"
        onClick={toggleMenu}
      >
        <MdMoreVert />
      </button>
      {menuOpen && (
        <div className="health-slot-menu">
          <Input add label="Max Health" val={maxDraft} minValue="1" onUpdate={updateMax} />
          <div className="health-slot-presets">
            {presets.map((p) => (
              <button
                key={p.label}
                className={`flat-button health-slot-preset${p.value === max ? ' active' : ''}`}
                onClick={() => commitMax(p.value)}
              >
                <span>{p.label}</span>
                <span>{p.value}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
