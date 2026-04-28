import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMissions, getAnalytics } from '../api'
import type { Mission, Analytics } from '../types'
import { Link } from 'react-router-dom'
import { AlertTriangle, Users, CheckCircle, Handshake, Clock } from 'lucide-react'

const urgencyColor = {
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

export default function Dashboard() {
  const { user, ngo } = useAuth()
  const [missions, setMissions] = useState<Mission[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)

  useEffect(() => {
    if (!user) return
    getMissions(user.ngo_id).then(r => setMissions(r.data))
    getAnalytics(user.ngo_id).then(r => setAnalytics(r.data))
  }, [user])

  const stats = [
    { label: 'Missions Created', value: analytics?.missions_created ?? 0, icon: CheckCircle, color: 'text-teal-600' },
    { label: 'Volunteers Mobilized', value: analytics?.volunteers_mobilized ?? 0, icon: Users, color: 'text-blue-600' },
    { label: 'Partners Helped', value: analytics?.partner_ngos_helped ?? 0, icon: Handshake, color: 'text-purple-600' },
    { label: 'Hours Contributed', value: analytics?.hours_contributed ?? 0, icon: Clock, color: 'text-orange-600' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0b1c30]">Welcome, {user?.name}</h1>
        <p className="text-[#3d4947] text-sm mt-1">{ngo?.name} · {ngo?.city}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e5eeff] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#3d4947] uppercase tracking-wider">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <span className="text-3xl font-bold text-[#0b1c30] font-mono">{value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Active Missions */}
      <div className="bg-white rounded-xl border border-[#e5eeff]">
        <div className="px-6 py-4 border-b border-[#e5eeff] flex items-center justify-between">
          <h2 className="font-semibold text-[#0b1c30]">Active Missions</h2>
          <Link to="/missions" className="text-sm text-teal-600 hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-[#e5eeff]">
          {missions.length === 0 && (
            <p className="px-6 py-8 text-sm text-[#3d4947] text-center">No missions yet. <Link to="/missions/new" className="text-teal-600 hover:underline">Create one</Link></p>
          )}
          {missions.slice(0, 5).map(m => (
            <div key={m.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                {m.urgency === 'high' && <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />}
                <div className="min-w-0">
                  <p className="font-medium text-sm text-[#0b1c30] truncate">{m.title}</p>
                  <p className="text-xs text-[#3d4947] mt-0.5">{m.location} · {m.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${urgencyColor[m.urgency]}`}>
                  {m.urgency}
                </span>
                <span className="text-xs text-[#3d4947] font-mono">{m.slots_filled}/{m.slots}</span>
                <Link to={`/missions/${m.id}`} className="text-xs text-teal-600 hover:underline">View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
