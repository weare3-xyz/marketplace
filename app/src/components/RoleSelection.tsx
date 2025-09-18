'use client'

import { UserRole } from '@/types/user'

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void
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

export default function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Role
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select how you'd like to participate in our NFT marketplace. You can change this later in your profile settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(roleData).map(([roleKey, role]) => (
          <div
            key={roleKey}
            className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => onRoleSelect(roleKey as UserRole)}
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
          💡 Don't worry! You can change your role anytime in your profile settings
        </p>
      </div>
    </div>
  )
}