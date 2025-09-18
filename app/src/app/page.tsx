'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import WalletButton from '@/components/WalletButton'
import { useUser } from '@/contexts/UserContext'
import SmartContractRoleSelection from '@/components/SmartContractRoleSelection'
import { UserRole } from '@/types/user'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const wallet = useWallet()
  const { user, hasRole, setUserRole, isLoading } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  const { connected, publicKey } = mounted ? wallet : { connected: false, publicKey: null }

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                NFT Marketplace
              </h1>
            </div>
            <div className="flex items-center">
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {!connected ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Welcome to NFT Marketplace
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Discover, collect, and trade unique digital assets on Solana
            </p>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your Solana wallet to start your NFT journey
              </p>
              <WalletButton />
            </div>
          </div>
        ) : isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        ) : !hasRole ? (
          <SmartContractRoleSelection onSuccess={() => window.location.reload()} />
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Welcome back, {user?.role}!
            </h1>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {user?.role === 'artist' ? '🎨 Artist Dashboard' :
                 user?.role === 'collector' ? '👥 Collector Dashboard' :
                 '🎭 Curator Dashboard'}
              </h2>
              <p className="text-gray-600 mb-4">
                Wallet: {publicKey?.toString()}
              </p>
              <p className="text-gray-600 mb-6">
                Role: <span className="capitalize font-semibold text-blue-600">{user?.role}</span>
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {user?.role === 'artist' && (
                  <>
                    <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                      Create NFT
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      My Collections
                    </button>
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                      Analytics
                    </button>
                  </>
                )}

                {user?.role === 'collector' && (
                  <>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Browse NFTs
                    </button>
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                      My Portfolio
                    </button>
                    <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors">
                      Watchlist
                    </button>
                  </>
                )}

                {user?.role === 'curator' && (
                  <>
                    <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors">
                      Curate Collections
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Featured Gallery
                    </button>
                    <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
                      Moderation
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    if (publicKey) {
                      localStorage.removeItem(`user_${publicKey.toString()}`)
                      window.location.reload()
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Change Role
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}