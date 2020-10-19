import React, { ReactNode, useContext, useMemo } from 'react'
import {
  useAntTokenV1Contract,
  useAntTokenV2Contract,
} from '../hooks/useContract'
import { usePollTokenBalanceOf } from '../hooks/usePollTokenBalanceOf'
import { BigNumber } from 'ethers'
import { usePollTokenPriceUsd } from '../hooks/usePollTokenPriceUsd'
import { usePollUniswapPool } from '../hooks/usePollUniswapPool'

const ANT_TOKEN_DECIMALS = 18

type PolledValue = BigNumber | null

type BalancesContext = {
  antV1Balance: PolledValue
  antV2Balance: PolledValue
  antInUniswapPool: PolledValue
  antTokenPriceUsd: string | null
}

const AccountBalancesContext = React.createContext<BalancesContext>({
  antV1Balance: null,
  antV2Balance: null,
  antInUniswapPool: null,
  antTokenPriceUsd: null,
})

function AccountBalancesProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const antTokenV1Contract = useAntTokenV1Contract()
  const antTokenV2Contract = useAntTokenV2Contract()

  const antV1BalanceBn = usePollTokenBalanceOf(antTokenV1Contract)
  const antV2BalanceBn = usePollTokenBalanceOf(antTokenV2Contract)
  const antTokenPriceUsd = usePollTokenPriceUsd('ANT')
  const antInUniswapPoolBn = usePollUniswapPool({ mockAccount: true })

  const contextValue = useMemo(
    (): BalancesContext => ({
      antV1Balance: antV1BalanceBn,
      antV2Balance: antV2BalanceBn,
      antInUniswapPool: antInUniswapPoolBn,
      antTokenPriceUsd,
    }),

    [antV1BalanceBn, antV2BalanceBn, antTokenPriceUsd, antInUniswapPoolBn]
  )

  return (
    <AccountBalancesContext.Provider value={contextValue}>
      {children}
    </AccountBalancesContext.Provider>
  )
}

type BalanceWithDecimals = {
  balance: PolledValue
  decimals: number
}

type AccountBalances = {
  antV1: BalanceWithDecimals
  antV2: BalanceWithDecimals
  antInUniswapPool: PolledValue
  antTokenPriceUsd: string | null
}

function useAccountBalances(): AccountBalances {
  const {
    antV1Balance,
    antV2Balance,
    antTokenPriceUsd,
    antInUniswapPool,
  } = useContext(AccountBalancesContext)

  return {
    antV1: {
      balance: antV1Balance,
      // At the moment it doesn't make sense to request decimals via the contract
      // as we already know the value
      decimals: ANT_TOKEN_DECIMALS,
    },
    antV2: {
      balance: antV2Balance,
      decimals: ANT_TOKEN_DECIMALS,
    },
    antInUniswapPool,
    antTokenPriceUsd,
  }
}

export { useAccountBalances, AccountBalancesProvider }
