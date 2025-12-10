// app/admin/overview/sales-area-chart.tsx
'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp, Calendar } from 'lucide-react'

import ProductPrice from '@/components/shared/product/product-price'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'

// ═══════════════════ Types ═══════════════════
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

interface ChartData {
  date: string
  totalSales: number
}

interface AxisTickProps {
  x?: number
  y?: number
  payload?: {
    value: string | number
  }
}

interface DotProps {
  cx?: number
  cy?: number
  payload?: ChartData
}

// ═══════════════════ Custom Tooltip ═══════════════════
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="animate-fade-in-up">
        <Card className="border-2 border-[#e6a21d]/30 shadow-2xl shadow-[#e6a21d]/20 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95">
          <CardContent className="p-4">
            {/* Date */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e6a21d] to-[#cf921a] flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {label && formatDateTime(new Date(label)).dateOnly}
              </p>
            </div>

            {/* Revenue */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <TrendingUp className="h-3 w-3" />
                <span>Total Revenue</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-[#e6a21d] via-[#cf921a] to-[#b88217] bg-clip-text text-transparent">
                <ProductPrice price={payload[0].value} plain />
              </div>
            </div>

            {/* Indicator Dot */}
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e6a21d] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-[#e6a21d] to-[#cf921a]"></span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  return null
}

// ═══════════════════ Custom X Axis Tick ═══════════════════
const CustomXAxisTick: React.FC<AxisTickProps> = ({ x = 0, y = 0, payload }) => {
  if (!payload?.value) return null

  const date = new Date(payload.value)
  const formattedDate = formatDateTime(date).dateOnly

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        className="fill-gray-500 dark:fill-gray-400 text-xs font-medium"
      >
        {formattedDate}
      </text>
    </g>
  )
}

// ═══════════════════ Custom Y Axis Tick ═══════════════════
const CustomYAxisTick: React.FC<AxisTickProps> = ({ x = 0, y = 0, payload }) => {
  if (!payload?.value) return null

  const value = typeof payload.value === 'number' ? payload.value : parseFloat(String(payload.value))
  const formattedValue = value >= 1000 ? `${value / 1000}k` : value

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        className="fill-gray-500 dark:fill-gray-400 text-xs font-semibold"
      >
        ${formattedValue}
      </text>
    </g>
  )
}

// ═══════════════════ Custom Dot ═══════════════════
const CustomDot: React.FC<DotProps> = ({ cx = 0, cy = 0, payload }) => {
  if (!payload?.totalSales) return null

  return (
    <g>
      {/* Outer glow */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#e6a21d"
        opacity={0.2}
        className="animate-pulse"
      />
      {/* Inner dot */}
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="url(#dotGradient)"
        stroke="#fff"
        strokeWidth={2}
        className="drop-shadow-lg"
      />
    </g>
  )
}

// ═══════════════════ Main Component ═══════════════════
export default function SalesAreaChart({ data }: { data: ChartData[] }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {/* Gradient Definitions */}
          <defs>
            {/* Area Fill Gradient */}
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="#e6a21d"
                stopOpacity={isDark ? 0.4 : 0.3}
              />
              <stop
                offset="50%"
                stopColor="#cf921a"
                stopOpacity={isDark ? 0.2 : 0.15}
              />
              <stop
                offset="100%"
                stopColor="#b88217"
                stopOpacity={0.05}
              />
            </linearGradient>

            {/* Stroke Gradient */}
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b88217" />
              <stop offset="50%" stopColor="#e6a21d" />
              <stop offset="100%" stopColor="#cf921a" />
            </linearGradient>

            {/* Dot Gradient */}
            <linearGradient id="dotGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e6a21d" />
              <stop offset="100%" stopColor="#cf921a" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid */}
          <CartesianGrid
            horizontal={true}
            vertical={false}
            stroke={isDark ? '#374151' : '#e5e7eb'}
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />

          {/* X Axis */}
          <XAxis
            dataKey="date"
            tick={<CustomXAxisTick />}
            interval="preserveStartEnd"
            axisLine={{
              stroke: isDark ? '#4b5563' : '#d1d5db',
              strokeWidth: 2,
            }}
            tickLine={false}
          />

          {/* Y Axis */}
          <YAxis
            tick={<CustomYAxisTick />}
            axisLine={false}
            tickLine={false}
            width={60}
          />

          {/* Tooltip */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: '#e6a21d',
              strokeWidth: 2,
              strokeDasharray: '5 5',
            }}
          />

          {/* Area */}
          <Area
            type="monotone"
            dataKey="totalSales"
            stroke="url(#strokeGradient)"
            strokeWidth={3}
            fill="url(#colorGradient)"
            fillOpacity={1}
            dot={<CustomDot />}
            activeDot={{
              r: 6,
              fill: '#e6a21d',
              stroke: '#fff',
              strokeWidth: 3,
              filter: 'url(#glow)',
            }}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 rounded-full bg-gradient-to-r from-[#b88217] via-[#e6a21d] to-[#cf921a]"></div>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Revenue Trend
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#e6a21d] to-[#cf921a] border-2 border-white dark:border-gray-800 shadow-lg"></div>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Daily Sales
          </span>
        </div>
      </div>
    </div>
  )
}