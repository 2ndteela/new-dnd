import React, { useEffect, useRef } from 'react'
import './Dialog.css'
import Button from '../Button/Button'

export default function Dialog({ title, children, actions, onClose, wide, className }) {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onCloseRef.current()
    }

    // Move focus into the dialog, and back to whatever opened it on close
    const opener = document.activeElement
    panelRef.current?.focus()

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (opener && typeof opener.focus === 'function') opener.focus()
    }
  }, [])

  return (
    <div className='dialog-overlay' onClick={onClose}>
      <div
        ref={panelRef}
        tabIndex={-1}
        className={['surface-card', 'dialog', wide && 'wide', className].filter(Boolean).join(' ')}
        role='dialog'
        aria-modal='true'
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className='dialog-title'>{title}</h3>
        <div className='dialog-body'>{children}</div>
        {actions && <div className='dialog-actions'>{actions}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({ title, message, confirmLabel, onCancel, onConfirm }) {
  return (
    <Dialog
      title={title}
      onClose={onCancel}
      actions={(
        <>
          <Button variant='text' onClick={onCancel}>Cancel</Button>
          <Button variant='danger' onClick={onConfirm}>{confirmLabel}</Button>
        </>
      )}
    >
      <div>{message}</div>
    </Dialog>
  )
}
