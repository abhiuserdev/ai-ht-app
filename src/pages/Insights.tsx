import { useState } from 'react'
import {
  Lightbulb,
  Target,
  TrendingUp,
  Heart,
  Moon,
  Footprints,
  Droplets,
  Apple,
  ChevronRight,
  CheckCircle2,
  Circle
} from 'lucide-react'

interface Insight {
  id: string
  category: 'fitness' | 'nutrition' | 'sleep' | 'mental' | 'preventive'
  title: string
  description: string
  actionable: string
  difficulty: 'easy' | 'medium' | 'hard'
  impact: 'high' | 'medium' | 'low'
}

interface Habit {
  id: string
  title: string
  icon: React.ElementType
  completed: boolean
  streak: number
}

const insights: Insight[] = [
  {
    id: '1',
    category: 'sleep',
    title: 'Optimize Your Sleep Schedule',
    description: 'Your data shows you sleep 45 minutes longer on weekends, indicating social jetlag. Consistent bedtimes can improve sleep quality by 30%.',
    actionable: 'Set a fixed bedtime alarm for 10:30 PM every night, including weekends.',
    difficulty: 'medium',
    impact: 'high',
  },
  {
    id: '2',
    category: 'nutrition',
    title: 'Increase Protein at Breakfast',
    description: 'Meals logged show low morning protein. Starting with 20-30g protein stabilizes blood sugar and reduces cravings later.',
    actionable: 'Add eggs, Greek yogurt, or a protein smoothie to your breakfast routine.',
    difficulty: 'easy',
    impact: 'medium',
  },
  {
    id: '3',
    category: 'fitness',
    title: 'Add Zone 2 Cardio',
    description: 'Most of your exercise is high intensity. Adding 2-3 sessions of low-intensity Zone 2 cardio weekly can improve metabolic health and recovery.',
    actionable: 'Take a 30-45 minute brisk walk or easy bike ride twice this week.',
    difficulty: 'easy',
    impact: 'high',
  },
  {
    id: '4',
    category: 'preventive',
    title: 'Schedule Annual Physical',
    description: "It's been 14 months since your last comprehensive checkup. Regular screenings catch issues early when they're most treatable.",
    actionable: 'Book an appointment with your primary care physician this month.',
    difficulty: 'easy',
    impact: 'high',
  },
  {
    id: '5',
    category: 'mental',
    title: 'Practice Box Breathing',
    description: 'Stress markers suggest elevated cortisol patterns. Box breathing (4-4-4-4) for 5 minutes reduces stress hormones quickly.',
    actionable: 'Practice box breathing before meetings or whenever you feel tension.',
    difficulty: 'easy',
    impact: 'medium',
  },
  {
    id: '6',
    category: 'nutrition',
    title: 'Hydration Timing',
    description: 'Your water intake is front-loaded. Spreading hydration throughout the day improves cognitive function and energy levels.',
    actionable: 'Set reminders to drink 250ml of water at 10 AM, 2 PM, and 4 PM.',
    difficulty: 'easy',
    impact: 'medium',
  },
]

const categoryConfig = {
  fitness: { icon: Footprints, color: 'bg-orange-50 text-orange-600', label: 'Fitness' },
  nutrition: { icon: Apple, color: 'bg-green-50 text-green-600', label: 'Nutrition' },
  sleep: { icon: Moon, color: 'bg-indigo-50 text-indigo-600', label: 'Sleep' },
  mental: { icon: Heart, color: 'bg-rose-50 text-rose-600', label: 'Mental Health' },
  preventive: { icon: Target, color: 'bg-blue-50 text-blue-600', label: 'Preventive Care' },
}

const difficultyColors = {
  easy: 'text-green-600 bg-green-50',
  medium: 'text-amber-600 bg-amber-50',
  hard: 'text-red-600 bg-red-50',
}

const impactColors = {
  high: 'text-primary-600 bg-primary-50',
  medium: 'text-blue-600 bg-blue-50',
  low: 'text-gray-600 bg-gray-50',
}

export default function Insights() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Drink 2L water', icon: Droplets, completed: true, streak: 5 },
    { id: '2', title: 'Walk 8,000 steps', icon: Footprints, completed: true, streak: 12 },
    { id: '3', title: 'Sleep 7+ hours', icon: Moon, completed: false, streak: 0 },
    { id: '4', title: 'Eat 5 servings of vegetables', icon: Apple, completed: false, streak: 2 },
    { id: '5', title: '10 min meditation', icon: Heart, completed: true, streak: 3 },
  ])

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : Math.max(0, h.streak - 1) }
          : h
      )
    )
  }

  const filteredInsights =
    activeCategory === 'all'
      ? insights
      : insights.filter((i) => i.category === activeCategory)

  const categories = ['all', ...Array.from(new Set(insights.map((i) => i.category)))]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Health Insights</h1>
        <p className="text-gray-500 mt-1">Personalized recommendations based on your health data</p>
      </div>

      {/* Daily Habits */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Habits</h2>
          <div className="flex items-center gap-1 text-sm text-primary-600">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">
              {habits.filter((h) => h.completed).length}/{habits.length} completed
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {habits.map((habit) => {
            const Icon = habit.icon
            return (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  habit.completed
                    ? 'bg-primary-50 border-primary-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                {habit.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${habit.completed ? 'text-primary-700' : 'text-gray-700'}`}>
                    {habit.title}
                  </p>
                  {habit.streak > 0 && (
                    <p className="text-xs text-gray-500">
                      {habit.streak} day streak 🔥
                    </p>
                  )}
                </div>
                <Icon className={`w-4 h-4 flex-shrink-0 ${habit.completed ? 'text-primary-400' : 'text-gray-400'}`} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-primary-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat === 'all' ? 'All Insights' : categoryConfig[cat as keyof typeof categoryConfig]?.label || cat}
          </button>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.map((insight) => {
          const config = categoryConfig[insight.category]
          const Icon = config.icon
          return (
            <div
              key={insight.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[insight.difficulty]}`}>
                      {insight.difficulty}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${impactColors[insight.impact]}`}>
                      {insight.impact} impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Actionable Step</p>
                        <p className="text-sm text-gray-800 mt-1">{insight.actionable}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-1" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
