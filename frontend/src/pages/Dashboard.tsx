import React, { useEffect, useState } from 'react'
import { Users, AlertTriangle, TrendingDown, DollarSign, Activity, Zap, Database, CheckCircle, Server, Cpu, BarChart3 } from 'lucide-react'
import { Header } from '../components/Header'
import { Card } from '../components/ui/Card'
import { dashboardApi } from '../services/api'
import { useToast } from '../hooks/useToast'

interface CustomerOverview {
  total_customers: number
  high_risk_customers: number
  low_risk_customers: number
  average_customer_spend: number
  average_churn_probability: number
  average_customer_age: number
}

interface Segmentation {
  total_segments: number
  segment_distribution: Record<string, number>
  largest_segment: string
}

interface ModelStatus {
  logistic_regression: string
  decision_tree: string
  kmeans: string
  churn_scaler: string
  segmentation_scaler: string
  encoder: string
  model_version: string
  last_loaded: string
}

interface SystemHealth {
  api_status: string
  authentication_status: string
  model_service_status: string
  database_status: string
}

interface DashboardStats {
  customer_overview: CustomerOverview
  segmentation: Segmentation
  model_status: ModelStatus
  system_health: SystemHealth
  prediction_summary?: Record<string, unknown>
}

export const Dashboard: React.FC = () => {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await dashboardApi.getStats()
        setStats(response.data)
      } catch (error) {
        console.error('[v0] Dashboard error:', error)
        addToast('Failed to load dashboard data', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [addToast])

  const KPICard = ({ 
    icon: Icon, 
    label, 
    value, 
    trend,
    gradient = 'from-primary to-blue-500'
  }: { 
    icon: React.ReactNode
    label: string
    value: string | number
    trend?: 'up' | 'down'
    gradient?: string
  }) => (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex-1">
          <p className="text-text-tertiary text-xs uppercase tracking-wider font-semibold mb-3 opacity-80">{label}</p>
          <p className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-3`}>
            {value}
          </p>
          {trend && (
            <div className={`text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-lg ${
              trend === 'up' ? 'bg-accent-green/20 text-accent-green' : 'bg-danger/20 text-danger'
            }`}>
              <span className="mr-1">{trend === 'up' ? '↑' : '↓'}</span>
              {trend === 'up' ? 'Improving' : 'Declining'}
            </div>
          )}
        </div>
        <div className={`flex-shrink-0 p-3.5 rounded-2xl bg-gradient-to-br ${gradient} text-white opacity-90 group-hover:opacity-100 transition-opacity`}>
          {Icon}
        </div>
      </div>
    </Card>
  )

  const SegmentBar = ({ 
    name, 
    value, 
    total 
  }: { 
    name: string
    value: number
    total: number
  }) => {
    const percentage = (value / total) * 100
    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">{name}</span>
          <span className="text-sm text-text-tertiary">{percentage.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 bg-surface-alt rounded-full overflow-hidden border border-border/30">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent-purple rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  const SystemIndicator = ({ 
    name, 
    status 
  }: { 
    name: string
    status: string
  }) => {
    const isActive = status?.toLowerCase() === 'active' || !status
    return (
      <div className="flex items-center justify-between p-3.5 bg-surface/40 rounded-xl border border-border/30 hover:border-border/60 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-accent-green' : 'bg-warning'} animate-pulse`} />
          <span className="text-sm font-medium text-text-secondary">{name}</span>
        </div>
        <span className="text-xs text-text-tertiary">{status || 'Active'}</span>
      </div>
    )
  }

  const AIInsightCard = ({ 
    title, 
    description,
    icon: Icon,
    accent = 'from-primary'
  }: { 
    title: string
    description: string
    icon: React.ReactNode
    accent?: string
  }) => (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 p-2.5 rounded-lg bg-gradient-to-br ${accent} to-purple-500 text-white opacity-90`}>
          {Icon}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-text-primary mb-1">{title}</h4>
          <p className="text-xs text-text-tertiary leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard" subtitle="Real-time customer intelligence and analytics" />

      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Hero KPI Section */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-surface-alt rounded-lg" />
                </Card>
              ))
            ) : stats ? (
              <>
                <KPICard
                  icon={<Users className="w-6 h-6" />}
                  label="Total Customers"
                  value={stats.customer_overview.total_customers?.toLocaleString() || '0'}
                  gradient="from-primary to-blue-500"
                />
                <KPICard
                  icon={<AlertTriangle className="w-6 h-6" />}
                  label="High Risk"
                  value={stats.customer_overview.high_risk_customers || '0'}
                  trend="down"
                  gradient="from-danger to-red-500"
                />
                <KPICard
                  icon={<TrendingDown className="w-6 h-6" />}
                  label="Low Risk"
                  value={stats.customer_overview.low_risk_customers || '0'}
                  trend="up"
                  gradient="from-accent-green to-green-500"
                />
                <KPICard
                  icon={<DollarSign className="w-6 h-6" />}
                  label="Avg Spend"
                  value={`$${stats.customer_overview.average_customer_spend?.toFixed(2) || '0.00'}`}
                  gradient="from-accent-purple to-purple-500"
                />
                <KPICard
                  icon={<Activity className="w-6 h-6" />}
                  label="Avg Churn"
                  value={`${(stats.customer_overview.average_churn_probability * 100).toFixed(1)}%`}
                  gradient="from-warning to-orange-500"
                />
              </>
            ) : (
              <Card className="col-span-full text-center py-12">
                <p className="text-text-tertiary">Failed to load statistics</p>
              </Card>
            )}
          </div>
        </section>

        {/* Analytics Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Segmentation Distribution */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">Customer Segmentation</h3>
                </div>
              </div>

              {isLoading ? (
                <div className="h-64 bg-surface-alt/40 rounded-xl flex items-center justify-center">
                  <div className="text-text-tertiary">Loading segmentation data...</div>
                </div>
              ) : stats?.segmentation && Object.keys(stats.segmentation.segment_distribution).length > 0 ? (
                <div className="space-y-6">
                  {/* Segmentation Bars */}
                  <div>
                    {(() => {
                      const total = Object.values(stats.segmentation.segment_distribution).reduce((a, b) => a + b, 0)
                      return Object.entries(stats.segmentation.segment_distribution).map(([name, value]) => (
                        <SegmentBar key={name} name={name} value={value} total={total} />
                      ))
                    })()}
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {stats.segmentation.total_segments}
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">Segments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-purple">
                        {Object.values(stats.segmentation.segment_distribution).reduce((a, b) => a + b, 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-green">
                        {Math.max(...Object.values(stats.segmentation.segment_distribution)).toLocaleString()}
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">Largest</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-surface-alt/40 rounded-xl flex items-center justify-center">
                  <div className="text-text-tertiary">No segmentation data available</div>
                </div>
              )}
            </Card>
          </div>

          {/* System Status */}
          <div>
            <Card className="border-0 shadow-lg h-full">
              <div className="mb-6 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">System Status</h3>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 bg-surface-alt rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <SystemIndicator name="API" status={stats.system_health.api_status} />
                  <SystemIndicator name="Authentication" status={stats.system_health.authentication_status} />
                  <SystemIndicator name="Model Service" status={stats.system_health.model_service_status} />
                  <SystemIndicator name="Database" status={stats.system_health.database_status} />
                </div>
              )}
            </Card>
          </div>
        </section>

        {/* AI Insights Section */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">AI Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-32 bg-surface-alt rounded-lg" />
                </Card>
              ))
            ) : stats ? (
              <>
                <AIInsightCard
                  title="High Risk Customers"
                  description={`${stats.customer_overview.high_risk_customers} customers identified as high risk. Focus retention efforts on this segment.`}
                  icon={<AlertTriangle className="w-4 h-4" />}
                  accent="from-danger"
                />
                <AIInsightCard
                  title="Low Risk Customers"
                  description={`${stats.customer_overview.low_risk_customers} customers showing strong engagement and low churn risk.`}
                  icon={<CheckCircle className="w-4 h-4" />}
                  accent="from-accent-green"
                />
                <AIInsightCard
                  title="Customer Value"
                  description={`Average spend: $${stats.customer_overview.average_customer_spend?.toFixed(2) || '0.00'} | Age: ${stats.customer_overview.average_customer_age?.toFixed(1) || '0'} years`}
                  icon={<DollarSign className="w-4 h-4" />}
                  accent="from-accent-purple"
                />
                <AIInsightCard
                  title="Model Status"
                  description={`v${stats.model_status.model_version} | Last loaded: ${new Date(stats.model_status.last_loaded).toLocaleDateString()}`}
                  icon={<Server className="w-4 h-4" />}
                  accent="from-primary"
                />
              </>
            ) : null}
          </div>
        </section>

      </div>
    </div>
  )
}
