import { useState } from 'react'
import { Plus, X, TrendingUp, Droplets, Scale, Ruler } from 'lucide-react'

interface VitalEntry {
  id: string
  type: string
  value: string
  unit: string
  timestamp: Date
  notes?: string
}

const vitalTypes = [
  { label: 'Heart Rate', unit: 'bpm', icon: TrendingUp },
  { label: 'Blood Pressure', unit: 'mmHg', icon: TrendingUp },
  { label: 'Weight', unit: 'kg', icon: Scale },
  { label: 'Height', unit: 'cm', icon: Ruler },
  { label: 'Blood Glucose', unit: 'mg/dL', icon: Droplets },
  { label: 'Temperature', unit: '°C', icon: TrendingUp },
  { label: 'Oxygen Saturation', unit: '%', icon: TrendingUp },
  { label: 'Sleep', unit: 'hours', icon: TrendingUp },
]

export default function HealthTracker() {
  const [entries, setEntries] = useState<VitalEntry[]>([
    { id: '1', type: 'Heart Rate', value: '72', unit: 'bpm', timestamp: new Date(Date.now() - 3600000), notes: 'Resting' },
    { id: '2', type: 'Blood Pressure', value: '118/78', unit: 'mmHg', timestamp: new Date(Date.now() - 7200000) },
    { id: '3', type: 'Weight', value: '72.5', unit: 'kg', timestamp: new Date(Date.now() - 86400000) },
    { id: '4', type: 'Blood Glucose', value: '95', unit: 'mg/dL', timestamp: new Date(Date.now() - 172800000), notes: 'Fasting' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [selectedType, setSelectedType] = useState(vitalTypes[0])
  const [value, setValue] = useState('')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return

    const newEntry: VitalEntry = {
      id: Date.now().toString(),
      type: selectedType.label,
      value: value.trim(),
      unit: selectedType.unit,
      timestamp: new Date(),
      notes: notes.trim() || undefined,
    }

    setEntries((prev) => [newEntry, ...prev])
    setValue('')
    setNotes('')
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Tracker</h1>
          <p className="text-gray-500 mt-1">Log and monitor your vital signs</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Entry'}
        </button>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vital Type</label>
                <select
                  value={selectedType.label}
                  onChange={(e) => {
                    const type = vitalTypes.find((t) => t.label === e.target.value)
                    if (type) setSelectedType(type)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {vitalTypes.map((type) => (
                    <option key={type.label} value={type.label}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value ({selectedType.unit})
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={`Enter ${selectedType.label.toLowerCase()}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional context..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
              >
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No entries yet</p>
            <p className="text-gray-400 text-sm mt-1">Start tracking your health data</p>
          </div>
        ) : (
          entries.map((entry) => {
            const typeInfo = vitalTypes.find((t) => t.label === entry.type)
            const Icon = typeInfo?.icon || TrendingUp
            return (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{entry.type}</p>
                    {entry.notes && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate">
                        {entry.notes}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{formatTime(entry.timestamp)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-gray-900">{entry.value}</p>
                  <p className="text-xs text-gray-500">{entry.unit}</p>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
