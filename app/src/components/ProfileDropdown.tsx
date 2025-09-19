'use client'

import { useState, useEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { UserRole } from '@/types/user'
import { useRouter } from 'next/navigation'

interface OnChainProfile {
  walletAddress: string
  role: UserRole
  username: string
  bio: string
  avatarUri: string
  website: string
  twitter: string
  createdAt: Date
  updatedAt: Date
  isVerified: boolean
  nftCount: number
  collectionCount: number
}

const roleIcons = {
  artist: '🎨',
  collector: '👥',
  curator: '🎭'
}

const roleColors = {
  artist: 'from-purple-500 to-pink-500',
  collector: 'from-blue-500 to-cyan-500',
  curator: 'from-green-500 to-teal-500'
}

export default function ProfileDropdown() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<OnChainProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const wallet = useWallet()
  const { fetchUserProfile } = useUserProfile()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const { connected, publicKey } = mounted ? wallet : { connected: false, publicKey: null }

  // Load profile when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      loadProfile()
    } else {
      setProfile(null)
    }
  }, [connected, publicKey])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadProfile = async () => {
    if (!publicKey) return

    setLoading(true)
    try {
      const onChainProfile = await fetchUserProfile()
      setProfile(onChainProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const getProfileCompleteness = () => {
    if (!profile) return { percentage: 0, missing: [] }

    const fields = [
      { key: 'username', label: 'Username', value: profile.username },
      { key: 'bio', label: 'Bio', value: profile.bio },
      { key: 'avatarUri', label: 'Avatar', value: profile.avatarUri },
      { key: 'website', label: 'Website', value: profile.website },
      { key: 'twitter', label: 'Twitter', value: profile.twitter }
    ]

    const filled = fields.filter(field => field.value && field.value.trim() !== '').length
    const missing = fields.filter(field => !field.value || field.value.trim() === '').map(f => f.label)

    return {
      percentage: Math.round((filled / fields.length) * 100),
      missing,
      total: fields.length,
      filled
    }
  }

  const getInitials = () => {
    if (profile?.username) {
      return profile.username.slice(0, 2).toUpperCase()
    }
    if (publicKey) {
      return publicKey.toString().slice(0, 2).toUpperCase()
    }
    return '??'
  }

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!mounted) {
    return null
  }

  if (!connected || !publicKey) {
    return null
  }

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      </div>
    )
  }

  const completeness = getProfileCompleteness()

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {profile?.avatarUri ? (
          <img
            src={profile.avatarUri}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-r ${profile?.role ? roleColors[profile.role] : 'from-gray-400 to-gray-500'} flex items-center justify-center text-white font-semibold text-sm`}>
            {getInitials()}
          </div>
        )}

        {/* Profile completeness indicator */}
        {profile && completeness.percentage < 100 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        )}

        {profile?.isVerified && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">✓</span>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {profile ? (
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${roleColors[profile.role]} flex items-center justify-center text-white text-lg font-semibold`}>
                  {profile.avatarUri ? (
                    <img
                      src={profile.avatarUri}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {profile.username || 'Unnamed User'}
                    </h3>
                    {profile.isVerified && (
                      <span className="text-blue-500 text-sm">✓</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <span>{roleIcons[profile.role]}</span>
                    <span className="capitalize">{profile.role}</span>
                  </div>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="mb-4 p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
                <p className="text-sm font-mono text-gray-700">
                  {formatWalletAddress(profile.walletAddress)}
                </p>
              </div>

              {/* Profile Completeness */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                  <span className="text-sm text-gray-600">{completeness.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completeness.percentage}%` }}
                  ></div>
                </div>
                {completeness.missing.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Missing: {completeness.missing.join(', ')}
                  </p>
                )}
              </div>

              {/* Profile Details */}
              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Bio</p>
                  <p className="text-sm text-gray-700">
                    {profile.bio || <span className="italic text-gray-400">No bio provided</span>}
                  </p>
                </div>

                {profile.website && (
                  <div>
                    <p className="text-xs text-gray-500">Website</p>
                    <a
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}

                {profile.twitter && (
                  <div>
                    <p className="text-xs text-gray-500">Twitter</p>
                    <a
                      href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      @{profile.twitter.replace('@', '')}
                    </a>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{profile.nftCount}</p>
                  <p className="text-xs text-gray-500">NFTs Created</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{profile.collectionCount}</p>
                  <p className="text-xs text-gray-500">Collections</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="text-xs text-gray-500 mb-4">
                Member since {profile.createdAt.toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    router.push('/profile')
                    setIsOpen(false)
                  }}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    if (publicKey) {
                      localStorage.removeItem(`user_${publicKey.toString()}`)
                      window.location.reload()
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  Switch Role
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-3">No profile found</p>
              <p className="text-xs text-gray-500 mb-3">
                Wallet: {formatWalletAddress(publicKey.toString())}
              </p>
              <button
                onClick={() => {
                  router.push('/')
                  setIsOpen(false)
                }}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Create Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}