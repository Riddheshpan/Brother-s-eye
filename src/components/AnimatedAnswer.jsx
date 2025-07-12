import { useEffect, useState } from 'react'

function CascadingTypewriter({ lines = [], textColor = 'text-white' }) {
  const [currentLine, setCurrentLine] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [doneLines, setDoneLines] = useState([])

  useEffect(() => {
    if (!Array.isArray(lines) || currentLine >= lines.length) return

    const line = lines[currentLine]
    const content = typeof line.content === 'string' ? line.content.trim() : ''
    let i = 0
    setTypedText('')

    const interval = setInterval(() => {
      if (i < content.length) {
        setTypedText((prev) => prev + content[i])
        i++
      } else {
        clearInterval(interval)
        setDoneLines((prev) => [...prev, line])
        setCurrentLine((prev) => prev + 1)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [currentLine, lines])

  const getStyle = (type) => {
    switch (type) {
      case 'code': return 'font-mono whitespace-pre-wrap text-sm'
      case 'poem': return 'italic whitespace-pre-line'
      case 'recipe': return 'whitespace-pre-line'
      case 'tutorial': return 'whitespace-pre-line'
      default: return 'whitespace-pre-line'
    }
  }

  return (
    <div className='font-mono leading-relaxed space-y-2 text-inherit'>
      {doneLines.map((line, idx) => (
        <p key={idx} className={`${getStyle(line.type)} ${textColor}`}>
          {line.content}
        </p>

      ))}
      {currentLine < lines.length && (
        <p className={`${getStyle(lines[currentLine].type)} ${textColor}`}>
          {typedText}
          <span className='animate-pulse'>▍</span>
        </p>


      )}
    </div>
  )
}

export default CascadingTypewriter
