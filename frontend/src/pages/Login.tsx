import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await login(formData.email, formData.password)
      addToast('Login successful!', 'success')
      navigate('/dashboard')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.'
      addToast(message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl opacity-30" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent-purple rounded-2xl mb-6 shadow-lg shadow-primary/40">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">AI Intelligence</h1>
          <p className="text-text-tertiary text-center mt-2">Customer Intelligence Platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass backdrop-blur-xl rounded-2xl p-8 space-y-6 border border-primary/20 shadow-2xl shadow-primary/10">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Sign In</h2>
            <p className="text-text-tertiary text-sm mt-1">Enter your credentials to access your dashboard</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-8"
          >
            Sign In
          </Button>

          <div className="pt-4 border-t border-border">
            <p className="text-center text-xs text-text-tertiary">
              <span className="font-medium text-text-secondary">Demo credentials:</span> admin@example.com / password
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
