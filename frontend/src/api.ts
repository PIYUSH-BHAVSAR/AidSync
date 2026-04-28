import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
})

export default api

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password })

export const getMissions = (ngo_id?: string) =>
  api.get('/missions', { params: ngo_id ? { ngo_id } : {} })

export const getMission = (id: string) => api.get(`/missions/${id}`)

export const createMission = (data: object) => api.post('/missions', data)

export const deleteMission = (id: string) => api.delete(`/missions/${id}`)

export const getHelpFeed = (filters?: object) =>
  api.get('/feed/help', { params: filters })

export const joinMission = (mission_id: string, user_id: string) =>
  api.post(`/missions/${mission_id}/join`, { user_id })

export const acceptMission = (mission_id: string, ngo_id: string) =>
  api.post(`/missions/${mission_id}/accept`, { ngo_id })

export const getAcceptedMissions = (ngo_id: string) =>
  api.get(`/missions/accepted/${ngo_id}`)

export const getJoinedMissions = (user_id: string) =>
  api.get(`/missions/joined/${user_id}`)

export const getChat = (room_id: string) => api.get(`/chat/${room_id}`)

export const sendChat = (data: object) => api.post('/chat/send', data)

export const getAnalytics = (ngo_id: string) => api.get(`/analytics/${ngo_id}`)

export const parseMission = (text: string) =>
  api.post('/ai/parse-mission', { text })

export const translateText = (text: string, target_language: string) =>
  api.post('/ai/translate', { text, target_language })
