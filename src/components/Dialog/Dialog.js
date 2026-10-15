import React, { useEffect } from 'react'
import './Dialog.css'

export default function Dialog({ title, children, actions, onClose, wide }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className='dialog-overlay' onClick={onClose}>
      <div className={`dialog${wide ? ' wide' : ''}`} role='dialog' aria-label={title} onClick={(e) => e.stopPropagation()}>
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
          <button className='text-button' onClick={onCancel}>Cancel</button>
          <button className='dialog-danger-button' onClick={onConfirm}>{confirmLabel}</button>
        </>
      )}
    >
      <div>{message}</div>
    </Dialog>
  )
}
