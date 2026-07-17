import React, { useState } from 'react'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import { Header } from '../components/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'

export const Settings: React.FC = () => {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    apiEndpoint: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    notificationsEnabled: true,
    autoRefresh: true,
    refreshInterval: 30,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      localStorage.setItem('appSettings', JSON.stringify(settings))
      addToast('Settings saved successfully', 'success')
    } catch (error) {
      addToast('Failed to save settings', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" subtitle="Configure your preferences" />

      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Account */}
          <Card className="border-0 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary-light rounded-lg">
                <SettingsIcon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Account</h3>
            </div>
            <p className="text-text-tertiary text-sm mb-6">Your account information</p>
            <div className="space-y-5">
              <Input
                label="Email"
                type="email"
                value={user?.email || ''}
                disabled
              />
              <Input
                label="User ID"
                type="text"
                value={user?.id || ''}
                disabled
              />
            </div>
          </Card>

          {/* API Configuration */}
          <Card className="border-0 shadow-xs">
            <h3 className="text-lg font-bold text-text-primary mb-2">API Configuration</h3>
            <p className="text-text-tertiary text-sm mb-6">Manage backend connection and refresh settings</p>
            <form onSubmit={handleSave} className="space-y-6">
              <Input
                label="API Endpoint"
                type="url"
                name="apiEndpoint"
                value={settings.apiEndpoint}
                onChange={handleChange}
                placeholder="http://localhost:8000"
              />

              <div className="space-y-4 p-5 bg-surface-alt rounded-xl border border-border">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="autoRefresh"
                    checked={settings.autoRefresh}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-border cursor-pointer accent-primary"
                  />
                  <span className="text-text-primary font-medium group-hover:text-primary transition-colors">Auto-refresh data</span>
                </label>

                {settings.autoRefresh && (
                  <div className="ml-7 pl-4 border-l border-border">
                    <Input
                      label="Refresh Interval (seconds)"
                      type="number"
                      name="refreshInterval"
                      value={settings.refreshInterval}
                      onChange={handleChange}
                      min="10"
                      max="300"
                    />
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer group pt-2">
                  <input
                    type="checkbox"
                    name="notificationsEnabled"
                    checked={settings.notificationsEnabled}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-border cursor-pointer accent-primary"
                  />
                  <span className="text-text-primary font-medium group-hover:text-primary transition-colors">Enable notifications</span>
                </label>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full mt-8"
              >
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
            </form>
          </Card>

          {/* About */}
          <Card className="border-0 shadow-xs">
            <h3 className="text-lg font-bold text-text-primary mb-2">About</h3>
            <p className="text-text-tertiary text-sm mb-4">Application details and information</p>
            <div className="space-y-3 text-sm divide-y divide-border">
              <div className="pb-3">
                <p className="text-text-tertiary font-medium mb-1">Application</p>
                <p className="text-text-primary">AI Customer Intelligence Platform</p>
              </div>
              <div className="py-3">
                <p className="text-text-tertiary font-medium mb-1">Version</p>
                <p className="text-text-primary">1.0.0</p>
              </div>
              <div className="pt-3">
                <p className="text-text-tertiary font-medium mb-1">Built with</p>
                <p className="text-text-primary">React, Vite, Tailwind CSS, React Router, Axios</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
