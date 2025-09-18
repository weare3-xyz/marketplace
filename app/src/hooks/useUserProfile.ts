import { useState, useCallback } from 'react'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { useProgram } from './useProgram'
import { getUserProfilePDA, getUserStatsPDA, getMarketplaceConfigPDA } from '@/lib/program'
import { UserRole } from '@/types/user'

interface CreateProfileParams {
  role: UserRole
  username: string
  bio?: string
  avatarUri?: string
  website?: string
  twitter?: string
}

interface OnChainUserProfile {
  authority: PublicKey
  role: { [key: string]: {} }
  username: string
  bio: string
  avatarUri: string
  website: string
  twitter: string
  createdAt: number
  updatedAt: number
  isVerified: boolean
  nftCount: number
  collectionCount: number
  bump: number
}

export const useUserProfile = () => {
  const { program, publicKey, connected } = useProgram()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mapRoleFromChain = (chainRole: { [key: string]: {} }): UserRole => {
    if ('artist' in chainRole) return 'artist'
    if ('collector' in chainRole) return 'collector'
    if ('curator' in chainRole) return 'curator'
    return 'collector' // default
  }

  const mapRoleToChain = (role: UserRole) => {
    switch (role) {
      case 'artist': return { artist: {} }
      case 'collector': return { collector: {} }
      case 'curator': return { curator: {} }
      default: return { collector: {} }
    }
  }

  const createUserProfile = useCallback(async (params: CreateProfileParams) => {
    if (!program || !publicKey || !connected) {
      throw new Error('Wallet not connected or program not loaded')
    }

    setLoading(true)
    setError(null)

    try {
      const [userProfilePDA] = getUserProfilePDA(publicKey)
      const [userStatsPDA] = getUserStatsPDA(userProfilePDA)
      const [marketplaceConfigPDA] = getMarketplaceConfigPDA()

      const tx = await program.methods
        .createUserProfile({
          role: mapRoleToChain(params.role),
          username: params.username || '',
          bio: params.bio || '',
          avatarUri: params.avatarUri || '',
          website: params.website || '',
          twitter: params.twitter || '',
        })
        .accounts({
          userProfile: userProfilePDA,
          userStats: userStatsPDA,
          marketplaceConfig: marketplaceConfigPDA,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      console.log('Profile created:', tx)
      return tx
    } catch (err: any) {
      console.error('Error creating profile:', err)
      setError(err.message || 'Failed to create profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [program, publicKey, connected])

  const updateUserProfile = useCallback(async (params: CreateProfileParams) => {
    if (!program || !publicKey || !connected) {
      throw new Error('Wallet not connected or program not loaded')
    }

    setLoading(true)
    setError(null)

    try {
      const [userProfilePDA] = getUserProfilePDA(publicKey)

      const tx = await program.methods
        .updateUserProfile({
          role: mapRoleToChain(params.role),
          username: params.username || '',
          bio: params.bio || '',
          avatarUri: params.avatarUri || '',
          website: params.website || '',
          twitter: params.twitter || '',
        })
        .accounts({
          userProfile: userProfilePDA,
          authority: publicKey,
        })
        .rpc()

      console.log('Profile updated:', tx)
      return tx
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Failed to update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }, [program, publicKey, connected])

  const fetchUserProfile = useCallback(async (userWallet?: PublicKey) => {
    if (!program) return null

    const wallet = userWallet || publicKey
    if (!wallet) return null

    try {
      const [userProfilePDA] = getUserProfilePDA(wallet)
      const profile = await program.account.userProfile.fetch(userProfilePDA) as OnChainUserProfile

      return {
        walletAddress: profile.authority.toString(),
        role: mapRoleFromChain(profile.role),
        username: profile.username,
        bio: profile.bio,
        avatarUri: profile.avatarUri,
        website: profile.website,
        twitter: profile.twitter,
        createdAt: new Date(profile.createdAt * 1000),
        updatedAt: new Date(profile.updatedAt * 1000),
        isVerified: profile.isVerified,
        nftCount: profile.nftCount,
        collectionCount: profile.collectionCount,
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      return null
    }
  }, [program, publicKey])

  const checkProfileExists = useCallback(async (userWallet?: PublicKey) => {
    const profile = await fetchUserProfile(userWallet)
    return profile !== null
  }, [fetchUserProfile])

  return {
    createUserProfile,
    updateUserProfile,
    fetchUserProfile,
    checkProfileExists,
    loading,
    error,
  }
}