'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Home() {
  const { connected, publicKey } = useWallet()

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
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to NFT Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Discover, collect, and trade unique digital assets on Solana
          </p>

          {connected && publicKey ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Wallet Connected!
              </h2>
              <p className="text-gray-600">
                Address: {publicKey.toString()}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Browse NFTs
                </button>
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Create NFT
                </button>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  My Collection
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-6">
                Connect your Solana wallet to start trading NFTs
              </p>
              <WalletMultiButton />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}