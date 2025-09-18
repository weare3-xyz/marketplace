'use client'

import { useState } from 'react'
import { UserRole } from '@/types/user'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useUser } from '@/contexts/UserContext'

interface SmartContractRoleSelectionProps {
  onSuccess: () => void
}

const roleData = {
  artist: {
    title: 'Artist',
    icon: '🎨',
    description: 'Create and mint your own NFTs, manage collections, and earn royalties from your art.',
    features: [
      'Create & mint NFTs',
      'Set up collections',
      'Manage royalties',
      'Track sales analytics',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  collector: {
    title: 'Collector',
    icon: '👥',
    description: 'Discover, purchase, and manage your NFT collection. Make offers and build your portfolio.',
    features: [
      'Browse marketplace',
      'Purchase NFTs',
      'Make offers',
      'Manage portfolio',
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  curator: {
    title: 'Curator',
    icon: '🎭',
    description: 'Curate collections, create featured lists, and help shape the marketplace experience.',
    features: [
      'Curate collections',
      'Feature artworks',
      'Moderate content',
      'Create themed galleries',
    ],
    color: 'from-green-500 to-teal-500',
  },
}

export default function SmartContractRoleSelection({ onSuccess }: SmartContractRoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const { createUserProfile, loading, error } = useUserProfile()
  const { setUserRole } = useUser()

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleCreateProfile = async () => {
    if (!selectedRole) return

    try {
      await createUserProfile({
        role: selectedRole,
        username: username || `${roleData[selectedRole].title}_User`,
        bio: bio || `New ${roleData[selectedRole].title} on the marketplace`,
      })

      // Update local context
      setUserRole(selectedRole)

      // Call success callback
      onSuccess()
    } catch (err) {
      console.error('Failed to create profile:', err)
    }
  }

  if (selectedRole) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your {roleData[selectedRole].title} Profile
          </h2>
          <p className="text-gray-600">
            This will be stored on the Solana blockchain
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`${roleData[selectedRole].title}_User`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={32}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={`Tell us about yourself as a ${roleData[selectedRole].title.toLowerCase()}...`}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-1">{bio.length}/200 characters</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedRole(null)}
                disabled={loading}
                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleCreateProfile}
                disabled={loading || !username.trim()}
                className={`flex-1 py-3 px-6 bg-gradient-to-r ${roleData[selectedRole].color} text-white rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Profile...
                  </>
                ) : (
                  'Create Profile on Blockchain'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Role
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
          Select how you'd like to participate in our NFT marketplace. Your profile will be stored on the Solana blockchain.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-blue-700 text-sm">
            🔗 <strong>Blockchain Integration:</strong> Your role and profile will be permanently stored on Solana, giving you true ownership of your identity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(roleData).map(([roleKey, role]) => (
          <div
            key={roleKey}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => handleRoleSelect(roleKey as UserRole)}
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              {/* Header with gradient */}
              <div className={`h-32 bg-gradient-to-r ${role.color} flex items-center justify-center`}>
                <div className="text-center">
                  <div className="text-5xl mb-2">{role.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{role.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {role.description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full mt-6 bg-gradient-to-r ${role.color} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
                >
                  Select {role.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-500 text-sm">
          🔐 Your profile will be secured on the Solana blockchain and you'll own your data forever
        </p>
      </div>
    </div>
  )
}