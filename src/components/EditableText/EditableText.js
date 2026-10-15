import React, { useState } from 'react'
import { MdEdit } from 'react-icons/md'
import './EditableText.css'

// Pencil-to-edit text. `multiline` switches to a textarea (Ctrl/Cmd+Enter or blur saves).
export default function EditableText({ value, onSave, multiline, placeholder = '', label = 'Edit', allowEmpty }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  function startEditing(e) {
    e.stopPropagation()
    setDraft(value)
    setEditing(true)
  }

  function save() {
    const trimmed = draft.trim()
    if (trimmed || allowEmpty) onSave(trimmed)
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') setEditing(false)
    if (e.key === 'Enter' && (!multiline || e.metaKey || e.ctrlKey)) save()
  }

  if (editing) {
    const sharedProps = {
      autoFocus: true,
      value: draft,
      onClick: (e) => e.stopPropagation(),
      onChange: (e) => setDraft(e.target.value),
      onBlur: save,
      onKeyDown: handleKeyDown
    }

    return multiline
      ? <textarea className='editable-text-input multiline' rows={4} {...sharedProps} />
      : <input className='editable-text-input' {...sharedProps} />
  }

  return (
    <span className={`editable-text${multiline ? ' multiline' : ''}`}>
      <span className={`editable-text-value${value ? '' : ' placeholder'}`}>{value || placeholder}</span>
      <button className='editable-text-button' aria-label={label} onClick={startEditing}>
        <MdEdit />
      </button>
    </span>
  )
}
