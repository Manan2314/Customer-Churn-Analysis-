import React, { useState } from 'react'
import { Upload as UploadIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { Header } from '../components/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { uploadApi } from '../services/api'
import { useToast } from '../hooks/useToast'

interface UploadedFile {
  name: string
  size: number
  uploadedAt: string
  status: 'success' | 'error'
}

export const Upload: React.FC = () => {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      addToast('Please upload a CSV file', 'error')
      return
    }

    setIsLoading(true)
    try {
      await uploadApi.uploadDataset(file)
      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleString(),
        status: 'success',
      }
      setUploadedFiles((prev) => [newFile, ...prev])
      addToast('File uploaded successfully', 'success')
    } catch (error) {
      console.error('[v0] Upload error:', error)
      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleString(),
        status: 'error',
      }
      setUploadedFiles((prev) => [newFile, ...prev])
      addToast('Failed to upload file', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || [])
    if (files.length > 0) {
      handleUpload(files[0])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Upload Dataset" subtitle="Import customer data from CSV files" />

      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <Card
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed cursor-pointer transition-all shadow-xs ${
              isDragging ? 'border-primary bg-primary-light scale-105' : 'border-border hover:border-primary/40 hover:bg-surface-subtle'
            }`}
          >
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-primary-light rounded-2xl mb-4">
                <UploadIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Drop your CSV file</h3>
              <p className="text-text-tertiary text-sm text-center mb-6">
                or click to browse
              </p>
              <label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading}
                />
                <Button
                  as="span"
                  className="cursor-pointer"
                  disabled={isLoading}
                >
                  Select File
                </Button>
              </label>
            </div>
          </Card>

          {/* File Info */}
          <Card className="border-0 shadow-xs">
            <h3 className="text-lg font-bold text-text-primary mb-2">File Requirements</h3>
            <p className="text-text-tertiary text-sm mb-4">Ensure your CSV meets these specifications</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 p-3 bg-surface-alt rounded-lg">
                <span className="text-primary font-bold mt-0.5">✓</span>
                <span className="text-text-secondary">CSV format (.csv)</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-surface-alt rounded-lg">
                <span className="text-primary font-bold mt-0.5">✓</span>
                <span className="text-text-secondary">Maximum file size: 50MB</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-surface-alt rounded-lg">
                <span className="text-primary font-bold mt-0.5">✓</span>
                <span className="text-text-secondary">Required: customer_id, email, created_date</span>
              </li>
              <li className="flex items-start gap-3 p-3 bg-surface-alt rounded-lg">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span className="text-text-secondary">Optional: company, monthly_spending, support_tickets</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-text-primary mb-4">Recent Uploads</h3>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <Card key={index} className="border-0 shadow-xs">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {file.status === 'success' ? (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-success" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-danger" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary truncate">{file.name}</p>
                        <p className="text-xs text-text-tertiary">
                          {formatFileSize(file.size)} • {file.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 ${
                        file.status === 'success'
                          ? 'bg-green-100 text-success'
                          : 'bg-red-100 text-danger'
                      }`}
                    >
                      {file.status === 'success' ? 'Success' : 'Error'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
