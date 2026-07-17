import React, { useEffect, useState } from 'react'
import { 
  Zap, 
  Users, 
  TrendingUp, 
  Award, 
  Target, 
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BarChart3,
  PieChart
} from 'lucide-react'
import { Header } from '../components/Header'
import { Card } from '../components/ui/Card'
import { segmentationApi } from '../services/api'
import { useToast } from '../hooks/useToast'

interface KPICard {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
}

interface Segment {
  name: string
  customers: number
  percentage: number
  color: string
  characteristics: string[]
}

interface Insight {
  icon: React.ReactNode
  text: string
}

interface Recommendation {
  icon: React.ReactNode
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

interface SegmentationAnalysis {
  total_customers: number
  total_segments: number
  largest_segment: string
  segment_distribution: {
    name: string
    customers: number
    percentage: number
  }[]
}

export const Segmentation: React.FC = () => {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<SegmentationAnalysis | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await segmentationApi.getAnalysis()
        setAnalysisData(response.data)
      } catch (error) {
        console.error('[v0] Segmentation error:', error)
        addToast('Failed to load segmentation analysis', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [addToast])

  // Generate segments from backend data
  const segments: Segment[] =
  analysisData?.segment_distribution.map((segment, index) => ({
    ...segment,
    color: [
      'bg-blue-500/20',
      'bg-purple-500/20',
      'bg-green-500/20',
      'bg-orange-500/20'
    ][index] || 'bg-blue-500/20',
    characteristics: [
      'N/A',
      'N/A',
      'N/A',
      'N/A'
    ]
  })) ?? []

  // Calculate KPI data from backend response
const generateKPIData = (): KPICard[] => {
  if (!analysisData) return []

  return [
    {
      label: 'Total Customers',
      value: analysisData.total_customers.toLocaleString(),
      icon: <Users className="w-5 h-5" />,
      color: 'from-primary to-blue-500'
    },
    {
      label: 'Number of Segments',
      value: analysisData.total_segments,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-accent-purple to-purple-500'
    },
    {
      label: 'Largest Segment',
      value: analysisData.largest_segment,
      icon: <Award className="w-5 h-5" />,
      color: 'from-accent-green to-green-500'
    },
    {
      label: 'Analysis Status',
      value: 'Complete',
      icon: <Target className="w-5 h-5" />,
      color: 'from-orange-400 to-orange-500'
    }
  ]
}

  const kpiData = generateKPIData()
  

  // Static data for insights and recommendations (unchanged)
  
  const staticInsights: Insight[] = [
    {
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      text: 'VIP customers contribute 52% of total revenue despite being only 18.4% of the customer base'
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-danger" />,
      text: 'At-Risk customers show 45% churn probability with declining engagement over the last 90 days'
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-accent-green" />,
      text: 'Loyal customers have a 12x higher lifetime value compared to At-Risk customers'
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-warning" />,
      text: 'Regular customers have untapped potential—targeted campaigns could convert 15-20% into Loyal tier'
    }
  ]

  const staticRecommendations: Recommendation[] = [
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Launch Retention Campaign for At-Risk',
      description: 'Deploy personalized re-engagement offers and loyalty rewards to prevent churn',
      priority: 'high'
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'VIP Loyalty Program Enhancement',
      description: 'Exclusive perks, early access to new products, and premium support for VIP tier',
      priority: 'high'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Upsell Regular to Loyal Customers',
      description: 'Targeted personalized offers and cross-sell campaigns to increase purchase frequency',
      priority: 'medium'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Convert Loyal to VIP Tier',
      description: 'Identify high-potential Loyal customers and offer premium membership benefits',
      priority: 'medium'
    }
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-danger/20 text-danger border border-danger/30'
      case 'medium':
        return 'bg-warning/20 text-warning border border-warning/30'
      default:
        return 'bg-accent-green/20 text-accent-green border border-accent-green/30'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Customer Segmentation Analysis" 
        subtitle="AI-powered clustering of the uploaded customer dataset"
      />

      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-accent-green rounded-full animate-pulse" />
          <span className="text-sm text-text-secondary">
            <span className="font-semibold text-accent-green">Dataset Loaded</span>
            <span className="mx-2 text-text-tertiary">•</span>
            <span className="font-semibold text-primary">KMeans Model</span>
            <span className="mx-2 text-text-tertiary">•</span>
            <span className="font-semibold text-accent-green">AI Analysis Complete</span>
          </span>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-32 bg-surface-alt rounded-lg" />
              </Card>
            ))
          ) : kpiData.length > 0 ? (
            kpiData.map((kpi, index) => (
              <Card key={index} className="border-0 shadow-xs hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${kpi.color} text-white`}>
                    {kpi.icon}
                  </div>
                </div>
                <p className="text-text-tertiary text-xs uppercase tracking-wide font-medium mb-1">
                  {kpi.label}
                </p>
                <p className="text-3xl font-bold text-text-primary">
                  {kpi.value}
                </p>
              </Card>
            ))
          ) : (
            <Card className="col-span-full text-center py-8">
              <p className="text-text-tertiary">No segmentation data available</p>
            </Card>
          )}
        </div>

        {/* Segment Distribution Cards */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Customer Segments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-surface-alt rounded-lg" />
                </Card>
              ))
            ) : segments.length > 0 ? (
              segments.map((segment, index) => (
                <Card key={index} className={`border-0 shadow-xs hover:shadow-lg transition-all duration-300 ${segment.color} border-l-4 border-l-primary`}>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-lg font-bold text-text-primary">{segment.name}</h3>
                      <span className="text-sm font-semibold text-primary text-right">
                        {segment.percentage}%
                      </span>
                    </div>
                    <p className="text-sm text-text-tertiary">
                      {segment.customers.toLocaleString()} customers
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-border/30 space-y-2">
                    {segment.characteristics.map((char, charIndex) => (
                      <div key={charIndex} className="flex items-start gap-2">
                        <span className="text-primary font-bold mt-0.5 flex-shrink-0">•</span>
                        <p className="text-xs text-text-secondary leading-relaxed">{char}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="col-span-full text-center py-8">
                <p className="text-text-tertiary">No segment data available</p>
              </Card>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doughnut Chart Placeholder */}
          <Card className="border-0 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Segment Distribution
                </h3>
              </div>
            </div>
            <div className="h-64 bg-surface-subtle rounded-xl border border-border/30 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full border-8 border-primary/20 border-t-primary border-r-accent-purple border-b-accent-green mb-4 animate-spin" style={{ animationDuration: '3s' }} />
                <p className="text-sm text-text-tertiary">Interactive doughnut chart</p>
              </div>
            </div>
          </Card>

          {/* Horizontal Bar Chart Placeholder */}
          <Card className="border-0 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent-purple" />
                  Segment Sizes
                </h3>
              </div>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="h-48 bg-surface-alt rounded-lg animate-pulse" />
              ) : segments.length > 0 ? (
                segments.map((segment, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-text-secondary">{segment.name}</span>
                      <span className="text-xs text-text-tertiary">{segment.customers.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-surface-alt rounded-full overflow-hidden border border-border/20">
                      <div 
                        className={`h-full bg-gradient-to-r from-primary to-accent-purple rounded-full transition-all duration-500`}
                        style={{ width: `${segment.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-text-tertiary text-sm text-center py-8">No segment data available</p>
              )}
            </div>
          </Card>
        </div>

        {/* AI Insights */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-primary" />
            AI Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {staticInsights.map((insight, index) => (
              <Card key={index} className="border-0 shadow-xs border-l-4 border-l-primary hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10">
                    {insight.icon}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {insight.text}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Business Recommendations */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-accent-green" />
            Recommended Business Actions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {staticRecommendations.map((rec, index) => (
              <Card key={index} className="border-0 shadow-xs hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                    {rec.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-bold text-text-primary text-sm">
                        {rec.title}
                      </h4>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getPriorityBadge(rec.priority)}`}>
                        {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-text-tertiary leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
