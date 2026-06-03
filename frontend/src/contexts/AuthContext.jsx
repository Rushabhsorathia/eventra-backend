import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const isAuthenticated = !!user && !!localStorage.getItem('session_token')

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/login', { email, password })
      const { session_token, user: userData } = res.data.data
      localStorage.setItem('session_token', session_token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please try again.',
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password, password_confirmation) => {
    setLoading(true)
    try {
      const res = await api.post('/register', { name, email, password, password_confirmation })
      const { session_token, user: userData } = res.data.data
      localStorage.setItem('session_token', session_token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed. Please try again.',
        errors: err.response?.data?.errors,
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch {
      // ignore errors on logout
    } finally {
      localStorage.removeItem('session_token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  const value = { user, setUser, loading, isAuthenticated, login, register, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
