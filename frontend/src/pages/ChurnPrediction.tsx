import { useState } from 'react'
import { Header } from '../components/Header'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { predictionApi } from '../services/api'
import { useToast } from '../hooks/useToast'
import { AlertCircle, TrendingUp, Zap, Target, Activity, Lightbulb, Download, History, ChevronDown, BarChart3 } from 'lucide-react'

interface ChurnPredictionResult {
  churn_probability: number
  customer_segment: string
  ai_insights: string[]
  business_recommendations: string[]
}

export const ChurnPrediction: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ChurnPredictionResult | null>(null)
  const { addToast } = useToast()
  const [expandedSections, setExpandedSections] = useState({
    behavioral: true,
    purchase: true,
    engagement: true,
    preferences: true,
  })

  const [formData, setFormData] = useState({
    age: '',
    total_orders: '',
    avg_order_value: '',
    total_spend: '',
    days_since_last_purchase: '',
    avg_orders_per_month: '',
    wishlist_items: '',
    cart_abandonment_rate: '',
    coupons_used: '',
    return_rate: '',
    app_sessions_per_month: '',
    avg_session_duration: '',
    customer_support_tickets: '',
    gender: 'M',
    membership: 'standard',
    payment_method: 'credit_card',
    preferred_shopping_time: 'evening',
    product_categories: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {

      console.log(formData)

      const payload = {
        Age: Number(formData.age),
        Gender: formData.gender,
        Membership: formData.membership,

        Total_Orders: Number(formData.total_orders),
        Average_Order_Value: Number(formData.avg_order_value),
        Total_Spend: Number(formData.total_spend),
        Days_Since_Last_Purchase: Number(formData.days_since_last_purchase),
        Average_Orders_Per_Month: Number(formData.avg_orders_per_month),
        Wishlist_Items: Number(formData.wishlist_items),
        Cart_Abandonment_Rate: Number(formData.cart_abandonment_rate),
        Coupons_Used: Number(formData.coupons_used),
        Return_Rate: Number(formData.return_rate),
        App_Sessions_Per_Month: Number(formData.app_sessions_per_month),
        Average_Session_Duration: Number(formData.avg_session_duration),
        Customer_Support_Tickets: Number(formData.customer_support_tickets),

        Product_Categories_Purchased: Number(formData.product_categories),

        Payment_Method: formData.payment_method,
        Preferred_Shopping_Time: formData.preferred_shopping_time,
      }

      const response = await predictionApi.predictChurn(payload)

      console.log(response.data)

      setResult(response.data)

      addToast("Prediction successful!", "success")
    } catch (err) {
      addToast("Failed to predict churn", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const churnRiskLevel =
    result && result.churn_probability > 0.7
      ? 'High'
      : result && result.churn_probability > 0.4
        ? 'Medium'
        : 'Low'

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-danger'
      case 'Medium':
        return 'text-warning'
      default:
        return 'text-success'
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-danger/20 border border-danger/40'
      case 'Medium':
        return 'bg-warning/20 border border-warning/40'
      default:
        return 'bg-success/20 border border-success/40'
    }
  }

  // Collapsible Section Component
  const CollapsibleSection = ({
    title,
    sectionKey,
    children
  }: {
    title: string
    sectionKey: keyof typeof expandedSections
    children: React.ReactNode
  }) => (
    <div className="border-b border-border/20 last:border-b-0">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between py-4 hover:bg-surface-alt/30 transition-colors px-1"
      >
        <div className="text-xs font-semibold text-primary uppercase tracking-wide">
          {title}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-text-tertiary transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`}
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Churn Prediction"
        subtitle="Predict customer churn risk with AI-powered analysis"
      />

      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Two-Column Layout: 35% Left / 65% Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* LEFT COLUMN - 35% */}
          <div className="lg:col-span-4 space-y-6">
            {/* Main Form Card */}
            <Card className="backdrop-blur-xl bg-surface/50 border border-border/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">
                  Predict Churn
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-0">
                {/* Behavioral Metrics */}
                <CollapsibleSection title="Customer" sectionKey="behavioral">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Age"
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                    />
                    <Input
                      label="Total Orders"
                      type="number"
                      name="total_orders"
                      value={formData.total_orders}
                      onChange={handleChange}
                      placeholder="15"
                    />
                    <Input
                      label="Avg Order Value"
                      type="number"
                      name="avg_order_value"
                      value={formData.avg_order_value}
                      onChange={handleChange}
                      step="0.01"
                      placeholder="125.50"
                    />
                    <Input
                      label="Total Spend"
                      type="number"
                      name="total_spend"
                      value={formData.total_spend}
                      onChange={handleChange}
                      step="0.01"
                      placeholder="1875.00"
                    />
                  </div>
                </CollapsibleSection>

                {/* Purchase Patterns */}
                <CollapsibleSection title="Purchase" sectionKey="purchase">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Days Since Purchase"
                      type="number"
                      name="days_since_last_purchase"
                      value={formData.days_since_last_purchase}
                      onChange={handleChange}
                      placeholder="15"
                    />
                    <Input
                      label="Orders/Month"
                      type="number"
                      name="avg_orders_per_month"
                      value={formData.avg_orders_per_month}
                      onChange={handleChange}
                      step="0.1"
                      placeholder="2.5"
                    />
                    <Input
                      label="Wishlist Items"
                      type="number"
                      name="wishlist_items"
                      value={formData.wishlist_items}
                      onChange={handleChange}
                      placeholder="8"
                    />
                    <Input
                      label="Cart Abandon Rate"
                      type="number"
                      name="cart_abandonment_rate"
                      value={formData.cart_abandonment_rate}
                      onChange={handleChange}
                      step="0.1"
                      placeholder="25.5"
                    />
                  </div>
                </CollapsibleSection>

                {/* Engagement Metrics */}
                <CollapsibleSection title="Engagement" sectionKey="engagement">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Coupons Used"
                      type="number"
                      name="coupons_used"
                      value={formData.coupons_used}
                      onChange={handleChange}
                      placeholder="5"
                    />
                    <Input
                      label="Return Rate"
                      type="number"
                      name="return_rate"
                      value={formData.return_rate}
                      onChange={handleChange}
                      step="0.1"
                      placeholder="10.2"
                    />
                    <Input
                      label="App Sessions"
                      type="number"
                      name="app_sessions_per_month"
                      value={formData.app_sessions_per_month}
                      onChange={handleChange}
                      placeholder="20"
                    />
                    <Input
                      label="Session Duration"
                      type="number"
                      name="avg_session_duration"
                      value={formData.avg_session_duration}
                      onChange={handleChange}
                      step="0.1"
                      placeholder="8.5"
                    />
                  </div>
                </CollapsibleSection>

                {/* Support & Preferences */}
                <CollapsibleSection title="Preferences" sectionKey="preferences">
                  <div className="space-y-3">
                    <Input
                      label="Support Tickets"
                      type="number"
                      name="customer_support_tickets"
                      value={formData.customer_support_tickets}
                      onChange={handleChange}
                      placeholder="2"
                    />

                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="glass w-full rounded-xl px-4 py-2.5 text-sm border border-border/50 hover:border-border focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                      >
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">
                        Membership
                      </label>
                      <select
                        name="membership"
                        value={formData.membership}
                        onChange={handleChange}
                        className="glass w-full rounded-xl px-4 py-2.5 text-sm border border-border/50 hover:border-border focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                      >
                        <option value="Basic">Basic</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">
                        Payment Method
                      </label>
                      <select
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleChange}
                        className="glass w-full rounded-xl px-4 py-2.5 text-sm border border-border/50 hover:border-border focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                      >
                        <option value="Credit_Card">Credit Card</option>
                        <option value="Debit_Card">Debit Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">
                        Shopping Time
                      </label>
                      <select
                        name="preferred_shopping_time"
                        value={formData.preferred_shopping_time}
                        onChange={handleChange}
                        className="glass w-full rounded-xl px-4 py-2.5 text-sm border border-border/50 hover:border-border focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                      >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                        <option value="night">Night</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">
                        Product Category
                      </label>
                      <select
                        name="product_categories"
                        value={formData.product_categories}
                        onChange={handleChange}
                        className="glass w-full rounded-xl px-4 py-2.5 text-sm border border-border/50 hover:border-border focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                      >
                        <option value="1">Category 1</option>
                        <option value="2">Category 2</option>
                        <option value="3">Category 3</option>
                        <option value="4">Category 4</option>
                        <option value="5">Category 5</option>
                        <option value="6">Category 6</option>
                      </select>
                    </div>
                  </div>
                </CollapsibleSection>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full mt-6 bg-gradient-to-r from-primary to-accent-purple hover:shadow-lg hover:shadow-primary/30"
                >
                  <Zap className="w-4 h-4" />
                  Analyze Customer
                </Button>
              </form>
            </Card>

            {/* Model Status Card */}
            <Card className="backdrop-blur-xl bg-surface/50 border border-border/50">
              <h3 className="text-sm font-bold text-text-primary mb-4">Model Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-tertiary">Model Version</span>
                  <span className="text-xs font-semibold text-primary">v2.1.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-tertiary">Avg Latency</span>
                  <span className="text-xs font-semibold text-accent-green">247ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-tertiary">System Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-accent-green">Operational</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN - 65% */}
          <div className="lg:col-span-8 space-y-6">

            {/* Main Results Panel */}
            <Card className="backdrop-blur-xl bg-surface/50 border border-border/50">
              <h2 className="text-xl font-bold text-text-primary mb-6">Analysis Results</h2>

              {result ? (
                <>
                  {/* Circular Probability Gauge */}
                  <div className="flex justify-center mb-8">
                    <div className="relative w-44 h-44">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                        <circle
                          cx="100"
                          cy="100"
                          r="90"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-surface-alt opacity-30"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r="90"
                          fill="none"
                          stroke="url(#gaugeGradient)"
                          strokeWidth="8"
                          strokeDasharray={`${(result.churn_probability / 1) * 565.48} 565.48`}
                          className="transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient
                            id="gaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#00d9ff" />
                            <stop offset="100%" stopColor="#b24bff" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent-purple bg-clip-text text-transparent">
                          {(result.churn_probability * 100).toFixed(1)}%
                        </div>
                        <div className="text-text-tertiary text-xs font-semibold uppercase tracking-wider mt-1">
                          Churn Risk
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Status & Segment */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card className={`backdrop-blur-xl border border-border/50 ${getRiskBgColor(churnRiskLevel)}`}>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="p-3 bg-background/40 rounded-lg mb-3">
                          <Activity className={`w-6 h-6 ${getRiskColor(churnRiskLevel)}`} />
                        </div>
                        <div className="text-text-tertiary text-xs uppercase tracking-wide font-semibold mb-2">
                          Risk Level
                        </div>
                        <div className={`text-2xl font-bold ${getRiskColor(churnRiskLevel)}`}>
                          {churnRiskLevel}
                        </div>
                      </div>
                    </Card>

                    <Card className="backdrop-blur-xl bg-gradient-to-br from-primary/10 to-accent-purple/10 border border-primary/20">
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="p-3 bg-primary/20 rounded-lg mb-3">
                          <Target className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-text-tertiary text-xs uppercase tracking-wide font-semibold mb-2">
                          Segment
                        </div>
                        <div className="text-lg font-bold text-primary text-center">
                          {result.customer_segment}
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* AI Insights Card */}
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-primary/5 to-accent-purple/5 border border-primary/20 border-l-4 border-l-primary mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-primary/20 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-base font-bold text-text-primary">AI Insights</h3>
                    </div>
                    <div className="space-y-2.5">
                      {result.ai_insights?.map((insight, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-surface-alt/50 border border-border/30 rounded-lg hover:border-primary/30 transition-all">
                          <div className="flex-shrink-0 w-1 bg-gradient-to-b from-primary to-accent-purple rounded-full" />
                          <p className="text-sm text-text-secondary leading-relaxed">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Recommendations Card */}
                  <Card className="backdrop-blur-xl bg-surface/50 border border-border/50 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 bg-accent-green/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-accent-green" />
                      </div>
                      <h3 className="text-base font-bold text-text-primary">Business Recommendations</h3>
                    </div>
                    <div className="space-y-2">
                      {result.business_recommendations?.map((rec, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-surface-alt/50 border border-border/30 rounded-lg hover:border-accent-green/30 transition-all">
                          <div className="flex-shrink-0 bg-accent-green/20 text-accent-green w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Action Row */}
                  <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1">
                      <Download className="w-4 h-4" />
                      Export Report
                    </Button>
                    <Button variant="secondary" className="flex-1">
                      <History className="w-4 h-4" />
                      View History
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Placeholder State */}
                  <div className="flex justify-center mb-8">
                    <div className="relative w-44 h-44">
                      <svg className="w-full h-full transform -rotate-90 opacity-40" viewBox="0 0 200 200">
                        <circle
                          cx="100"
                          cy="100"
                          r="90"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-surface-alt"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold text-text-tertiary opacity-50">—</div>
                        <div className="text-text-tertiary text-xs font-semibold uppercase tracking-wider mt-2 opacity-50">
                          Pending Analysis
                        </div>
                      </div>
                    </div>
                  </div>

                  <Card className="backdrop-blur-xl bg-gradient-to-br from-primary/5 to-accent-purple/5 border border-primary/20 border-l-4 border-l-primary">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-primary/20 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-primary opacity-50" />
                      </div>
                      <h3 className="text-base font-bold text-text-primary opacity-50">AI Insights</h3>
                    </div>
                    <p className="text-sm text-text-tertiary opacity-50">Fill in customer data and click "Analyze Customer" to generate AI insights</p>
                  </Card>

                  <Card className="backdrop-blur-xl bg-surface/50 border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-accent-green/20 rounded-lg opacity-50">
                        <AlertCircle className="w-5 h-5 text-accent-green" />
                      </div>
                      <h3 className="text-base font-bold text-text-primary opacity-50">Business Recommendations</h3>
                    </div>
                    <p className="text-sm text-text-tertiary opacity-50">Recommendations will appear after analysis is complete</p>
                  </Card>
                </div>
              )}
            </Card>

            {/* Feature Importance & Risk Trend */}
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Feature Importance */}
                <Card className="backdrop-blur-xl bg-surface/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-text-primary">Feature Importance</h3>
                  </div>
                  <div className="space-y-3">
                    {['Spending Pattern', 'Purchase Frequency', 'Support Tickets', 'Session Activity', 'Return Rate'].map((feature, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-text-secondary">{feature}</span>
                          <span className="text-xs font-semibold text-primary">{85 - i * 15}%</span>
                        </div>
                        <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent-purple rounded-full"
                            style={{ width: `${85 - i * 15}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Risk Trend */}
                <Card className="backdrop-blur-xl bg-surface/50 border border-border/50">
                  <h3 className="text-sm font-bold text-text-primary mb-5">Risk Trend</h3>
                  <div className="flex items-end justify-center gap-1.5 h-32">
                    {[45, 52, 48, 61, 58, 65, 72, (result.churn_probability * 100)].map((value, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary to-accent-purple rounded-t-lg transition-all hover:opacity-80"
                        style={{ height: `${(value / 100) * 100}%` }}
                        title={`${value.toFixed(1)}%`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-text-tertiary text-center mt-3">Last 8 Analyses</div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
