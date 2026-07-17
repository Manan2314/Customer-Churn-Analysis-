import React, { useEffect } from 'react'
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'

interface ToastProps {
  id: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({ id, message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000)
    return () => clearTimeout(timer)
  }, [id, onClose])

  const bgColors = {
    success: 'bg-green-900 border-green-700',
    error: 'bg-red-900 border-red-700',
    warning: 'bg-yellow-900 border-yellow-700',
    info: 'bg-blue-900 border-blue-700',
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-danger" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    info: <Info className="w-5 h-5 text-primary" />,
  }

  return (
    <div
      className={`border rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${bgColors[type]}`}
      role="alert"
    >
      {icons[type]}
      <p className="flex-1 text-sm text-text-primary">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-text-secondary hover:text-text-primary"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'warning' | 'info' }>
  onClose: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => (
  <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
    {toasts.map((toast) => (
      <Toast key={toast.id} {...toast} onClose={onClose} />
    ))}
  </div>
)
