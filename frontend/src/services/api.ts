import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'


const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors and fallback to mock API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    // In development, silently fail to mock API (will be handled by the callers)
    return Promise.reject(error)
  }
)



export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: () => {
    localStorage.removeItem('authToken')
    return Promise.resolve()
  },

  getProfile: () =>
    api.get('/auth/profile'),
}

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
}

export const predictionApi = {
  predictChurn: (data: Record<string, unknown>) =>
    api.post('/predict/churn', data),

  predictSegment: (data: Record<string, unknown>) =>
    api.post('/predict/segment', data),
}

export const uploadApi = {
  uploadDataset: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return api.post('/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const segmentationApi = {

  getAnalysis(){
    return api.get("/segmentation/analysis");
  }

};

export default api
