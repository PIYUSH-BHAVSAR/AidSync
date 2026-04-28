import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMissions, joinMission, deleteMission } from '../api'
import type { Mission } from '../types'
import { AlertTriangle, Plus, Trash2, UserPlus } from 'lucide-react'

const urgencyColor = {
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
}

const categoryIcon: Record<string, string> = {
  food: '🍱', medical: '🏥', 'disaster relief': '🚨',
  education: '📚', environment: '🌱', 'blood donation': '🩸',
  logistics: '🚛', others: '📌',
}

export default function Missions() {
  const { user } = useAuth()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!user) return
    getMissions(user.ngo_id).then(r => {
      setMissions(r.data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [user])

  const handleJoin = async (id: string) => {
    if (!user) return
    try {
      await joinMission(id, user.id)
      load()
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Could not join')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this mission?')) return
    await deleteMission(id)
    load()
  }

  if (loading) return <div className="p-8 text-sm text-[#3d4947]">Loading...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0b1c30]">Missions</h1>
        {user?.role === 'ngo_admin' && (
          <Link
            to="/missions/new"
            className="flex items-center gap-2 bg-[#00685f] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#004d46] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Mission
          </Link>
        )}
      </div>

      {missions.length === 0 && (
        <div className="bg-white rounded-xl border border-[#e5eeff] p-12 text-center">
          <p className="text-[#3d4947] text-sm">No missions found.</p>
          {user?.role === 'ngo_admin' && (
            <Link to="/missions/new" className="text-teal-600 text-sm hover:underline mt-2 inline-block">Create your first mission</Link>
          )}
        </div>
      )}

      <div className="grid gap-4">
        {missions.map(m => (
          <div key={m.id} className={`bg-white rounded-xl border border-[#e5eeff] overflow-hidden ${m.urgency === 'high' ? 'border-t-2 border-t-orange-500' : ''}`}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-2xl">{categoryIcon[m.category] || '📌'}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#0b1c30]">{m.title}</h3>
                      {m.urgency === 'high' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                      {m.help_needed && (
                        <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">Needs Help</span>
                      )}
                    </div>
                    <p className="text-sm text-[#3d4947] mt-1 line-clamp-2">{m.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#3d4947]">
                      <span>📍 {m.location}</span>
                      <span>📅 {m.date}</span>
                      <span>⏰ {m.start_time} – {m.end_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium border ${urgencyColor[m.urgency]}`}>
                    {m.urgency.toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${m.status === 'filled' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-700'}`}>
                    {m.status}
                  </span>
                </div>
              </div>

              {/* Slots bar */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#e5eeff] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (m.slots_filled / m.slots) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-[#3d4947]">{m.slots_filled}/{m.slots} slots</span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Link to={`/missions/${m.id}`} className="text-xs text-teal-600 hover:underline">View Details</Link>
                {user?.role === 'volunteer' && m.status !== 'filled' && (
                  <button
                    onClick={() => handleJoin(m.id)}
                    className="flex items-center gap-1 text-xs bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    <UserPlus className="w-3 h-3" />
                    Join
                  </button>
                )}
                {user?.role === 'ngo_admin' && m.ngo_id === user.ngo_id && (
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
