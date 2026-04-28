import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../context/AuthContext'
import { Heart, Loader2 } from 'lucide-react'

const DEMO_ACCOUNTS = [
  { label: 'NGO Admin (Mumbai)', email: 'priya@bharatrelief.org', password: 'demo123' },
  { label: 'NGO Admin (Pune)', email: 'rahul@sevafoundation.org', password: 'demo123' },
  { label: 'Volunteer', email: 'ankit@volunteer.com', password: 'demo123' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(email, password)
      setAuth(res.data.user, res.data.ngo, res.data.token)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email)
    setPassword(acc.password)
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="text-teal-600 w-7 h-7 fill-teal-600" />
          <span className="text-2xl font-bold text-[#0b1c30] tracking-tight">AidSync</span>
        </div>

        <div className="bg-white rounded-xl border border-[#bcc9c6]/40 shadow-sm p-8">
          <h1 className="text-xl font-semibold text-[#0b1c30] mb-1">Welcome back</h1>
          <p className="text-sm text-[#3d4947] mb-6">Sign in to your account</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3d4947] uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-[#bcc9c6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="you@ngo.org"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3d4947] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-[#bcc9c6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-[#00685f] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#004d46] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#e5eeff]">
            <p className="text-xs text-[#3d4947] mb-3 font-medium">Demo accounts</p>
            <div className="flex flex-col gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  className="text-left px-3 py-2 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] transition-colors text-xs"
                >
                  <span className="font-medium text-[#0b1c30]">{acc.label}</span>
                  <span className="text-[#3d4947] ml-2">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
