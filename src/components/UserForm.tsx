import type { User, ValidationErrors } from '../types/User'
import { AlertCircle } from 'lucide-react'
import React, { useState } from 'react'

interface UserFormProps {
  user?: User
  onSubmit: (user: Omit<User, 'id'>) => void
  onCancel: () => void
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    isActive: user?.isActive || false,
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

  // validasi form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    const age = Number(formData.age)
    if (Number.isNaN(age) || age <= 0) {
      newErrors.age = 'Age must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // handle saat user men-submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        name: formData.name,
        email: formData.email,
        age: Number(formData.age),
        isActive: formData.isActive,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <div className="mt-1 flex items-center text-sm text-red-600">
            <AlertCircle className="mr-1 h-4 w-4" />
            {errors.name}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && (
          <div className="mt-1 flex items-center text-sm text-red-600">
            <AlertCircle className="mr-1 h-4 w-4" />
            {errors.email}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          value={formData.age}
          onChange={e => setFormData({ ...formData, age: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.age && (
          <div className="mt-1 flex items-center text-sm text-red-600">
            <AlertCircle className="mr-1 h-4 w-4" />
            {errors.age}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-700">Active Member</label>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {user ? 'Update' : 'Add'}
          {' '}
          User
        </button>
      </div>
    </form>
  )
}
