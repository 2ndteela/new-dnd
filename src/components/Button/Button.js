import React, { forwardRef } from 'react'
import './Button.css'

// variant: primary (default) | flat | outline | text | ghost | danger
// tone (ghost only): danger | on-color
// size: sm for compact buttons in tight rows
// Spacing between buttons belongs to the parent layout; Button has no margin.
const Button = forwardRef(function Button(
  { variant = 'primary', tone, size, fullWidth, className, type = 'button', children, ...rest },
  ref
) {
  const classes = [
    'btn',
    `btn-${variant}`,
    tone && `btn-tone-${tone}`,
    size && `btn-${size}`,
    fullWidth && 'btn-full',
    className
  ].filter(Boolean).join(' ')

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {children}
    </button>
  )
})

export default Button
