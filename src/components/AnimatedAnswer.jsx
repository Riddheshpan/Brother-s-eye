import { useEffect, useState } from 'react'

function CascadingTypewriter({ lines = [], type = 'text' }) {
  const [currentLine, setCurrentLine] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [doneLines, setDoneLines] = useState([])

  useEffect(() => {
    if (!Array.isArray(lines) || currentLine >= lines.length) return

    const line = typeof lines[currentLine] === 'string' ? lines[currentLine].trim() : ''

    let i = 0
    setTypedText('')

    const interval = setInterval(() => {
      if (i < line.length) {
        setTypedText((prev) => prev + line[i])
        i++
      } else {
        clearInterval(interval)
        setDoneLines((prev) => [...prev, line])
        setCurrentLine((prev) => prev + 1)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [currentLine, lines])

  const style =
    type === 'code' ? 'font-mono text-green-300 text-sm whitespace-pre-wrap' :
    type === 'poetry' ? 'italic text-purple-300 whitespace-pre-line' :
    'text-zinc-200'

  return (
    <div className={`${style} font-mono leading-relaxed space-y-2`}>
      {doneLines.map((text, idx) => (
        <p key={idx}>{text}</p>
      ))}
      {currentLine < lines.length && (
        <p>
          {typedText}
          <span className='animate-pulse'>▍</span>
        </p>
      )}
    </div>
  )
}

export default CascadingTypewriter
