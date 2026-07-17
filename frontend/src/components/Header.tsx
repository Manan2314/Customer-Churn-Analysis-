import React from 'react'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  title: string
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user } = useAuth()

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 md:px-8 py-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">{title}</h2>
          {subtitle && <p className="text-text-tertiary text-sm mt-2">{subtitle}</p>}
        </div>
        {user && <p className="text-sm text-text-secondary glass px-4 py-2 rounded-lg border border-border/50">{user.email}</p>}
      </div>
    </header>
  )
}
