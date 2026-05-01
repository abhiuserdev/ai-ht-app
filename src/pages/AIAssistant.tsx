import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Stethoscope, Pill, Brain } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const mockResponses: Record<string, string> = {
  default: "I understand your concern. Based on what you've described, I'd recommend monitoring your symptoms and staying hydrated. If symptoms persist or worsen over the next 24-48 hours, please consult with a healthcare provider. Would you like me to help you track these symptoms?",
  headache: "Headaches can have many causes including dehydration, eye strain, stress, or tension. Try drinking water, resting in a dark room, and applying a cold or warm compress. If you experience sudden severe headache, vision changes, or confusion, seek immediate medical attention.",
  fever: "A fever is often a sign your body is fighting an infection. Rest, stay hydrated, and monitor your temperature. For adults, seek medical care if your fever reaches 103°F (39.4°C) or higher, or lasts more than 3 days.",
  cough: "A cough can be caused by viral infections, allergies, or irritants. Stay hydrated, use honey for throat soothing (if not allergic), and consider a humidifier. If you have difficulty breathing, chest pain, or cough up blood, seek care immediately.",
  fatigue: "Fatigue can result from poor sleep, stress, anemia, thyroid issues, or many other factors. Prioritize 7-9 hours of sleep, regular exercise, and a balanced diet. If fatigue persists for more than 2 weeks, consider scheduling a check-up.",
  stomach: "Stomach issues could be due to food intolerance, infection, or stress. Try bland foods (BRAT diet), stay hydrated with oral rehydration solutions, and avoid alcohol and caffeine. Seek care for severe pain, blood in stool, or persistent vomiting.",
}

function getResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('headache') || lower.includes('migraine')) return mockResponses.headache
  if (lower.includes('fever') || lower.includes('temperature')) return mockResponses.fever
  if (lower.includes('cough') || lower.includes('cold')) return mockResponses.cough
  if (lower.includes('tired') || lower.includes('fatigue') || lower.includes('exhausted')) return mockResponses.fatigue
  if (lower.includes('stomach') || lower.includes('nausea') || lower.includes('diarrhea')) return mockResponses.stomach
  return mockResponses.default
}

const quickPrompts = [
  { icon: Stethoscope, text: "I have a headache and slight fever" },
  { icon: Pill, text: "What are common side effects of antibiotics?" },
  { icon: Brain, text: "How can I improve my sleep quality?" },
]

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Health Assistant. I can help you understand symptoms, provide general health information, and guide you on when to seek professional care. Please describe how you're feeling or ask a health question.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = getResponse(text)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-500" />
          AI Health Assistant
        </h1>
        <p className="text-gray-500 text-sm mt-1">Not a substitute for professional medical advice</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-primary-500' : 'bg-gray-100'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length < 3 && (
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {quickPrompts.map((prompt, idx) => {
            const Icon = prompt.icon
            return (
              <button
                key={idx}
                onClick={() => handleSend(prompt.text)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-colors whitespace-nowrap"
              >
                <Icon className="w-4 h-4 text-primary-500" />
                {prompt.text}
              </button>
            )
          })}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your symptoms or ask a health question..."
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="px-4 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
