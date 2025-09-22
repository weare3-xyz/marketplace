import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { AnchorProvider } from '@coral-xyz/anchor'
import { useMemo, useState, useEffect } from 'react'
import { getProgram, NftMarketplace } from '@/lib/program'

export const useProgram = () => {
  const [mounted, setMounted] = useState(false)
  const { connection } = useConnection()
  const wallet = useWallet()

  useEffect(() => {
    setMounted(true)
  }, [])

  const provider = useMemo(() => {
    if (!mounted || !wallet.wallet) return null

    return new AnchorProvider(
      connection,
      wallet as any,
      AnchorProvider.defaultOptions()
    )
  }, [mounted, connection, wallet])

  const program: NftMarketplace | null = useMemo(() => {
    if (!mounted || !provider) return null
    return getProgram(provider)
  }, [mounted, provider])

  return {
    program,
    provider,
    connected: mounted ? wallet.connected : false,
    publicKey: mounted ? wallet.publicKey : null,
  }
}