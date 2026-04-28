import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createMission, parseMission } from '../api'
import { Sparkles, Loader2 } from 'lucide-react'

const CATEGORIES = ['food', 'medical', 'disaster relief', 'education', 'environment', 'blood donation', 'logistics', 'others']

const defaultForm = {
  title: '', description: '', category: 'food',
  date: '', start_time: '', end_time: '',
  location: '', slots: 10, urgency: 'medium', help_needed: false,
}

export default function CreateMission() {
  const { user, ngo } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(defaultForm)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiNote, setAiNote] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleAIParse = async () => {
    if (!aiText.trim()) return
    setAiLoading(true)
    setAiNote('')
    try {
      const res = await parseMission(aiText)
      const d = res.data
      setForm(f => ({
        ...f,
        title: d.title || f.title,
        description: d.description || aiText,
        category: d.category || f.category,
        date: d.date || f.date,
        location: d.location || f.location,
        slots: d.slots || f.slots,
        urgency: d.urgency || f.urgency,
      }))
      if (d.note) setAiNote(d.note)
    } catch {
      setAiNote('AI parsing failed. Please fill the form manually.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !ngo) return
    setSaving(true)
    try {
      await createMission({ ...form, ngo_id: user.ngo_id, ngo_name: ngo.name })
      navigate('/missions')
    } catch {
      alert('Failed to create mission')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#0b1c30] mb-6">Create Mission</h1>

      {/* AI Smart Intake */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span className="font-semibold text-sm text-teal-800">AI Smart Intake</span>
          <span className="text-xs text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">Powered by Gemini</span>
        </div>
        <p className="text-xs text-teal-700 mb-3">Paste a rough description and AI will fill the form for you.</p>
        <textarea
          value={aiText}
          onChange={e => setAiText(e.target.value)}
          placeholder="e.g. Need 20 volunteers tomorrow in Hadapsar for food distribution to flood victims, urgent"
          className="w-full px-3 py-2.5 border border-teal-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white resize-none"
          rows={3}
        />
        {aiNote && <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mt-2">{aiNote}</p>}
        <button
          type="button"
          onClick={handleAIParse}
          disabled={aiLoading || !aiText.trim()}
          className="mt-3 flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {aiLoading ? 'Parsing...' : 'Auto-fill with AI'}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e5eeff] p-6 flex flex-col gap-5">
        <Field label="Title">
          <input value={form.title} onChange={e => set('title', e.target.value)} required
            className="input" placeholder="Mission title" />
        </Field>

        <Field label="Description">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} required
            className="input resize-none" rows={3} placeholder="Describe the mission..." />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Urgency">
            <select value={form.urgency} onChange={e => set('urgency', e.target.value)} className="input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </Field>
        </div>

        <Field label="Location">
          <input value={form.location} onChange={e => set('location', e.target.value)} required
            className="input" placeholder="City, Area" />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Date">
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required className="input" />
          </Field>
          <Field label="Start Time">
            <input type="time" value={form.start_time} onChange={e => set('start_time', e.target.value)} required className="input" />
          </Field>
          <Field label="End Time">
            <input type="time" value={form.end_time} onChange={e => set('end_time', e.target.value)} required className="input" />
          </Field>
        </div>

        <Field label="Volunteer Slots">
          <input type="number" min={1} value={form.slots} onChange={e => set('slots', parseInt(e.target.value))} required className="input" />
        </Field>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.help_needed} onChange={e => set('help_needed', e.target.checked)}
            className="w-4 h-4 accent-teal-600" />
          <div>
            <span className="text-sm font-medium text-[#0b1c30]">Request Help from Partner NGOs</span>
            <p className="text-xs text-[#3d4947]">This mission will appear in the shared Help Feed</p>
          </div>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="bg-[#00685f] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#004d46] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Mission
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#3d4947] uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}

// Inject global input style via a style tag approach — using className directly
const style = document.createElement('style')
style.textContent = `.input { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid #bcc9c6; border-radius: 0.5rem; font-size: 0.875rem; outline: none; } .input:focus { ring: 2px solid #00685f; border-color: #00685f; }`
document.head.appendChild(style)
