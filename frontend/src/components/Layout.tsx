import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, ListChecks, Globe, MessageSquare,
  BarChart2, PlusCircle, LogOut, Heart
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/missions', icon: ListChecks, label: 'Missions' },
  { to: '/feed', icon: Globe, label: 'Help Feed' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, ngo, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#f8f9ff] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1c30] flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-2">
          <Heart className="text-teal-400 w-5 h-5 fill-teal-400" />
          <span className="text-white font-bold text-lg tracking-tight">AidSync</span>
        </div>

        <div className="px-4 py-4 border-b border-white/10">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Logged in as</p>
          <p className="text-white font-medium text-sm truncate">{user?.name}</p>
          <p className="text-teal-400 text-xs truncate">{ngo?.name}</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}

          {user?.role === 'ngo_admin' && (
            <NavLink
              to="/missions/new"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-2 ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <PlusCircle className="w-4 h-4" />
              Create Mission
            </NavLink>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
