// Mock API responses for testing without a backend

export const mockApi = {
  auth: {
    login: async (email: string, password: string) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      return {
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 'user-123',
            email: email,
            name: email.split('@')[0],
          },
        },
      }
    },
    getProfile: async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return {
        data: {
          id: 'user-123',
          email: 'admin@example.com',
          name: 'Admin',
        },
      }
    },
  },
  dashboard: {
    getStats: async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      return {
        data: {
          total_customers: 12543,
          high_risk_customers: 1245,
          low_risk_customers: 8920,
          avg_spend: 245.75,
          avg_churn_probability: 0.182,
          segmentation_chart: {
            'Premium': 2500,
            'Growth': 4200,
            'At-Risk': 3100,
            'New': 2743,
          },
          system_status: {
            logistic_regression: 'Active',
            decision_tree: 'Active',
            kmeans: 'Active',
            scalers: 'Active',
          },
        },
      }
    },
  },
  predictions: {
    predictChurn: async (data: Record<string, unknown>) => {
      await new Promise(resolve => setTimeout(resolve, 1200))
      const probability = Math.random() * 0.8 + 0.05
      const segments = ['Premium', 'Growth', 'At-Risk', 'New']
      const segment = segments[Math.floor(Math.random() * segments.length)]
      
      return {
        data: {
          churn_probability: probability,A
          customer_segment: segment,
          ai_insights: [
            'Customer shows declining engagement over last 30 days',
            'Support ticket volume is above average for segment',
            'Cart abandonment rate indicates price sensitivity',
            'Session duration trending downward',
          ],
          business_recommendations: [
            'Offer personalized discount or loyalty reward',
            'Schedule proactive customer support check-in',
            'Recommend relevant products based on purchase history',
            'Increase engagement through targeted email campaigns',
          ],
        },
      }
    },
    segmentCustomers: async (data: Record<string, unknown>) => {
      await new Promise(resolve => setTimeout(resolve, 1400))
      return {
        data: {
          predicted_cluster: 'Premium',
          retention_recommendations: [
            'Focus on VIP retention programs',
            'Provide exclusive early access to new products',
            'Offer premium support tier',
            'Create personalized product bundles',
          ],
        },
      }
    },
  },
  datasets: {
    upload: async (file: File) => {
      await new Promise(resolve => setTimeout(resolve, 800))
      return {
        data: {
          id: 'dataset-' + Date.now(),
          filename: file.name,
          total_rows: Math.floor(Math.random() * 50000) + 1000,
          detected_columns: ['customer_id', 'email', 'age', 'total_orders', 'total_spend'],
          uploadedAt: new Date().toISOString(),
        },
      }
    },
  },
}
