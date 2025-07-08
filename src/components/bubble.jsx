import { useEffect, useState } from 'react'
import CascadingTypewriter from './AnimatedAnswer'

function ChatBubble({ text, isUser = false, speaker = 'Brother Eye', type = 'text' }) {
  const [visible, setVisible] = useState(false)

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

  const userStyles = 'bg-[#1f2a48] text-[#d7f0ff] ml-auto border border-[#2f436c]'

  const botStyles =
    type === 'code'
      ? 'bg-[#1f2f1f] text-green-300 border border-green-400'
      : type === 'poetry'
      ? 'bg-[#2c223c] text-purple-300 border border-purple-400'
      : speaker === 'Oracle'
      ? 'bg-[#2e2e2e] text-[#aaffff] border border-[#444]'
      : speaker === 'Alfred'
      ? 'bg-[#3e3e2e] text-[#ffe0b0] border border-[#555]'
      : 'bg-[#2e2e2e] text-[#e0e0e0] border border-[#444]'

  const bubbleStyles = isUser ? userStyles : botStyles

  return (
    <div
      className={`transition-all duration-300 ease-out transform ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } w-fit max-w-[80%] p-4 my-2 rounded-3xl font-mono shadow-md ${bubbleStyles}`}
    >
      <p className='text-xs text-zinc-400 mb-2'>{label}</p>
      <CascadingTypewriter lines={[text]} type={type} />
    </div>
  )
}

export default ChatBubble
