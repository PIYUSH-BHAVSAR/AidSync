import { useEffect, useState } from 'react'
import { getHelpFeed, acceptMission, getAcceptedMissions } from '../api'
import { useAuth } from '../context/AuthContext'
import type { Mission } from '../types'
import { AlertTriangle, MapPin, Calendar, Users, CheckCircle, Loader2 } from 'lucide-react'

const urgencyColor = {
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

const categoryIcon: Record<string, string> = {
  food: '🍱', medical: '🏥', 'disaster relief': '🚨',
  education: '📚', environment: '🌱', 'blood donation': '🩸',
  logistics: '🚛', others: '📌',
}

const CATEGORIES = ['food', 'medical', 'disaster relief', 'education', 'environment', 'blood donation', 'logistics', 'others']

export default function HelpFeed() {
  const { user } = useAuth()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ city: '', category: '', urgency: '' })
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set())
  const [accepting, setAccepting] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const load = () => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (filters.city) params.city = filters.city
    if (filters.category) params.category = filters.category
    if (filters.urgency) params.urgency = filters.urgency
    getHelpFeed(params).then(r => {
      setMissions(r.data)
      setLoading(false)
    })
  }

  // Load which missions this NGO has already accepted
  useEffect(() => {
    if (!user) return
    getAcceptedMissions(user.ngo_id)
      .then(r => setAcceptedIds(new Set(r.data.map((m: Mission) => m.id))))
      .catch(() => {})
  }, [user])

  useEffect(() => { load() }, [filters])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleAccept = async (missionId: string) => {
    if (!user) return
    setAccepting(missionId)
    try {
      await acceptMission(missionId, user.ngo_id)
      setAcceptedIds(prev => new Set([...prev, missionId]))
      showToast('Support accepted! The mission owner has been notified.')
    } catch (e: any) {
      const msg = e.response?.data?.detail || 'Could not accept mission'
      showToast(msg)
    } finally {
      setAccepting(null)
    }
  }

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0b1c30] text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0b1c30]">Help Feed</h1>
        <p className="text-sm text-[#3d4947] mt-1">Missions from partner NGOs requesting support</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          placeholder="Filter by city..."
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
          className="px-3 py-2 border border-[#bcc9c6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-44"
        />
        <select
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          className="px-3 py-2 border border-[#bcc9c6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filters.urgency}
          onChange={e => setFilters(f => ({ ...f, urgency: e.target.value }))}
          className="px-3 py-2 border border-[#bcc9c6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All Urgency</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {loading && <p className="text-sm text-[#3d4947]">Loading feed...</p>}

      {!loading && missions.length === 0 && (
        <div className="bg-white rounded-xl border border-[#e5eeff] p-12 text-center">
          <p className="text-[#3d4947] text-sm">No missions requesting help right now.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {missions.map(m => {
          const isOwn = m.ngo_id === user?.ngo_id
          const isAccepted = acceptedIds.has(m.id)
          const isAccepting = accepting === m.id

          return (
            <div
              key={m.id}
              className={`bg-white rounded-xl border border-[#e5eeff] overflow-hidden hover:shadow-md transition-shadow ${m.urgency === 'high' ? 'border-t-2 border-t-orange-500' : ''}`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{categoryIcon[m.category] || '📌'}</span>
                    <div>
                      <h3 className="font-semibold text-[#0b1c30] text-sm leading-tight">{m.title}</h3>
                      <p className="text-xs text-teal-600 font-medium mt-0.5">{m.ngo_name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {m.urgency === 'high' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColor[m.urgency]}`}>
                      {m.urgency}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#3d4947] line-clamp-2 mb-3">{m.description}</p>

                <div className="flex flex-wrap gap-3 text-xs text-[#3d4947] mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{m.date}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{m.slots - m.slots_filled} slots open</span>
                </div>

                {/* Slots bar */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-1.5 bg-[#e5eeff] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${Math.min(100, (m.slots_filled / m.slots) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#3d4947]">{m.slots_filled}/{m.slots}</span>
                </div>

                {/* Accept button — context-aware */}
                {isOwn ? (
                  <div className="w-full py-2 rounded-lg text-sm font-medium text-center bg-[#e5eeff] text-[#3d4947]">
                    Your Mission
                  </div>
                ) : isAccepted ? (
                  <div className="w-full py-2 rounded-lg text-sm font-medium text-center bg-green-50 text-green-700 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Support Accepted
                  </div>
                ) : (
                  <button
                    onClick={() => handleAccept(m.id)}
                    disabled={isAccepting}
                    className="w-full bg-[#00685f] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#004d46] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isAccepting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Accepting...</>
                    ) : (
                      'Accept Support'
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
