import { useState, useEffect } from 'react'
import './App.css'
import { geminiURL } from './constant'
import ChatBubble from './components/bubble'

function App() {
  const [question, setQuestion] = useState('')
  const [lastQuestion, setLastQuestion] = useState('')
  const [result, setResult] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [RecentHistory, setRecentHistory] = useState([])
  const [persona, setPersona] = useState('Oracle')

  // 🧠 Load Brother's Eye logs when app starts
  useEffect(() => {
    const stored = localStorage.getItem('history')
    if (stored) {
      setRecentHistory(JSON.parse(stored))
    }
  }, [])

  const askQuestion = async () => {
    // 🔁 Save recent question to localStorage
    let stored = localStorage.getItem('history')
    let parsedHistory = stored ? JSON.parse(stored) : []
    parsedHistory = [question, ...parsedHistory]
    localStorage.setItem('history', JSON.stringify(parsedHistory))
    setRecentHistory(parsedHistory)

    setLoading(true)
    setResult([])

    const PersonaPrompt =
      persona === 'Alfred'
        ? 'Begin your response with “Master Wayne,” and speak with elegance and politeness like Alfred from Batman.'
        : 'Begin your response with “Batman,” and reply analytically like Oracle with precision and logic.'

    const Payload = {
      contents: [
        {
          parts: [
            { text: `Previous question: ${lastQuestion}` },
            { text: `Follow-up: ${question}` },
            { text: PersonaPrompt },
            { text: 'Please keep the response concise and avoid overly long lists.' }
          ]
        }
      ]
    }

    try {
      let response = await fetch(geminiURL, {
        method: 'POST',
        body: JSON.stringify(Payload)
      })

      response = await response.json()

      let dataString = response.candidates[0]?.content?.parts?.[0]?.text ?? ''
      dataString = dataString.trim()

      let parsed = dataString
        .split(/\*\s+/)
        .map(item => item.trim())
        .filter(item => item && item.toLowerCase() !== 'undefined')

      // 🧠 Classify type: code, poetry, or text
      const classifyLine = (line) => {
        if (line.includes('{') || line.includes('=>') || line.includes('function')) return 'code'
        if (/^[A-Z][a-z]*(?:[,\s]+[A-Z][a-z]*){2,}$/.test(line)) return 'poetry'
        return 'text'
      }

      const styledResult = parsed.map(line => ({
        type: classifyLine(line),
        content: line
      }))

      setResult(styledResult)
      setLastQuestion(question)
      setHistory(prev => [...prev, { question, answer: styledResult }])
      setQuestion('')
    } catch (error) {
      console.error('Error:', error)
      setResult([{ content: 'Error fetching response.', type: 'text' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='grid grid-cols-5 h-screen text-center'>
      {/* 🧾 Brother’s Eye Side Panel */}
      <div className='col-span-1 bg-zinc-900 text-white scroll-container p-4 overflow-y-scroll'>
        <h2 className='text-xl font-bold mb-4'>Brother Eye Logs</h2>
        {RecentHistory.map((item, idx) => (
          <p key={idx} className='text-sm mb-2 text-zinc-400 border-b border-zinc-700 pb-1'>
            {item}
          </p>
        ))}
      </div>

      <div className='col-span-4'>
        {/* 🎭 Persona Toggle */}
        <div className='flex justify-center gap-3 mb-4 mt-2'>
          <button
            onClick={() => setPersona('Oracle')}
            className={`px-3 py-1 rounded-full ${
              persona === 'Oracle' ? 'bg-indigo-600 text-white' : 'bg-zinc-600 text-zinc-300'
            }`}
          >
            Oracle
          </button>
          <button
            onClick={() => setPersona('Alfred')}
            className={`px-3 py-1 rounded-full ${
              persona === 'Alfred' ? 'bg-indigo-600 text-white' : 'bg-zinc-600 text-zinc-300'
            }`}
          >
            Alfred
          </button>
        </div>

        {/* 💬 Chat Thread */}
        <div className='scroll-container h-110 overflow-y-scroll overflow-x-hidden break-words'>
          <div className='text-white p-4'>
            {history.map((entry, idx) => (
              <div key={idx} className='flex flex-col'>
                <ChatBubble text={entry.question} isUser />
                {entry.answer.map((line, i) => (
                  <ChatBubble
                    key={`ans-${idx}-${i}`}
                    text={line.content}
                    type={line.type}
                    speaker={persona}
                  />
                ))}
              </div>
            ))}
            {loading && <div className='animate-pulse text-zinc-400'>Loading...</div>}
          </div>
        </div>

        {/* 📝 Input Section */}
        <div className='bg-zinc-800 w-1/2 text-white p-1 pr-5 m-auto rounded-4xl border border-zinc-400 flex items-center'>
          <input
            type='text'
            className='h-full w-full p-3 outline-none font-mono placeholder:text-zinc-400'
            placeholder='Ask anything you want...'
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && question.trim()) askQuestion()
            }}
          />
          <button onClick={askQuestion} className='px-4 py-2 text-zinc-200 hover:text-white'>
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
