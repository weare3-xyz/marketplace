'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { User, UserRole, rolePermissions } from '@/types/user'

interface UserContextType {
  user: User | null
  isLoading: boolean
  hasRole: boolean
  setUserRole: (role: UserRole) => void
  clearUser: () => void
  permissions: typeof rolePermissions[UserRole] | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [mounted, setMounted] = useState(false)
  const wallet = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't access wallet properties until mounted
  const { connected, publicKey } = mounted ? wallet : { connected: false, publicKey: null }

  // Load user data when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      setIsLoading(true)
      loadUserData(publicKey.toString())
    } else {
      setUser(null)
      setIsLoading(false)
    }
  }, [connected, publicKey])

  const loadUserData = async (walletAddress: string) => {
    try {
      // First try to load from blockchain
      const { fetchUserProfile } = await import('@/hooks/useUserProfile')
      // This is a simplified approach - in a real app you'd use the hook properly
      // For now, we'll still use localStorage but this sets up the structure

      const savedUserData = localStorage.getItem(`user_${walletAddress}`)

      if (savedUserData) {
        const userData = JSON.parse(savedUserData)
        setUser({
          ...userData,
          walletAddress,
          lastActive: new Date(),
        })
      } else {
        // New user - no role selected yet
        setUser({
          walletAddress,
          createdAt: new Date(),
          lastActive: new Date(),
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setUserRole = (role: UserRole) => {
    if (!publicKey) return

    const updatedUser: User = {
      ...user,
      walletAddress: publicKey.toString(),
      role,
      createdAt: user?.createdAt || new Date(),
      lastActive: new Date(),
    }

    setUser(updatedUser)

    // Save to localStorage
    localStorage.setItem(
      `user_${publicKey.toString()}`,
      JSON.stringify(updatedUser)
    )
  }

  const clearUser = () => {
    setUser(null)
    if (publicKey) {
      localStorage.removeItem(`user_${publicKey.toString()}`)
    }
  }

  const hasRole = Boolean(user?.role)
  const permissions = user?.role ? rolePermissions[user.role] : null

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        hasRole,
        setUserRole,
        clearUser,
        permissions,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}