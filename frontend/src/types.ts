export interface User {
  id: string
  ngo_id: string
  role: 'ngo_admin' | 'volunteer' | 'platform_admin'
  name: string
  email: string
}

export interface NGO {
  id: string
  name: string
  city: string
  verified: boolean
  categories: string[]
  contact: string
}

export interface Mission {
  id: string
  ngo_id: string
  ngo_name: string
  title: string
  description: string
  category: string
  date: string
  start_time: string
  end_time: string
  location: string
  slots: number
  slots_filled: number
  urgency: 'low' | 'medium' | 'high'
  help_needed: boolean
  status: 'active' | 'filled' | 'completed'
}

export interface ChatMsg {
  id: string
  room_id: string
  sender_id: string
  sender_name: string
  message: string
  timestamp: string
}

export interface Analytics {
  missions_created: number
  missions_completed: number
  volunteers_mobilized: number
  partner_ngos_helped: number
  hours_contributed: number
}
