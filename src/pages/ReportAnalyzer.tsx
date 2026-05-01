import { useState, useRef } from 'react'
import { Upload, FileText, X, CheckCircle2, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react'

interface AnalyzedReport {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: Date
  status: 'analyzing' | 'completed' | 'error'
  summary?: string
  findings?: Finding[]
}

interface Finding {
  category: 'normal' | 'attention' | 'critical'
  title: string
  description: string
}

const mockFindings: Record<string, Finding[]> = {
  'Blood Test': [
    { category: 'normal', title: 'Hemoglobin', description: '13.8 g/dL — Within normal range (13.5-17.5)' },
    { category: 'normal', title: 'White Blood Cells', description: '7.2 K/uL — Normal (4.5-11.0)' },
    { category: 'attention', title: 'Vitamin D', description: '22 ng/mL — Slightly low. Consider supplementation or increased sun exposure.' },
    { category: 'normal', title: 'Cholesterol Total', description: '185 mg/dL — Desirable level (<200)' },
    { category: 'attention', title: 'LDL Cholesterol', description: '128 mg/dL — Borderline high. Dietary improvements recommended.' },
  ],
  'X-Ray': [
    { category: 'normal', title: 'Lung Fields', description: 'Clear bilaterally. No evidence of infiltrates or masses.' },
    { category: 'normal', title: 'Cardiac Silhouette', description: 'Normal size and contour.' },
    { category: 'attention', title: 'Mild Degenerative Changes', description: 'Minor arthritic changes noted in thoracic spine. Common with age.' },
  ],
  'ECG': [
    { category: 'normal', title: 'Heart Rate', description: '72 bpm — Normal sinus rhythm.' },
    { category: 'normal', title: 'PR Interval', description: '160 ms — Within normal range.' },
    { category: 'normal', title: 'QRS Duration', description: '88 ms — Normal ventricular conduction.' },
  ],
}

const mockSummaries: Record<string, string> = {
  'Blood Test': 'Overall, your blood work shows mostly normal results. Two markers warrant attention: Vitamin D is slightly below optimal levels, and LDL cholesterol is at the upper end of the desirable range. Consider dietary adjustments and discussing vitamin D supplementation with your doctor.',
  'X-Ray': 'The chest X-ray appears largely unremarkable. Lungs are clear and heart size is normal. Mild degenerative changes in the spine are noted but are common and typically not clinically significant.',
  'ECG': 'Your ECG demonstrates normal sinus rhythm with no significant abnormalities. All intervals and waveforms appear within normal limits.',
}

export default function ReportAnalyzer() {
  const [reports, setReports] = useState<AnalyzedReport[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [expandedReport, setExpandedReport] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const generateMockReport = (file: File): AnalyzedReport => {
    const types = ['Blood Test', 'X-Ray', 'ECG']
    const type = types[Math.floor(Math.random() * types.length)]
    return {
      id: Date.now().toString(),
      name: file.name,
      type,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date(),
      status: 'analyzing',
    }
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const report = generateMockReport(file)
      setReports((prev) => [report, ...prev])

      // Simulate analysis
      setTimeout(() => {
        setReports((prev) =>
          prev.map((r) =>
            r.id === report.id
              ? {
                  ...r,
                  status: 'completed',
                  summary: mockSummaries[r.type],
                  findings: mockFindings[r.type],
                }
              : r
          )
        )
      }, 3000)
    })
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  const categoryStyles = {
    normal: 'bg-green-50 border-green-200 text-green-800',
    attention: 'bg-amber-50 border-amber-200 text-amber-800',
    critical: 'bg-red-50 border-red-200 text-red-800',
  }

  const categoryIcons = {
    normal: CheckCircle2,
    attention: AlertTriangle,
    critical: AlertTriangle,
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report Analyzer</h1>
        <p className="text-gray-500 mt-1">Upload medical reports for AI-powered analysis and summary</p>
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-8 ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className={`w-12 h-12 mx-auto mb-3 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
        <p className="font-medium text-gray-900">Drop files here or click to upload</p>
        <p className="text-sm text-gray-500 mt-1">Supports PDF, JPG, PNG up to 10MB</p>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No reports uploaded yet</p>
            <p className="text-gray-400 text-sm mt-1">Upload a medical report to get started</p>
          </div>
        )}

        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
          >
            <div className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900 truncate">{report.name}</p>
                  {report.status === 'analyzing' && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full animate-pulse">
                      Analyzing...
                    </span>
                  )}
                  {report.status === 'completed' && (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {report.type} · {report.size} · {report.uploadedAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {report.status === 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedReport(expandedReport === report.id ? null : report.id)
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {expandedReport === report.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(report.id)
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            {expandedReport === report.id && report.status === 'completed' && (
              <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                {report.summary && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-primary-600" />
                      <h3 className="font-semibold text-gray-900">AI Summary</h3>
                    </div>
                    <p className="text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-100">
                      {report.summary}
                    </p>
                  </div>
                )}

                {report.findings && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Key Findings</h3>
                    <div className="space-y-2">
                      {report.findings.map((finding, idx) => {
                        const Icon = categoryIcons[finding.category]
                        return (
                          <div
                            key={idx}
                            className={`flex items-start gap-3 p-3 rounded-xl border ${categoryStyles[finding.category]}`}
                          >
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm">{finding.title}</p>
                              <p className="text-sm opacity-80 mt-0.5">{finding.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-700 flex items-start gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    This analysis is generated by AI for informational purposes only and should not replace professional medical advice. Always consult your healthcare provider for interpretation of medical reports.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
