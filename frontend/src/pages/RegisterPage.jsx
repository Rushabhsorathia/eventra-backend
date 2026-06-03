import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, User, ArrowRight, Ticket } from 'lucide-react'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    const result = await register(form.name, form.email, form.password, form.password_confirmation)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
      if (result.errors) setFieldErrors(result.errors)
    }
  }

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const InputField = ({ label, icon: Icon, type = 'text', field, placeholder }) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type={type}
          required
          value={form[field]}
          onChange={update(field)}
          className="block w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 text-sm shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
          placeholder={placeholder}
        />
      </div>
      {fieldErrors[field] && (
        <p className="mt-1 text-sm text-red-600">{fieldErrors[field][0]}</p>
      )}
    </div>
  )

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
            <Ticket className="h-7 w-7 text-primary-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-500">Join Eventra and start discovering events</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <InputField label="Full Name" icon={User} field="name" placeholder="John Doe" />
          <InputField label="Email Address" icon={Mail} type="email" field="email" placeholder="you@example.com" />
          <InputField label="Password" icon={Lock} type="password" field="password" placeholder="••••••••" />
          <InputField label="Confirm Password" icon={Lock} type="password" field="password_confirmation" placeholder="••••••••" />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
