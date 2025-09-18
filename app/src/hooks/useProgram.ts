import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { AnchorProvider } from '@coral-xyz/anchor'
import { useMemo } from 'react'
import { getProgram, NftMarketplace } from '@/lib/program'

export const useProgram = () => {
  const { connection } = useConnection()
  const wallet = useWallet()

  const provider = useMemo(() => {
    if (!wallet.wallet) return null

    return new AnchorProvider(
      connection,
      wallet as any,
      AnchorProvider.defaultOptions()
    )
  }, [connection, wallet])

  const program: NftMarketplace | null = useMemo(() => {
    if (!provider) return null
    return getProgram(provider)
  }, [provider])

  return {
    program,
    provider,
    connected: wallet.connected,
    publicKey: wallet.publicKey,
  }
}