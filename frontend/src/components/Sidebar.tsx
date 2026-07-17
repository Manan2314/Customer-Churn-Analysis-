import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, BarChart3, Brain, Upload, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { logout } = useAuth()

  const menuItems = [
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/churn', icon: Brain, label: 'Churn Prediction' },
    { path: '/segmentation', icon: Brain, label: 'Segmentation' },
    { path: '/upload', icon: Upload, label: 'Upload Data' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass text-text-primary hover:backdrop-blur-lg transition-all"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static left-0 top-0 h-screen glass border-r border-border/40 w-64 transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col backdrop-blur-xl`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border/40">
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-purple rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            AI Intelligence
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${
                  isActive(item.path)
                    ? 'bg-primary/20 text-primary border border-primary/40 shadow-lg shadow-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt/40 hover:border hover:border-border/50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/40 p-4 space-y-1">
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${
              isActive('/settings')
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt/40'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span>Settings</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 hover:border hover:border-danger/30 transition-all font-medium text-sm"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
