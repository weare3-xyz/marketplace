import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

export const PROGRAM_ID = new PublicKey('9AvbivndosEuSExjRmdJQz1NswXCvbDzeHVBg4Ls4cDw')

export type NftMarketplace = Program<Idl>

// Import IDL dynamically to avoid SSR issues
const getIdl = (): Idl => {
  try {
    const idlData = require('../nft_marketplace.json')
    return idlData as Idl
  } catch (error) {
    console.error('Failed to load IDL:', error)
    throw new Error('IDL not found')
  }
}

export const getProgram = (provider: AnchorProvider): NftMarketplace => {
  const idl = getIdl()
  return new Program(idl, provider)
}

export const getMarketplaceConfigPDA = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('marketplace')],
    PROGRAM_ID
  )
}

export const getUserProfilePDA = (userWallet: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user_profile'), userWallet.toBuffer()],
    PROGRAM_ID
  )
}

export const getUserStatsPDA = (userProfile: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user_stats'), userProfile.toBuffer()],
    PROGRAM_ID
  )
}