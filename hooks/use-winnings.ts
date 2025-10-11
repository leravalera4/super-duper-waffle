import { useState, useEffect, useCallback } from 'react'

interface WinningsEntry {
  id: string
  gameId: string
  winnerWallet: string
  winnerUsername: string
  currency: 'sol' | 'points'
  stakeAmount: number
  pointsWon: number
  winningsAmount: number
  createdAt: string
}

interface UseWinningsState {
  winnings: WinningsEntry[]
  loading: boolean
  error: string | null
  hasMore: boolean
}

interface UseWinningsReturn extends UseWinningsState {
  refreshWinnings: () => Promise<void>
  loadMore: () => Promise<void>
}

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-domain.com'
  : 'http://localhost:3001'

export const useWinnings = (limit: number = 20): UseWinningsReturn => {
  const [state, setState] = useState<UseWinningsState>({
    winnings: [],
    loading: false,
    error: null,
    hasMore: true
  })

  const [offset, setOffset] = useState(0)

  const fetchWinnings = useCallback(async (reset = false) => {
    const currentOffset = reset ? 0 : offset
    
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null 
    }))

    try {
      console.log('🔍 Fetching winnings...', { limit, offset: currentOffset })
      
      const response = await fetch(`${API_BASE_URL}/api/games/winnings?limit=${limit}&offset=${currentOffset}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch winnings: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch winnings')
      }

      const newWinnings = data.winnings || []
      
      setState(prev => ({
        ...prev,
        winnings: reset ? newWinnings : [...prev.winnings, ...newWinnings],
        loading: false,
        hasMore: newWinnings.length === limit
      }))

      if (!reset) {
        setOffset(prev => prev + limit)
      } else {
        setOffset(limit)
      }

      console.log(`✅ Fetched ${newWinnings.length} winnings entries`)

    } catch (error) {
      console.error('Error fetching winnings:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
    }
  }, [limit, offset])

  const refreshWinnings = useCallback(async () => {
    await fetchWinnings(true)
  }, [fetchWinnings])

  const loadMore = useCallback(async () => {
    if (!state.loading && state.hasMore) {
      await fetchWinnings(false)
    }
  }, [fetchWinnings, state.loading, state.hasMore])

  // Load initial data
  useEffect(() => {
    refreshWinnings()
  }, [refreshWinnings])

  return {
    ...state,
    refreshWinnings,
    loadMore
  }
}
