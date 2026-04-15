'use client'

import { useState, useEffect } from 'react'
import { parseTradeError } from '@/lib/errors'
import Link from 'next/link'
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits, type Address } from 'viem'
import { BarChart3, Zap, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { useComplianceConnect, useComplianceGuard } from '@/hooks/useComplianceConnect'
import {
  MARKET_FACTORY_ADDRESS,
  USDC_ADDRESS,
  MarketFactoryABI,
  BinaryMarketABI,
  ERC20ABI,
} from '@/lib/contracts'
import { TRADING_ENABLED } from '@/lib/trading'

const USDC_DECIMALS = 6

function formatUSDC(raw: bigint | undefined): string {
  if (raw === undefined) return '0.00'
  return Number(formatUnits(raw, USDC_DECIMALS)).toFixed(2)
}

function formatPrice(raw: bigint | undefined): string {
  if (raw === undefined) return '50'
  const cents = Number(raw) / 1e16
  return cents.toFixed(0)
}

function MarketCard({ address, index }: { address: Address; index: number }) {
  const { address: userAddress, isConnected } = useAccount()
  const { connect, modal: connectModal } = useComplianceConnect()
  const { guardedAction, modal: guardModal } = useComplianceGuard()
  const [expanded, setExpanded] = useState(false)
  const [amount, setAmount] = useState('')
  const [seedAmount, setSeedAmount] = useState('')
  const [action, setAction] = useState<'buy-yes' | 'buy-no' | 'seed' | null>(null)

  const { data: marketData, isLoading: marketLoading, refetch: refetchMarket } = useReadContracts({
    contracts: [
      { address, abi: BinaryMarketABI, functionName: 'question' },
      { address, abi: BinaryMarketABI, functionName: 'getYesPrice' },
      { address, abi: BinaryMarketABI, functionName: 'getNoPrice' },
      { address, abi: BinaryMarketABI, functionName: 'resolved' },
      { address, abi: BinaryMarketABI, functionName: 'yesWins' },
      { address, abi: BinaryMarketABI, functionName: 'initialized' },
      { address, abi: BinaryMarketABI, functionName: 'yesReserve' },
      { address, abi: BinaryMarketABI, functionName: 'noReserve' },
      { address, abi: BinaryMarketABI, functionName: 'resolutionTime' },
    ],
  })

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: userAddress ? [userAddress, address] : undefined,
    query: { enabled: !!userAddress },
  })

  const { data: balanceData } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  })

  const [txError, setTxError] = useState<string | null>(null)
  const onError = (err: Error) => { setTxError(parseTradeError(err)); setTimeout(() => setTxError(null), 8000) }

  const { writeContract: approve, data: approveTxHash, isPending: approving, reset: resetApprove } = useWriteContract({ mutation: { onError } })
  const { writeContract: buyYes, data: buyYesTxHash, isPending: buyingYes, reset: resetBuyYes } = useWriteContract({ mutation: { onError } })
  const { writeContract: buyNo, data: buyNoTxHash, isPending: buyingNo, reset: resetBuyNo } = useWriteContract({ mutation: { onError } })
  const { writeContract: seed, data: seedTxHash, isPending: seeding, reset: resetSeed } = useWriteContract({ mutation: { onError } })

  const { isLoading: waitingApprove, isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveTxHash })
  const { isLoading: waitingBuyYes, isSuccess: buyYesSuccess } = useWaitForTransactionReceipt({ hash: buyYesTxHash })
  const { isLoading: waitingBuyNo, isSuccess: buyNoSuccess } = useWaitForTransactionReceipt({ hash: buyNoTxHash })
  const { isLoading: waitingSeed, isSuccess: seedSuccess } = useWaitForTransactionReceipt({ hash: seedTxHash })

  useEffect(() => {
    if (approveSuccess) refetchAllowance()
  }, [approveSuccess, refetchAllowance])

  useEffect(() => {
    if (buyYesSuccess || buyNoSuccess || seedSuccess) {
      refetchMarket()
      refetchAllowance()
    }
  }, [buyYesSuccess, buyNoSuccess, seedSuccess, refetchMarket, refetchAllowance])

  const question = marketData?.[0]?.result as string | undefined
  const yesPrice = marketData?.[1]?.result as bigint | undefined
  const noPrice = marketData?.[2]?.result as bigint | undefined
  const resolved = marketData?.[3]?.result as boolean | undefined
  const yesWins = marketData?.[4]?.result as boolean | undefined
  const initialized = marketData?.[5]?.result as boolean | undefined
  const yesReserve = marketData?.[6]?.result as bigint | undefined
  const noReserve = marketData?.[7]?.result as bigint | undefined
  const resolutionTime = marketData?.[8]?.result as bigint | undefined

  const totalPool = (yesReserve ?? 0n) + (noReserve ?? 0n)
  const isSeeded = initialized === true
  const allowance = (allowanceData as bigint) ?? 0n
  const balance = (balanceData as bigint) ?? 0n

  const parsedAmount = (() => {
    try { return parseUnits(amount || '0', USDC_DECIMALS) } catch { return 0n }
  })()
  const parsedSeedAmount = (() => {
    try { return parseUnits(seedAmount || '0', USDC_DECIMALS) } catch { return 0n }
  })()

  const needsApproval = (amt: bigint) => allowance < amt

  const handleApprove = (amt: bigint) => {
    guardedAction(() => {
      approve({
        address: USDC_ADDRESS,
        abi: ERC20ABI,
        functionName: 'approve',
        args: [address, amt],
      })
      setAction(null)
    })
  }

  const handleBuyYes = () => {
    guardedAction(() => {
      buyYes({ address, abi: BinaryMarketABI, functionName: 'buyYes', args: [parsedAmount, 0n] })
      setAction('buy-yes')
    })
  }

  const handleBuyNo = () => {
    guardedAction(() => {
      buyNo({ address, abi: BinaryMarketABI, functionName: 'buyNo', args: [parsedAmount, 0n] })
      setAction('buy-no')
    })
  }

  const handleSeed = () => {
    guardedAction(() => {
      seed({ address, abi: BinaryMarketABI, functionName: 'seed', args: [parsedSeedAmount] })
      setAction('seed')
    })
  }

  const resolvesAt = resolutionTime ? new Date(Number(resolutionTime) * 1000) : null

  // Render guard modal for compliance checks on trading actions
  const complianceModals = <>{guardModal}</>;

  if (marketLoading) {
    return (
      <div className="rounded-xl border border-rekt-border bg-rekt-card p-6 animate-pulse">
        <div className="h-4 bg-rekt-border rounded w-3/4 mb-4" />
        <div className="h-8 bg-rekt-border rounded w-1/2" />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-rekt-border bg-rekt-card overflow-hidden transition-all hover:border-rekt-blue/30">
      {complianceModals}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-rekt-muted">#{index + 1}</span>
            {resolved && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                yesWins ? 'bg-rekt-green/20 text-rekt-green' : 'bg-rekt-red/20 text-rekt-red'
              }`}>
                {yesWins ? 'YES won' : 'NO won'}
              </span>
            )}
            {!isSeeded && !resolved && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rekt-gold/20 px-2 py-0.5 text-xs font-medium text-rekt-gold">
                Needs Seed
              </span>
            )}
          </div>
          <span className="text-xs text-rekt-muted font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>

        <h3 className="text-base font-semibold text-white mb-4 leading-snug">
          {question || 'Loading...'}
        </h3>

        <div className="flex gap-3 mb-3">
          <div className="flex-1 rounded-lg bg-rekt-green/10 border border-rekt-green/20 px-3 py-2 text-center">
            <div className="text-[10px] text-rekt-muted uppercase tracking-wider">Yes</div>
            <div className="text-xl font-bold text-rekt-green">{formatPrice(yesPrice)}¢</div>
          </div>
          <div className="flex-1 rounded-lg bg-rekt-red/10 border border-rekt-red/20 px-3 py-2 text-center">
            <div className="text-[10px] text-rekt-muted uppercase tracking-wider">No</div>
            <div className="text-xl font-bold text-rekt-red">{formatPrice(noPrice)}¢</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-rekt-muted mb-4">
          <span>Pool: {formatUnits(totalPool, 6)} USDC</span>
          {resolvesAt && (
            <span>Resolves: {resolvesAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          )}
        </div>

        {!resolved && (
          <button
            onClick={() => TRADING_ENABLED && setExpanded(!expanded)}
            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              TRADING_ENABLED
                ? 'bg-rekt-blue/10 border border-rekt-blue/20 text-rekt-blue hover:bg-rekt-blue/20 cursor-pointer'
                : 'bg-rekt-border/30 border border-rekt-border text-rekt-muted cursor-default'
            }`}
          >
            <Zap className="h-4 w-4" />
            {TRADING_ENABLED ? 'Trade' : 'Connect Wallet to Trade'}
            {TRADING_ENABLED && (expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
          </button>
        )}
      </div>

      {expanded && !resolved && (
        <div className="border-t border-rekt-border bg-rekt-dark/50 p-5 space-y-4">
          {!isConnected ? (
            <div className="text-center">
              <p className="text-sm text-rekt-muted mb-3">Connect wallet to trade</p>
              <button
                onClick={() => connect()}
                className="rounded-lg bg-rekt-blue px-6 py-2.5 text-sm font-medium text-white hover:bg-rekt-blue/80 transition-colors"
              >
                Connect Wallet
              </button>
              {connectModal}
            </div>
          ) : !isSeeded ? (
            <div className="space-y-3">
              <p className="text-sm text-rekt-muted">This market needs initial liquidity. Seed it to enable trading.</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="USDC amount"
                  value={seedAmount}
                  onChange={(e) => setSeedAmount(e.target.value)}
                  className="flex-1 rounded-lg border border-rekt-border bg-rekt-dark px-3 py-2.5 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
                />
                {needsApproval(parsedSeedAmount) ? (
                  <button
                    onClick={() => handleApprove(parsedSeedAmount)}
                    disabled={approving || waitingApprove || !seedAmount || parsedSeedAmount === 0n}
                    className="rounded-lg bg-rekt-gold px-5 py-2.5 text-sm font-medium text-rekt-dark hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {approving || waitingApprove ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {approving ? 'Confirm...' : waitingApprove ? 'Approving...' : 'Approve USDC'}
                  </button>
                ) : (
                  <button
                    onClick={handleSeed}
                    disabled={seeding || waitingSeed || !seedAmount || parsedSeedAmount === 0n}
                    className="rounded-lg bg-rekt-gold px-5 py-2.5 text-sm font-medium text-rekt-dark hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {seeding || waitingSeed ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {seeding ? 'Confirm...' : waitingSeed ? 'Seeding...' : 'Seed'}
                  </button>
                )}
              </div>
              {seedSuccess && (
                <p className="flex items-center gap-1 text-xs text-rekt-green">
                  <CheckCircle className="h-3 w-3" /> Market seeded!
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-rekt-muted mb-1 block">Amount (USDC)</label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-rekt-border bg-rekt-dark px-3 py-2.5 text-sm text-white placeholder-rekt-muted outline-none focus:border-rekt-blue/50"
                />
                <p className="text-[10px] text-rekt-muted mt-1">
                  USDC balance: {formatUSDC(balance)}
                </p>
              </div>

              {parsedAmount > 0n && (
                <div className="text-xs text-rekt-muted space-y-1">
                  <div className="flex justify-between">
                    <span>Platform fee (1%)</span>
                    <span>{formatUnits(parsedAmount * 200n / 10000n, 6)} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Position size</span>
                    <span>{formatUnits(parsedAmount - parsedAmount * 200n / 10000n, 6)} USDC</span>
                  </div>
                </div>
              )}

              {needsApproval(parsedAmount) ? (
                <button
                  onClick={() => handleApprove(parsedAmount)}
                  disabled={approving || waitingApprove || !amount || parsedAmount === 0n}
                  className="w-full rounded-lg bg-rekt-gold py-3 text-sm font-semibold text-rekt-dark hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {approving || waitingApprove ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {approving ? 'Confirm in wallet...' : waitingApprove ? 'Approving...' : `Approve ${amount} USDC`}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleBuyYes}
                    disabled={buyingYes || waitingBuyYes || !amount || parsedAmount === 0n}
                    className="rounded-lg bg-rekt-green py-3 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {buyingYes || waitingBuyYes ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {buyingYes ? 'Confirm...' : waitingBuyYes ? 'Buying...' : 'Buy YES'}
                  </button>
                  <button
                    onClick={handleBuyNo}
                    disabled={buyingNo || waitingBuyNo || !amount || parsedAmount === 0n}
                    className="rounded-lg bg-rekt-red py-3 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {buyingNo || waitingBuyNo ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {buyingNo ? 'Confirm...' : waitingBuyNo ? 'Buying...' : 'Buy NO'}
                  </button>
                </div>
              )}

              {waitingApprove && (
                <p className="flex items-center gap-1 text-xs text-rekt-blue">
                  <Loader2 className="h-3 w-3 animate-spin" /> Confirming approval...
                </p>
              )}
              {approveSuccess && (
                <p className="flex items-center gap-1 text-xs text-rekt-green">
                  <CheckCircle className="h-3 w-3" /> Approved! Now click Buy.
                </p>
              )}
              {buyYesSuccess && (
                <p className="flex items-center gap-1 text-xs text-rekt-green">
                  <CheckCircle className="h-3 w-3" /> Bought YES shares!
                </p>
              )}
              {buyNoSuccess && (
                <p className="flex items-center gap-1 text-xs text-rekt-green">
                  <CheckCircle className="h-3 w-3" /> Bought NO shares!
                </p>
              )}
              {txError && (
                <p className="flex items-center gap-1 text-xs text-rekt-red">
                  <AlertCircle className="h-3 w-3" /> {txError}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function OnChainMarkets() {
  const { data: markets, isLoading, isError, error } = useReadContract({
    address: MARKET_FACTORY_ADDRESS,
    abi: MarketFactoryABI,
    functionName: 'getMarkets',
  })

  const { data: marketCount } = useReadContract({
    address: MARKET_FACTORY_ADDRESS,
    abi: MarketFactoryABI,
    functionName: 'getMarketCount',
  })

  const marketAddresses = (markets as Address[]) || []

  return (
    <div className="rounded-2xl border border-border bg-card/55 p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-rekt-muted text-sm">
            {TRADING_ENABLED
              ? `Trade directly on Base Sepolia. ${marketCount !== undefined ? `${Number(marketCount)} market${Number(marketCount) !== 1 ? 's' : ''} deployed.` : ''}`
              : 'Browse on-chain prediction markets.'}
          </p>
        </div>
        {TRADING_ENABLED && (
          <Link
            href="/markets/create"
            className="flex items-center gap-2 rounded-xl bg-rekt-gold px-6 py-3 text-sm font-medium text-rekt-dark transition-all hover:opacity-80"
          >
            <Plus className="h-4 w-4" />
            Create Market
          </Link>
        )}
      </div>

      {/* Contract info - demo only */}
      {TRADING_ENABLED && (
        <div className="mb-6 rounded-xl border border-rekt-border bg-rekt-card p-4">
          <div className="flex flex-wrap gap-4 text-xs text-rekt-muted">
            <div>
              <span className="text-white font-medium">Factory:</span>{' '}
              <a
                href={`https://sepolia.basescan.org/address/${MARKET_FACTORY_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rekt-blue hover:underline font-mono"
              >
                {MARKET_FACTORY_ADDRESS.slice(0, 8)}...{MARKET_FACTORY_ADDRESS.slice(-6)}
              </a>
            </div>
            <div>
              <span className="text-white font-medium">Network:</span> Base Sepolia
            </div>
          </div>
        </div>
      )}

      {TRADING_ENABLED && isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-rekt-muted">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading markets from chain...</p>
        </div>
      )}

      {TRADING_ENABLED && isError && (
        <div className="rounded-xl border border-rekt-red/30 bg-rekt-red/5 p-6 text-center">
          <AlertCircle className="h-8 w-8 text-rekt-red mx-auto mb-3" />
          <p className="text-sm text-rekt-red mb-1">Failed to load markets</p>
          <p className="text-xs text-rekt-muted">{error?.message?.slice(0, 200) || 'Unknown error'}</p>
        </div>
      )}

      {!isLoading && !isError && marketAddresses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-rekt-muted">
          <BarChart3 className="h-12 w-12 mb-4 opacity-30" />
          <p className="mb-4">No markets deployed yet</p>
          {TRADING_ENABLED && (
            <Link
              href="/markets/create"
              className="rounded-lg bg-rekt-blue px-6 py-3 text-sm font-medium text-white hover:bg-rekt-blue/80 transition-colors"
            >
              Create the First Market
            </Link>
          )}
        </div>
      )}

      {TRADING_ENABLED && marketAddresses.length > 0 && (
        <div className="grid gap-4">
          {marketAddresses.map((addr, i) => (
            <MarketCard key={addr} address={addr} index={i} />
          ))}
        </div>
      )}

      {!TRADING_ENABLED && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-rekt-muted">
          <Zap className="h-10 w-10 mb-4 text-rekt-gold opacity-50" />
          <p className="text-sm mb-2">On-chain prediction markets powered by Base</p>
          <p className="text-xs text-rekt-muted/70 mb-4">{marketCount !== undefined ? `${Number(marketCount)} markets deployed` : ''}</p>
        </div>
      )}
    </div>
  )
}
