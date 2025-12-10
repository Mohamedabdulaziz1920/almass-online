// app/[locale]/admin/overview/sales-category-pie-chart.tsx
'use client'

import React, { useState, useCallback } from 'react'
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Sector,
} from 'recharts'
import { PieChart as PieChartIcon, TrendingUp, Package } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════
// 🎨 تعريف الألوان المتدرجة للفئات
// ═══════════════════════════════════════════════════════════════
const CATEGORY_COLORS = [
  { 
    fill: '#10b981', 
    gradient: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-500',
    light: 'bg-emerald-500/20',
    text: 'text-emerald-400'
  },
  { 
    fill: '#3b82f6', 
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-500',
    light: 'bg-blue-500/20',
    text: 'text-blue-400'
  },
  { 
    fill: '#8b5cf6', 
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500',
    light: 'bg-violet-500/20',
    text: 'text-violet-400'
  },
  { 
    fill: '#f59e0b', 
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500',
    light: 'bg-amber-500/20',
    text: 'text-amber-400'
  },
  { 
    fill: '#ec4899', 
    gradient: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-500',
    light: 'bg-pink-500/20',
    text: 'text-pink-400'
  },
  { 
    fill: '#06b6d4', 
    gradient: 'from-cyan-500 to-teal-600',
    bg: 'bg-cyan-500',
    light: 'bg-cyan-500/20',
    text: 'text-cyan-400'
  },
  { 
    fill: '#ef4444', 
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-500',
    light: 'bg-red-500/20',
    text: 'text-red-400'
  },
  { 
    fill: '#84cc16', 
    gradient: 'from-lime-500 to-green-600',
    bg: 'bg-lime-500',
    light: 'bg-lime-500/20',
    text: 'text-lime-400'
  },
]

// ═══════════════════════════════════════════════════════════════
// 📋 تعريف أنواع البيانات
// ═══════════════════════════════════════════════════════════════
interface CategoryData {
  _id?: string
  name?: string
  totalSales?: number
  value?: number
}

interface SalesCategoryPieChartProps {
  data: CategoryData[]
}

interface ActiveShapeProps {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: CategoryData & { name: string }
  percent: number
  value: number
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    payload: CategoryData & { name: string }
    percent: number
    dataIndex: number
  }>
}

// ═══════════════════════════════════════════════════════════════
// 🎯 مكون القطاع النشط (عند التحويم)
// ═══════════════════════════════════════════════════════════════
const renderActiveShape = (props: ActiveShapeProps) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props

  return (
    <g>
      {/* الدائرة المركزية */}
      <circle cx={cx} cy={cy} r={innerRadius - 10} fill="transparent" />
      
      {/* النص المركزي */}
      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        fill="#fff"
        className="text-sm font-bold"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {payload.name || payload._id}
      </text>
      <text
        x={cx}
        y={cy + 8}
        textAnchor="middle"
        fill="#9ca3af"
        style={{ fontSize: '12px' }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <text
        x={cx}
        y={cy + 26}
        textAnchor="middle"
        fill="#10b981"
        style={{ fontSize: '13px', fontWeight: '600' }}
      >
        {formatNumber(value)} مبيعات
      </text>

      {/* القطاع الخارجي النشط */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
          transition: 'all 0.3s ease',
        }}
      />
      
      {/* الحلقة الخارجية المتوهجة */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 14}
        fill={fill}
        opacity={0.3}
      />
    </g>
  )
}

// ═══════════════════════════════════════════════════════════════
// 💡 مكون Tooltip مخصص
// ═══════════════════════════════════════════════════════════════
const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const colorIndex = payload[0].dataIndex || 0
    const color = CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length]
    
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn('w-3 h-3 rounded-full', color.bg)} />
          <span className="font-bold text-white">
            {data.name || data._id}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-6">
            <span className="text-gray-400 text-sm">المبيعات:</span>
            <span className="font-semibold text-emerald-400">
              {formatNumber(data.totalSales || data.value || 0)}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-6">
            <span className="text-gray-400 text-sm">النسبة:</span>
            <span className="font-semibold text-blue-400">
              {((payload[0].percent || 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

// ═══════════════════════════════════════════════════════════════
// 🎭 مكون حالة عدم وجود بيانات
// ═══════════════════════════════════════════════════════════════
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800/50 border border-gray-700/50 mb-4">
        <PieChartIcon className="h-8 w-8 text-gray-500" />
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">
        لا توجد بيانات متاحة
      </h4>
      <p className="text-sm text-gray-400 max-w-xs">
        لم يتم العثور على بيانات مبيعات للفئات في الفترة المحددة
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎨 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════
export default function SalesCategoryPieChart({ data }: SalesCategoryPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  // معالجة حدث التحويم
  const onPieEnter = useCallback((_: unknown, index: number) => {
    setActiveIndex(index)
  }, [])

  // التحقق من وجود البيانات
  if (!data || data.length === 0) {
    return <EmptyState />
  }

  // تحضير البيانات للرسم البياني
  const chartData = data.map((item, index) => ({
    name: item.name || item._id || `فئة ${index + 1}`,
    totalSales: item.totalSales || item.value || 0,
    _id: item._id,
  }))

  // حساب الإحصائيات
  const totalSales = chartData.reduce((sum, item) => sum + item.totalSales, 0)
  const topCategory = chartData.reduce((max, item) => 
    item.totalSales > max.totalSales ? item : max, chartData[0])

  return (
    <div className="space-y-4">
      {/* ═══════════════ ملخص سريع ═══════════════ */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">الأعلى مبيعاً</p>
            <p className="text-sm font-bold text-white truncate">{topCategory.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20">
            <Package className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">عدد الفئات</p>
            <p className="text-sm font-bold text-white">{chartData.length} فئات</p>
          </div>
        </div>
      </div>

      {/* ═══════════════ الرسم البياني ═══════════════ */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            {/* تأثير الظل */}
            <defs>
              {CATEGORY_COLORS.map((color, index) => (
                <filter key={`shadow-${index}`} id={`shadow-${index}`}>
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={color.fill} floodOpacity="0.3"/>
                </filter>
              ))}
            </defs>
            
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape as any}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="totalSales"
              onMouseEnter={onPieEnter}
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length].fill}
                  stroke="transparent"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Pie>
            
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ═══════════════ قائمة الفئات ═══════════════ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-gray-400">توزيع المبيعات حسب الفئة</span>
          <span className="text-xs text-gray-500">{chartData.length} فئات</span>
        </div>
        
        <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
          {chartData.map((item, index) => {
            const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
            const percentage = totalSales > 0 
              ? ((item.totalSales / totalSales) * 100).toFixed(1) 
              : 0
            
            return (
              <div
                key={`category-${index}`}
                className={cn(
                  'group flex items-center gap-3 p-3 rounded-xl',
                  'bg-gray-800/20 border border-gray-700/30',
                  'hover:bg-gray-800/40 hover:border-gray-600/50',
                  'transition-all duration-200 cursor-pointer',
                  activeIndex === index && 'bg-gray-800/40 border-gray-600/50'
                )}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {/* أيقونة الفئة */}
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  color.light,
                  'transition-transform duration-200 group-hover:scale-110'
                )}>
                  <div className={cn('w-3 h-3 rounded-full', color.bg)} />
                </div>
                
                {/* معلومات الفئة */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white truncate">
                      {item.name}
                    </span>
                    <span className={cn('text-sm font-bold', color.text)}>
                      {percentage}%
                    </span>
                  </div>
                  
                  {/* شريط التقدم */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-700/50 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          color.bg
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 min-w-[60px] text-left">
                      {formatNumber(item.totalSales)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ═══════════════ ملاحظة ═══════════════ */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] text-gray-500">
          مرر الماوس على الرسم لعرض التفاصيل
        </span>
      </div>
    </div>
  )
}
