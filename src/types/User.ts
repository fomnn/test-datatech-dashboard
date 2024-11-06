export interface User {
  id: string
  name: string
  email: string
  age: number
  isActive: boolean
}

export interface SortConfig {
  key: keyof User
  direction: 'asc' | 'desc'
}

export interface ValidationErrors {
  name?: string
  email?: string
  age?: string
}
