import React, { forwardRef } from 'react'
import Button from '../Button/Button'
import './IconButton.css'

// A tappable icon. `label` is required: it's the accessible name and the hover tooltip.
// size: sm (28px, padded hit area) | md (36px, default) | lg (44px)
// variant: ghost (default, no background) | filled (round, raised background)
// tone: danger | on-color (see Button)
const IconButton = forwardRef(function IconButton(
  { label, size = 'md', variant = 'ghost', className, children, ...rest },
  ref
) {
  const classes = ['icon-btn', `icon-btn-${size}`, variant === 'filled' && 'icon-btn-filled', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Button ref={ref} variant='ghost' aria-label={label} title={label} className={classes} {...rest}>
      {children}
    </Button>
  )
})

export default IconButton
