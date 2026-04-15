'use client'

import { useEffect, useRef, useMemo } from 'react'
import { createChart, ColorType, CandlestickSeries, AreaSeries, type IChartApi } from 'lightweight-charts'

function generateCandlestickData(days: number, startPrice: number, seed?: number) {
  const data = []
  let price = startPrice
  const now = new Date()
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    const time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    const volatility = 0.02 + Math.random() * 0.04
    const drift = (Math.random() - 0.48) * volatility
    const open = price
    const close = price * (1 + drift)
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5)
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5)
    
    data.push({ time, open, high, low, close })
    price = close
  }

  return data
}

function generateAreaData(days: number, startPrice: number) {
  const data = []
  let price = startPrice
  const now = new Date()
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    const time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    
    const drift = (Math.random() - 0.48) * 0.03
    price = Math.max(0.01, price * (1 + drift))
    
    data.push({ time, value: price })
  }

  return data
}

interface PriceChartProps {
  type?: 'candlestick' | 'area'
  days?: number
  startPrice?: number
  height?: number
  accentColor?: string
}

export default function PriceChart({
  type = 'area',
  days = 90,
  startPrice = 0.5,
  height = 300,
  accentColor = '#6EC8FF',
}: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)

  const data = useMemo(() => {
    if (type === 'candlestick') {
      return generateCandlestickData(days, startPrice)
    }
    return generateAreaData(days, startPrice)
  }, [type, days, startPrice])

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6B7280',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.04)' },
        horzLines: { color: 'rgba(255,255,255,0.04)' },
      },
      crosshair: {
        vertLine: { color: 'rgba(110,200,255,0.3)', width: 1, style: 2 },
        horzLine: { color: 'rgba(110,200,255,0.3)', width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.1)',
        timeVisible: false,
      },
      width: containerRef.current.clientWidth,
      height,
    })

    if (type === 'candlestick') {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: '#00E576',
        downColor: '#FF4D4D',
        borderDownColor: '#FF4D4D',
        borderUpColor: '#00E576',
        wickDownColor: '#FF4D4D',
        wickUpColor: '#00E576',
      })
      series.setData(data as any)
    } else {
      const series = chart.addSeries(AreaSeries, {
        lineColor: accentColor,
        topColor: `${accentColor}40`,
        bottomColor: `${accentColor}05`,
        lineWidth: 2,
      })
      series.setData(data as any)
    }

    chart.timeScale().fitContent()
    chartRef.current = chart

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data, type, height, accentColor])

  return <div ref={containerRef} className="w-full" />
}
