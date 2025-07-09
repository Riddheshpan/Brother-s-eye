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
  const [persona, setPersona] = useState('Oracle')
  const accentText = persona === 'Alfred' ? 'text-yellow-300' : 'text-cyan-300'
  const accentBorder = persona === 'Alfred' ? 'border-yellow-500' : 'border-cyan-500'
  const accentButtonBg = persona === 'Alfred' ? 'bg-yellow-600' : 'bg-cyan-600'
  const accentButtonBorder = persona === 'Alfred' ? 'border-yellow-400' : 'border-cyan-400'
  const [authenticated, setAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [launching, setLaunching] = useState(false)
  const [RecentHistory, setRecentHistory] = useState([]) 


  const checkPassword = () => {
    if (passwordInput === 'GothamX2025') {
      setLaunching(true)
      setTimeout(() => setAuthenticated(true), 3000) 
    } else {
      alert('Access Denied: Invalid credentials.')
      setPasswordInput('')
    }
  }


  useEffect(() => {
    const stored = localStorage.getItem('history')
    if (stored) {
      setRecentHistory(JSON.parse(stored))
    }const root = document.documentElement
  if (persona === 'Alfred') {
    root.style.setProperty('--accent-color', '#ffd54f')
    root.style.setProperty('--accent-glow', 'rgba(255, 221, 100, 0.5)')
  } else {
    root.style.setProperty('--accent-color', '#00d4ff')
    root.style.setProperty('--accent-glow', 'rgba(0, 255, 255, 0.4)')
  }
}, [persona])

  if (!authenticated) {
    if (launching) {
      return (
        <div className='h-screen bg-black flex flex-col items-center justify-center text-cyan-400'>
          <div className='animate-ping w-24 h-24 rounded-full border-4 border-cyan-500'></div>
          <h1 className='mt-6 text-lg font-mono tracking-widest animate-pulse'>
            INITIALIZING BROTHER’S EYE...
          </h1>
        </div>
      )
    }

    return (
      <div className='h-screen bg-black flex flex-col justify-center items-center text-cyan-300 font-mono'>
        <div className='mb-6 text-center'>
          <div className='w-20 h-20 border-4 border-cyan-500 rounded-full animate-pulse'></div>
          <h1 className='mt-4 text-2xl tracking-widest'>BROTHER'S EYE ACCESS</h1>
        </div>
        <input
          type='password'
          className='bg-zinc-900 border border-cyan-400 p-2 w-64 text-center outline-none'
          placeholder='Enter Secret Code'
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') checkPassword()
          }}
        />
        <button onClick={checkPassword} className='mt-4 px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700'>
          Unlock
        </button>
      </div>
    )
  }

  const handleDelete = (id) => {
    const filtered = RecentHistory.filter(entry => entry.id !== id)
    setRecentHistory(filtered)
    localStorage.setItem('history', JSON.stringify(filtered))
  }


  const askQuestion = async () => {
    let stored = localStorage.getItem('history')
    let parsedHistory = stored ? JSON.parse(stored) : []
    const newEntry = { id: Date.now(), query: question }
    parsedHistory = [newEntry, ...parsedHistory]

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
    <div className='main-ui-enter grid grid-cols-5 h-screen text-center'>
      <div className='main-ui-enter col-span-1 bg-zinc-900 text-white scroll-container p-4 overflow-y-scroll'>
        <h2 className={`text-xl font-bold mb-4 ${accentText}`}>Brother Eye Logs</h2>
        {RecentHistory.map((item) => (
          <div
            key={item.id}
            className={`flex justify-between items-center text-sm mb-2 ${accentText} border-b ${accentBorder} pb-1`}
          >
            <span>{item.query}</span>
            <button
              onClick={() => handleDelete(item.id)}
              className='text-red-500 hover:text-red-700 ml-2 text-xs'
            >
              ✖
            </button>
          </div>

        ))}

      </div>

      <div className='col-span-4'>
        <div className='flex justify-center gap-3 mb-4 mt-2'>
          <button
            onClick={() => setPersona('Oracle')}
            className={`px-3 py-1 rounded-full font-orbitron border ${persona === 'Oracle' ? `${accentButtonBg} text-white ${accentButtonBorder}` : 'bg-zinc-800 text-zinc-300 border-zinc-600'
              }`}
          >
            Oracle
          </button>
          <button
            onClick={() => setPersona('Alfred')}
            className={`px-3 py-1 rounded-full font-orbitron border ${persona === 'Alfred' ? `${accentButtonBg} text-white ${accentButtonBorder}` : 'bg-zinc-800 text-zinc-300 border-zinc-600'
              }`}
          >
            Alfred
          </button>

        </div>

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
