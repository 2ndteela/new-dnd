import React, { useCallback, useState, useEffect } from 'react'
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
  const [orderedChildren, setOrderedChildren] = useState(children)
  const [selectedIndex, setSelectedIndex] = useState(null)
  useEffect(() => {
    if (orderedChildren.length !== children.length) setOrderedChildren(children)
  }, [children, orderedChildren.length])

  const moveToTop = useCallback((idx, child) => {
    if (idx === orderedChildren.length - 1) return

    setSelectedIndex(idx)

    setTimeout(() => {
      const newOrder = orderedChildren.reduce((acc, c, itr) => {
        if (idx !== itr) return [...acc, c]
        else return acc
      }, [])

      setOrderedChildren([...newOrder, child])
      setSelectedIndex(null)
    }, 550)
  }, [orderedChildren])


  return (
    <div className="stacked-card-container">
      {orderedChildren.map((child, idx) => (
        <div
          key={idx}
          onClick={() => moveToTop(idx, child)}
          className={`stacked-card-child ${idx === orderedChildren.length - 1 ? 'top-card' : ''} ${selectedIndex === idx ? 'selected' : ''} ${selectedIndex !== null && idx > selectedIndex ? 'shift-up' : ''}`}
          style={{ top: `${idx * 40}px`, '--index': idx, '--card-count': orderedChildren.length }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
