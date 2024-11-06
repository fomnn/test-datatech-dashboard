import type { User } from '../types/User'
import { useEffect, useState } from 'react'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // mengambil list user dari localstorage, kalau tidak ada, mengambil dari api
    const loadUsers = async () => {
      try {
        const storedUsers = localStorage.getItem('users')
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers))
          setLoading(false)
          return
        }

        const response = await fetch('https://api.github.com/users')
        const data = await response.json()

        const formattedUsers: User[] = data.slice(0, 10).map((user: any) => ({
          id: user.id.toString(),
          name: user.login,
          email: `${user.login}@example.com`,
          age: Math.floor(Math.random() * 30) + 20,
          isActive: Math.random() > 0.5,
        }))

        localStorage.setItem('users', JSON.stringify(formattedUsers))
        setUsers(formattedUsers)
      }
      catch {
        setError('Failed to load users. Please try again later.')
      }
      finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // menambahkan user
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: crypto.randomUUID(),
    }
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  // mengupdate user
  const updateUser = (user: User) => {
    const updatedUsers = users.map(u => u.id === user.id ? user : u)
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  // menghapus user
  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id)
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
  }

  return { users, loading, error, addUser, updateUser, deleteUser }
}
