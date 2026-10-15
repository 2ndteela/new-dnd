import React, { useState } from 'react'
import './StackedCards.css'

export function StackedCardActions({ children }) {
  return (
    <div className="stacked-card-actions">
      {children}
    </div>
  )
}

export function StackedCardBody({ children }) {
  return (
    <div className="stacked-card-body">
      {children}
    </div>
  )
}

export function StackedCardHeader({ title, subtitle, detail }) {
  return (
    <div className="stacked-card-header">
      <div style={{ alignItems: 'flex-start' }} >
        <h2>{title}</h2>
        {subtitle && <div>{subtitle}</div>}
      </div>
      <div className="header-details" >{detail}</div>
    </div>
  )
}

export function StackedCard({ children }) {
  return (
    <div className="stacked-card">
      {children}
    </div>
  )
}

export default function StackedCards({ children }) {
  const [order, setOrder] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)

  // Order is tracked by key so children re-render with fresh props instead of stale cached elements
  const childArray = React.Children.toArray(children)
  const childMap = Object.fromEntries(childArray.map((c) => [c.key, c]))
  const orderedKeys = [
    ...order.filter((k) => childMap[k]),
    ...childArray.map((c) => c.key).filter((k) => !order.includes(k))
  ]

  function moveToTop(idx) {
    if (idx === orderedKeys.length - 1) return

    setSelectedIndex(idx)

    setTimeout(() => {
      const movedKey = orderedKeys[idx]
      setOrder([...orderedKeys.filter((k) => k !== movedKey), movedKey])
      setSelectedIndex(null)
    }, 550)
  }

  return (
    <div className="stacked-card-container">
      {orderedKeys.map((key, idx) => {
        const isTop = idx === orderedKeys.length - 1
        return (
          <div
            key={key}
            onClick={() => moveToTop(idx)}
            className={`stacked-card-child ${isTop ? 'top-card' : ''} ${selectedIndex === idx ? 'selected' : ''} ${selectedIndex !== null && idx > selectedIndex ? 'shift-up' : ''}`}
            style={isTop
              ? { marginTop: `${idx * 40}px`, '--index': idx, '--card-count': orderedKeys.length }
              : { top: `${idx * 40}px`, '--index': idx, '--card-count': orderedKeys.length }}
          >
            {childMap[key]}
          </div>
        )
      })}
    </div>
  )
}
