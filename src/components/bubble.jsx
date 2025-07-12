import { useEffect, useState } from 'react'
import CascadingTypewriter from './AnimatedAnswer'
import '../App.css';


function ChatBubble({ text, isUser = false, speaker = 'Brother Eye', type = 'text' }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const getTextColor = (styleString) => {
    try {
      const match = styleString.match(/text-\[#[0 - 9a - fA - F]{ 3, 6 } \]| text -\w + -\d +/)
  return match ? match[0] : 'text-white'
} catch (err) {
  console.error('Regex error:', err)
  return 'text-white'
}
}

useEffect(() => {
  const timer = setTimeout(() => setVisible(true), 50)
  return () => clearTimeout(timer)
}, [])

const label = isUser
  ? '🦇 Bruce Wayne'
  : speaker === 'Oracle'
    ? '🧠 Oracle'
    : speaker === 'Alfred'
      ? '🎩 Alfred'
      : '👁️ Brother Eye'

const jokerStyles = 'bg-[#2c003c] text-[#ff5edc] border border-[#ff00aa] italic animate-wiggle'
const catwomanStyles = 'bg-[#2a2a2a] text-pink-300 border border-pink-500 italic'
const riddlerStyles = 'bg-[#102f1f] text-lime-300 border border-lime-500 italic'
const alfredStyles = 'bg-[#3e3e2e] text-[#ffe0b0] border border-[#ffcc55]'
const oracleStyles = 'bg-[#2e2e2e] text-[#aaffff] border border-[#00d4ff]'
const brotherEyeStyles = 'bg-[#2e2e2e] text-[#e0e0e0] border border-[#444]'


const userStyles =
  'bg-[#1f2a48] text-[#d7f0ff] ml-auto border border-[#2f436c] bubble-launch-now'

const botStyles =
  type === 'code'
    ? 'bg-[#1f2f1f] text-green-300 border border-green-400'
    : type === 'poem'
      ? 'bg-[#2c223c] text-purple-300 border border-purple-400'
      : type === 'recipe'
        ? 'bg-[#2f2f1f] text-yellow-300 border border-yellow-500'
        : type === 'tutorial'
          ? 'bg-[#222f2f] text-sky-300 border border-sky-400'
          : speaker === 'Oracle'
            ? 'bg-[#2e2e2e] text-[#aaffff] border border-[#00d4ff]'
            : speaker === 'Alfred'
              ? 'bg-[#3e3e2e] text-[#ffe0b0] border border-[#ffcc55]'
              : 'bg-[#2e2e2e] text-[#e0e0e0] border border-[#444]'

const bubbleStyles = isUser
  ? userStyles
  : speaker === 'Oracle'
    ? oracleStyles
    : speaker === 'Alfred'
      ? alfredStyles
      : speaker === 'Joker'
        ? jokerStyles
        : speaker === 'Catwoman'
          ? catwomanStyles
          : speaker === 'Riddler'
            ? riddlerStyles
            : brotherEyeStyles

const textColorClass = bubbleStyles
  .split(' ')
  .find(cls => /^text-(?:\[#[0-9a-fA-F]{3,6}\]|\w+-\d+)$/.test(cls)) || 'text-white'


const animationClass = isUser
  ? 'bubble-enter-right'
  : speaker === 'Oracle'
    ? 'bubble-fade-up'
    : speaker === 'Alfred'
      ? 'bubble-enter-left'
      : 'bubble-fade-up'



const handleCopyCode = () => {
  const match = text.match(/```(?:\w+)?\n([\s\S]*?)```/)
  const extracted = match ? match[1].trim() : text.trim()
  navigator.clipboard.writeText(extracted)
  setCopied(true)
  setTimeout(() => setCopied(false), 1500)
}

return (
  <div
    className={`transition-all duration-300 ease-out transform ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${animationClass} w-fit max-w-[80%] p-4 my-2 rounded-3xl font-mono shadow-md ${bubbleStyles} text-inherit`}
  >
    <p className='text-xs text-zinc-400 mb-2'>{label}</p>
    <CascadingTypewriter
      lines={[{ content: text, type }]}
      textColor={textColorClass}
    />
    {type === 'code' && (
      <div className='mt-2'>
        <button
          onClick={handleCopyCode}
          className='text-xs text-yellow-400 hover:underline'
        >
          Copy Code
        </button>
        {copied && (
          <span className='ml-2 text-green-400 text-xs'>✅ Copied!</span>
        )}
      </div>
    )}
  </div>
)
}

export default ChatBubble