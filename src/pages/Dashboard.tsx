import { useState, useEffect } from 'react'
import {
  Heart,
  Activity,
  Moon,
  Flame,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  FileText
} from 'lucide-react'

interface VitalCardProps {
  title: string
  value: string
  unit: string
  icon: React.ElementType
  trend: 'up' | 'down' | 'stable'
  trendValue: string
  color: string
}

function VitalCard({ title, value, unit, icon: Icon, trend, trendValue, color }: VitalCardProps) {
  const trendColors = {
    up: 'text-red-500',
    down: 'text-green-500',
    stable: 'text-gray-500'
  }
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${trendColors[trend]}`}>
          <TrendIcon className="w-4 h-4" />
          {trendValue}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{unit}</p>
      </div>
      <p className="text-sm text-gray-600 mt-2">{title}</p>
    </div>
  )
}

interface HealthTipProps {
  title: string
  description: string
  type: 'good' | 'warning' | 'info'
}

function HealthTip({ title, description, type }: HealthTipProps) {
  const colors = {
    good: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  const icons = {
    good: CheckCircle2,
    warning: AlertCircle,
    info: AlertCircle
  }
  const Icon = icons[type]

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${colors[type]}`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm opacity-80 mt-1">{description}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{greeting}, Alex</h1>
        <p className="text-gray-500 mt-1">Here's your health overview for today</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <a href="/assistant" className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
            <Activity className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">Check Symptoms</p>
            <p className="text-xs text-gray-500">AI-powered triage</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-primary-500 transition-colors" />
        </a>
        <a href="/tracker" className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Heart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">Log Vitals</p>
            <p className="text-xs text-gray-500">Track measurements</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-primary-500 transition-colors" />
        </a>
        <a href="/reports" className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all flex items-center gap-3 group">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">Upload Report</p>
            <p className="text-xs text-gray-500">Analyze documents</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-primary-500 transition-colors" />
        </a>
        <a href="/insights" className="bg-white rounded-xl p-4 border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all flex items-center gap-3 group">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
            <Flame className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">View Insights</p>
            <p className="text-xs text-gray-500">Personalized tips</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-primary-500 transition-colors" />
        </a>
      </div>

      {/* Vitals Grid */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Vitals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <VitalCard
          title="Heart Rate"
          value="72"
          unit="bpm"
          icon={Heart}
          trend="stable"
          trendValue="Normal"
          color="bg-rose-500"
        />
        <VitalCard
          title="Blood Pressure"
          value="118/78"
          unit="mmHg"
          icon={Activity}
          trend="down"
          trendValue="-3%"
          color="bg-blue-500"
        />
        <VitalCard
          title="Sleep"
          value="7h 24m"
          unit="last night"
          icon={Moon}
          trend="up"
          trendValue="+45m"
          color="bg-indigo-500"
        />
        <VitalCard
          title="Calories"
          value="1,840"
          unit="kcal burned"
          icon={Flame}
          trend="up"
          trendValue="+12%"
          color="bg-amber-500"
        />
      </div>

      {/* Health Tips */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Health Insights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HealthTip
          type="good"
          title="Heart rate variability is excellent"
          description="Your HRV has been consistently in the top 15% for your age group over the past week."
        />
        <HealthTip
          type="info"
          title="Consider increasing water intake"
          description="Based on your activity levels today, aim for an additional 500ml of water before bedtime."
        />
        <HealthTip
          type="warning"
          title="Slightly elevated evening screen time"
          description="Reducing screen exposure 1 hour before bed could improve your deep sleep by up to 20%."
        />
        <HealthTip
          type="good"
          title="Weekly activity goal achieved"
          description="You've reached 150 minutes of moderate activity this week. Keep it up!"
        />
      </div>
    </div>
  )
}


