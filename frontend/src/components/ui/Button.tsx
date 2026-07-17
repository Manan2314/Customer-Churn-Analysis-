import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  as?: React.ElementType
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  as: Component = 'button',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed backdrop-blur-md'

  const variantStyles = {
    primary: 'bg-primary text-white border border-primary/50 hover:border-primary hover:shadow-lg hover:shadow-primary/30 hover:scale-105 disabled:opacity-50 active:scale-95',
    secondary: 'glass text-text-primary hover:border-text-secondary/50 hover:shadow-lg hover:shadow-primary/10 disabled:opacity-50 active:scale-95',
    danger: 'bg-danger/80 text-white border border-danger/50 hover:border-danger hover:bg-danger hover:shadow-lg hover:shadow-danger/30 disabled:opacity-50 active:scale-95',
  }

  const sizeStyles = {
    sm: 'px-3 py-2 text-xs font-medium',
    md: 'px-4 py-2.5 text-sm font-medium',
    lg: 'px-6 py-3 text-base font-medium',
  }

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </Component>
  )
}
