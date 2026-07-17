import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`glass rounded-xl p-6 backdrop-blur-md hover:backdrop-blur-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${className}`}
    {...props}
  >
    {children}
  </div>
)
