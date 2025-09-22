'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { UserRole } from '@/types/user'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

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

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<OnChainProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    role: 'collector' as UserRole,
    username: '',
    bio: '',
    avatarUri: '',
    website: '',
    twitter: ''
  })

  const wallet = useWallet()
  const { fetchUserProfile, updateUserProfile } = useUserProfile()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const { connected, publicKey } = mounted ? wallet : { connected: false, publicKey: null }

  // Redirect if not connected
  useEffect(() => {
    if (mounted && !connected) {
      router.push('/')
    }
  }, [mounted, connected, router])

  // Load profile when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      loadProfile()
    }
  }, [connected, publicKey])

  const loadProfile = async () => {
    if (!publicKey) return

    setLoading(true)
    setError(null)
    try {
      const onChainProfile = await fetchUserProfile()
      if (onChainProfile) {
        setProfile(onChainProfile)
        setFormData({
          role: onChainProfile.role,
          username: onChainProfile.username,
          bio: onChainProfile.bio,
          avatarUri: onChainProfile.avatarUri,
          website: onChainProfile.website,
          twitter: onChainProfile.twitter
        })
      } else {
        setError('Profile not found. Please create a profile first.')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    setError(null)

    try {
      await updateUserProfile(formData)
      await loadProfile() // Reload the profile
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        role: profile.role,
        username: profile.username,
        bio: profile.bio,
        avatarUri: profile.avatarUri,
        website: profile.website,
        twitter: profile.twitter
      })
    }
    setIsEditing(false)
    setError(null)
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

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  if (!mounted) {
    return null
  }

  if (!connected) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Profile
          </button>
        </div>
      </div>
    )
  }

  const completeness = getProfileCompleteness()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
              >
                ← Weare3
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className={`h-32 bg-gradient-to-r ${profile ? roleColors[profile.role] : 'from-gray-400 to-gray-500'}`}></div>

          <div className="relative px-6 pb-6">
            {/* Profile Avatar */}
            <div className="flex items-end space-x-6 -mt-16">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  {profile?.avatarUri ? (
                    <img
                      src={profile.avatarUri}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-r ${profile ? roleColors[profile.role] : 'from-gray-400 to-gray-500'} flex items-center justify-center text-white text-3xl font-bold`}>
                      {profile?.username ? profile.username.slice(0, 2).toUpperCase() : '??'}
                    </div>
                  )}
                </div>
                {profile?.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile?.username || 'Unnamed User'}
                    </h1>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg">{profile ? roleIcons[profile.role] : '❓'}</span>
                      <span className="text-gray-600 capitalize">{profile?.role || 'Unknown'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={saving}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isEditing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Completeness */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                <span className="text-sm text-gray-600">{completeness.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completeness.percentage}%` }}
                ></div>
              </div>
              {completeness.missing.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Complete your profile by adding: {completeness.missing.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="artist">🎨 Artist</option>
                      <option value="collector">👥 Collector</option>
                      <option value="curator">🎭 Curator</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 capitalize flex items-center">
                      <span className="mr-2">{profile ? roleIcons[profile.role] : '❓'}</span>
                      {profile?.role || 'Not set'}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Enter your username"
                      maxLength={32}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile?.username || <span className="italic text-gray-400">Not set</span>}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-sm text-gray-500 mt-1">{formData.username.length}/32 characters</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      maxLength={200}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile?.bio || <span className="italic text-gray-400">No bio provided</span>}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/200 characters</p>
                  )}
                </div>

                {/* Avatar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar
                  </label>
                  {isEditing ? (
                    <ImageUpload
                      onImageUploaded={(ipfsUrl) => setFormData({ ...formData, avatarUri: ipfsUrl })}
                      currentImage={formData.avatarUri}
                    />
                  ) : (
                    <div className="flex items-center space-x-4">
                      {profile?.avatarUri ? (
                        <img
                          src={profile.avatarUri}
                          alt="Avatar"
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">
                          {profile?.avatarUri ? (
                            profile.avatarUri.includes('ipfs') ? (
                              <span className="text-green-600">✅ Stored on IPFS</span>
                            ) : (
                              <span className="text-blue-600">🔗 External URL</span>
                            )
                          ) : (
                            <span className="italic text-gray-400">No avatar set</span>
                          )}
                        </p>
                        {profile?.avatarUri && (
                          <p className="text-xs text-gray-500 mt-1 break-all font-mono max-w-xs">
                            {profile.avatarUri}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      maxLength={100}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile?.website ? (
                        <a
                          href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.website}
                        </a>
                      ) : (
                        <span className="italic text-gray-400">No website</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Twitter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Handle
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="username (without @)"
                      maxLength={50}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {profile?.twitter ? (
                        <a
                          href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          @{profile.twitter.replace('@', '')}
                        </a>
                      ) : (
                        <span className="italic text-gray-400">No Twitter handle</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Save/Cancel Buttons */}
                {isEditing && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Wallet Address</p>
                  <p className="font-mono text-sm text-gray-900 break-all">
                    {profile ? formatWalletAddress(profile.walletAddress) : 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-sm text-gray-900">
                    {profile?.createdAt.toLocaleDateString() || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">
                    {profile?.updatedAt.toLocaleDateString() || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verification Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profile?.isVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile?.isVerified ? '✓ Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">NFTs Created</span>
                  <span className="text-sm font-medium text-gray-900">{profile?.nftCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Collections</span>
                  <span className="text-sm font-medium text-gray-900">{profile?.collectionCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Profile Completeness</span>
                  <span className="text-sm font-medium text-gray-900">{completeness.percentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}