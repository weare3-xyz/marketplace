export type UserRole = 'artist' | 'collector' | 'curator'

export interface User {
  walletAddress: string
  role?: UserRole
  profile?: {
    username?: string
    bio?: string
    avatar?: string
    twitter?: string
    website?: string
  }
  createdAt: Date
  lastActive: Date
}

export interface RolePermissions {
  canCreateNFT: boolean
  canCurate: boolean
  canBuy: boolean
  canSell: boolean
  canMakeOffers: boolean
  canModerate: boolean
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  artist: {
    canCreateNFT: true,
    canCurate: false,
    canBuy: true,
    canSell: true,
    canMakeOffers: true,
    canModerate: false,
  },
  collector: {
    canCreateNFT: false,
    canCurate: false,
    canBuy: true,
    canSell: true,
    canMakeOffers: true,
    canModerate: false,
  },
  curator: {
    canCreateNFT: false,
    canCurate: true,
    canBuy: true,
    canSell: false,
    canMakeOffers: true,
    canModerate: true,
  },
}