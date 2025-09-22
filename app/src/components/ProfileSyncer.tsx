'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useUser } from '@/contexts/UserContext'

export const ProfileSyncer = () => {
  const [mounted, setMounted] = useState(false)
  const wallet = useWallet()
  const { fetchUserProfile } = useUserProfile()
  const { user, setUserRole } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't access wallet properties until mounted
  const { connected, publicKey } = mounted ? wallet : { connected: false, publicKey: null }

  useEffect(() => {
    const syncProfileFromBlockchain = async () => {
      if (!connected || !publicKey || user?.role) {
        // If we already have a role, no need to fetch
        return
      }

      try {
        console.log('Checking blockchain for existing profile...')
        const blockchainProfile = await fetchUserProfile()

        if (blockchainProfile && blockchainProfile.role) {
          console.log('Found existing profile on blockchain:', blockchainProfile)

          // Update the user context with blockchain data
          setUserRole(blockchainProfile.role)

          // Also save the full profile data to localStorage
          const fullUserData = {
            walletAddress: publicKey.toString(),
            role: blockchainProfile.role,
            username: blockchainProfile.username,
            bio: blockchainProfile.bio,
            avatarUri: blockchainProfile.avatarUri,
            website: blockchainProfile.website,
            twitter: blockchainProfile.twitter,
            createdAt: blockchainProfile.createdAt,
            lastActive: new Date(),
            isVerified: blockchainProfile.isVerified,
            nftCount: blockchainProfile.nftCount,
            collectionCount: blockchainProfile.collectionCount,
          }

          localStorage.setItem(
            `user_${publicKey.toString()}`,
            JSON.stringify(fullUserData)
          )
        } else {
          console.log('No profile found on blockchain')
        }
      } catch (error) {
        console.error('Error syncing profile from blockchain:', error)
      }
    }

    // Only run if we're connected but don't have a role yet, and component is mounted
    if (mounted && connected && publicKey && !user?.role) {
      syncProfileFromBlockchain()
    }
  }, [mounted, connected, publicKey, user?.role, fetchUserProfile, setUserRole])

  // This component doesn't render anything
  return null
}