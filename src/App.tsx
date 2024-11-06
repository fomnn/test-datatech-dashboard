import type { SortConfig, User } from './types/User'
import { AlertCircle, Loader, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { UserForm } from './components/UserForm'
import { UserTable } from './components/UserTable'
import { useUsers } from './hooks/useUsers'

function App() {
  const { users, loading, error, addUser, updateUser, deleteUser } = useUsers()
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [filterActive, setFilterActive] = useState<boolean | null>(null)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc',
  })

  // Fungsi untuk mengatur opsi sorting
  const handleSort = (key: keyof User) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  // Menggunakan useMemo untuk meng-cache hasil filter dan sort, agar hanya dihitung ulang jika dependensi berubah
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users]

    if (filterActive !== null) {
      result = result.filter(user => user.isActive === filterActive)
    }

    result.sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortConfig.direction === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue)
      }

      return 0
    })

    return result
  }, [users, filterActive, sortConfig])

  // Menangani submit form edit user atau tambah user
  const handleSubmit = (userData: Omit<User, 'id'>) => {
    if (editingUser) {
      updateUser({ ...userData, id: editingUser.id })
    }
    else {
      addUser(userData)
    }
    setShowForm(false)
    setEditingUser(null)
  }

  // Menangani edit user
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
  }

  // Menghapus user dengan id tertentu
  const handleDelete = (id: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id)
    }
  }

  // tampilan saat loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg font-medium text-gray-700">Loading users...</span>
        </div>
      </div>
    )
  }

  // tampilan saat error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">DataTech Dashboard</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null)
                  setShowForm(true)
                }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${showForm ? 'bg-slate-300 cursor-not-allowed': 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Add User
              </button>
            </div>
          </div>

          {showForm && (
            <div className="p-6 border-b border-gray-200">
              <UserForm
                user={editingUser || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false)
                  setEditingUser(null)
                }}
              />
            </div>
          )}

          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={filterActive === null ? '' : filterActive.toString()}
                onChange={(e) => {
                  const value = e.target.value
                  setFilterActive(value === '' ? null : value === 'true')
                }}
                className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <UserTable
            users={filteredAndSortedUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  )
}

export default App
