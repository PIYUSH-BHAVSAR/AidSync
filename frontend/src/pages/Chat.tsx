import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMissions, getChat, sendChat, translateText } from '../api'
import type { Mission, ChatMsg } from '../types'
import { Send, Languages, Loader2 } from 'lucide-react'

const LANGS = ['Hindi', 'Marathi', 'English']

export default function Chat() {
  const { user } = useAuth()
  const [missions, setMissions] = useState<Mission[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string>('')
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [translating, setTranslating] = useState<string | null>(null)
  const [translated, setTranslated] = useState<Record<string, string>>({})
  const [targetLang, setTargetLang] = useState('Hindi')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    getMissions(user.ngo_id).then(r => {
      setMissions(r.data)
      if (r.data.length > 0) setSelectedRoom(r.data[0].id)
    })
  }, [user])

  useEffect(() => {
    if (!selectedRoom) return
    getChat(selectedRoom).then(r => setMessages(r.data))
  }, [selectedRoom])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !user) return
    setSending(true)
    try {
      const msg = await sendChat({
        room_id: selectedRoom,
        sender_id: user.id,
        sender_name: user.name,
        message: input.trim(),
      })
      setMessages(m => [...m, msg.data])
      setInput('')
    } finally {
      setSending(false)
    }
  }

  const handleTranslate = async (msgId: string, text: string) => {
    setTranslating(msgId)
    try {
      const res = await translateText(text, targetLang)
      setTranslated(t => ({ ...t, [msgId]: res.data.translated }))
    } finally {
      setTranslating(null)
    }
  }

  const selectedMission = missions.find(m => m.id === selectedRoom)

  return (
    <div className="flex h-full">
      {/* Room list */}
      <div className="w-64 border-r border-[#e5eeff] bg-white flex flex-col shrink-0">
        <div className="px-4 py-4 border-b border-[#e5eeff]">
          <h2 className="font-semibold text-sm text-[#0b1c30]">Mission Rooms</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {missions.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedRoom(m.id)}
              className={`w-full text-left px-4 py-3 border-b border-[#e5eeff] hover:bg-[#eff4ff] transition-colors ${selectedRoom === m.id ? 'bg-[#e5eeff]' : ''}`}
            >
              <p className="text-sm font-medium text-[#0b1c30] truncate">{m.title}</p>
              <p className="text-xs text-[#3d4947] mt-0.5 truncate">{m.location}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e5eeff] bg-white flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#0b1c30] text-sm">{selectedMission?.title || 'Select a room'}</h3>
            <p className="text-xs text-[#3d4947]">{selectedMission?.location}</p>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-[#3d4947]" />
            <select
              value={targetLang}
              onChange={e => setTargetLang(e.target.value)}
              className="text-xs border border-[#bcc9c6] rounded-lg px-2 py-1 focus:outline-none"
            >
              {LANGS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.length === 0 && (
            <p className="text-sm text-[#3d4947] text-center mt-8">No messages yet. Start the conversation.</p>
          )}
          {messages.map(msg => {
            const isMe = msg.sender_id === user?.id
            return (
              <div key={msg.id} className={`flex flex-col gap-1 max-w-lg ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                {!isMe && <span className="text-xs text-[#3d4947] font-medium px-1">{msg.sender_name}</span>}
                <div className={`px-4 py-2.5 rounded-xl text-sm ${isMe ? 'bg-[#00685f] text-white' : 'bg-white border border-[#e5eeff] text-[#0b1c30]'}`}>
                  {msg.message}
                  {translated[msg.id] && (
                    <p className={`text-xs mt-1.5 pt-1.5 border-t ${isMe ? 'border-white/20 text-white/80' : 'border-[#e5eeff] text-[#3d4947]'}`}>
                      🌐 {translated[msg.id]}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs text-[#3d4947]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <button
                    onClick={() => handleTranslate(msg.id, msg.message)}
                    disabled={translating === msg.id}
                    className="text-xs text-teal-600 hover:underline flex items-center gap-1"
                  >
                    {translating === msg.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                    Translate
                  </button>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-[#e5eeff] bg-white flex items-center gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 border border-[#bcc9c6] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="bg-[#00685f] text-white p-2.5 rounded-xl hover:bg-[#004d46] transition-colors disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
