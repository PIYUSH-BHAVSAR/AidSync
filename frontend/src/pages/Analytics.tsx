import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAnalytics } from '../api'
import type { Analytics } from '../types'
import { CheckCircle, Users, Handshake, Clock, TrendingUp } from 'lucide-react'

export default function AnalyticsPage() {
  const { user, ngo } = useAuth()
  const [data, setData] = useState<Analytics | null>(null)

  useEffect(() => {
    if (!user) return
    getAnalytics(user.ngo_id).then(r => setData(r.data))
  }, [user])

  if (!data) return <div className="p-8 text-sm text-[#3d4947]">Loading...</div>

  const completionRate = data.missions_created > 0
    ? Math.round((data.missions_completed / data.missions_created) * 100)
    : 0

  const cards = [
    { label: 'Missions Created', value: data.missions_created, icon: TrendingUp, color: 'bg-teal-50 text-teal-600', bar: null },
    { label: 'Missions Completed', value: data.missions_completed, icon: CheckCircle, color: 'bg-green-50 text-green-600', bar: completionRate },
    { label: 'Volunteers Mobilized', value: data.volunteers_mobilized, icon: Users, color: 'bg-blue-50 text-blue-600', bar: null },
    { label: 'Partner NGOs Helped', value: data.partner_ngos_helped, icon: Handshake, color: 'bg-purple-50 text-purple-600', bar: null },
    { label: 'Hours Contributed', value: data.hours_contributed, icon: Clock, color: 'bg-orange-50 text-orange-600', bar: null },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0b1c30]">Analytics</h1>
        <p className="text-sm text-[#3d4947] mt-1">{ngo?.name} · Impact Overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bar }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e5eeff] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#3d4947] uppercase tracking-wider">{label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <span className="text-4xl font-bold text-[#0b1c30] font-mono">{value.toLocaleString()}</span>
            {bar !== null && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-[#3d4947] mb-1.5">
                  <span>Completion rate</span>
                  <span className="font-medium">{bar}%</span>
                </div>
                <div className="h-2 bg-[#e5eeff] rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${bar}%` }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-6">
        <h2 className="font-semibold text-[#0b1c30] mb-2">Impact Summary</h2>
        <p className="text-sm text-[#3d4947]">
          {ngo?.name} has successfully completed <strong>{data.missions_completed}</strong> out of <strong>{data.missions_created}</strong> missions,
          mobilizing <strong>{data.volunteers_mobilized}</strong> volunteers who contributed <strong>{data.hours_contributed.toLocaleString()}</strong> hours
          across <strong>{data.partner_ngos_helped}</strong> partner NGO collaborations.
        </p>
      </div>
    </div>
  )
}
