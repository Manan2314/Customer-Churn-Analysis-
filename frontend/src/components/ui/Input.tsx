import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`glass hover:backdrop-blur-lg hover:bg-surface-alt focus:ring-primary/40 focus:border-primary ${error ? 'border-danger/40 focus:ring-danger/30 focus:border-danger' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger font-medium">{error}</p>}
      {helperText && <p className="text-xs text-text-tertiary">{helperText}</p>}
    </div>
  )
}
