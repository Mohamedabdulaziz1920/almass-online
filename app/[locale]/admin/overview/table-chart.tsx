// app/[locale]/admin/overview/table-chart.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductPrice from '@/components/shared/product/product-price'
import { getMonthName, cn } from '@/lib/utils'
import { 
  TrendingUp, 
  Package, 
  Calendar,
  ExternalLink,
  Award,
  Medal,
  Trophy
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// 📋 تعريف الأنواع
// ═══════════════════════════════════════════════════════════════
type TableChartProps = {
  labelType: 'month' | 'product'
  data: {
    label: string
    image?: string
    value: number
    id?: string
  }[]
}

// ═══════════════════════════════════════════════════════════════
// 🎨 ألوان التدرج حسب الترتيب
// ═══════════════════════════════════════════════════════════════
const rankColors = [
  {
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: Trophy,
    shadow: 'shadow-yellow-500/20',
  },
  {
    gradient: 'from-gray-300 via-gray-400 to-gray-500',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    text: 'text-gray-300',
    icon: Medal,
    shadow: 'shadow-gray-500/20',
  },
  {
    gradient: 'from-amber-600 via-orange-700 to-amber-800',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: Award,
    shadow: 'shadow-amber-500/20',
  },
]

// اللون الافتراضي للباقي
const defaultColor = {
  gradient: 'from-blue-500 via-indigo-500 to-violet-500',
  bg: 'bg-blue-500/10',
  border: 'border-blue-500/30',
  text: 'text-blue-400',
  shadow: 'shadow-blue-500/20',
}

// ═══════════════════════════════════════════════════════════════
// 📊 مكون شريط التقدم المحسن
// ═══════════════════════════════════════════════════════════════
interface ProgressBarProps {
  value: number
  gradient: string
  isTop?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  gradient,
  isTop = false 
}) => {
  const boundedValue = Math.min(100, Math.max(0, value))

  return (
    <div className="relative w-full h-2.5 sm:h-3 bg-gray-800/50 rounded-full overflow-hidden">
      {/* الخلفية المتوهجة للعناصر العلوية */}
      {isTop && (
        <div 
          className={cn(
            'absolute inset-0 opacity-30 blur-sm',
            `bg-gradient-to-l ${gradient}`
          )}
          style={{ width: `${boundedValue}%`, marginRight: 'auto', marginLeft: 0 }}
        />
      )}
      
      {/* شريط التقدم */}
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500 ease-out',
          `bg-gradient-to-l ${gradient}`,
          isTop && 'shadow-lg'
        )}
        style={{
          width: `${boundedValue}%`,
          marginRight: 'auto',
          marginLeft: 0,
        }}
      />
      
      {/* نقطة في نهاية الشريط */}
      {boundedValue > 10 && (
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white shadow-lg"
          style={{ left: `calc(${boundedValue}% - 6px)` }}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════
export default function TableChart({
  labelType = 'month',
  data = [],
}: TableChartProps) {
  // حساب النسب المئوية
  const max = Math.max(...data.map((item) => item.value))
  const dataWithPercentage = data.map((x, index) => ({
    ...x,
    label: labelType === 'month' ? getMonthName(x.label) : x.label,
    percentage: Math.round((x.value / max) * 100),
    rank: index + 1,
    color: index < 3 ? rankColors[index] : defaultColor,
  }))

  // إذا لا توجد بيانات
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800/50 mb-4">
          <Package className="h-8 w-8 text-gray-500" />
        </div>
        <p className="text-gray-400 text-sm">لا توجد بيانات لعرضها</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {dataWithPercentage.map(({ label, id, value, image, percentage, rank, color }) => {
        const isTopThree = rank <= 3
        const RankIcon = (color as any).icon

        return (
          <div
            key={label}
            className={cn(
              'group relative rounded-xl p-3 sm:p-4 transition-all duration-300',
              'hover:bg-gray-800/30',
              isTopThree && [
                color.bg,
                'border',
                color.border,
              ]
            )}
          >
            <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_2fr_auto] gap-3 sm:gap-4 items-center">
              
              {/* ═══ القسم الأول: الترتيب + الصورة/الأيقونة + الاسم ═══ */}
              <div className="flex items-center gap-3">
                {/* رقم الترتيب */}
                <div
                  className={cn(
                    'flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg font-bold text-sm',
                    isTopThree 
                      ? [color.bg, color.text, 'border', color.border]
                      : 'bg-gray-800/50 text-gray-400'
                  )}
                >
                  {isTopThree ? (
                    <RankIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span>{rank}</span>
                  )}
                </div>

                {/* الصورة أو الأيقونة */}
                {image ? (
                  <Link 
                    href={`/admin/products/${id}`}
                    className="group/link flex items-center gap-2 sm:gap-3 min-w-0"
                  >
                    {/* صورة المنتج */}
                    <div className={cn(
                      'relative shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden',
                      'border-2 transition-all duration-300',
                      isTopThree ? color.border : 'border-gray-700/50',
                      'group-hover/link:scale-105',
                      isTopThree && color.shadow
                    )}>
                      <Image
                        src={image}
                        alt={label}
                        fill
                        className="object-cover"
                      />
                      
                      {/* طبقة Hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover/link:bg-black/20 transition-colors flex items-center justify-center">
                        <ExternalLink className="h-4 w-4 text-white opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    
                    {/* اسم المنتج */}
                    <div className="min-w-0 hidden xs:block">
                      <p className={cn(
                        'font-medium text-sm truncate max-w-[120px] sm:max-w-[180px] lg:max-w-[220px]',
                        'group-hover/link:underline underline-offset-2',
                        isTopThree ? 'text-white' : 'text-gray-300'
                      )}>
                        {label}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        منتج
                      </p>
                    </div>
                  </Link>
                ) : (
                  /* للأشهر */
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={cn(
                      'flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg',
                      isTopThree ? [color.bg, color.border, 'border'] : 'bg-gray-800/50'
                    )}>
                      <Calendar className={cn(
                        'h-5 w-5 sm:h-6 sm:w-6',
                        isTopThree ? color.text : 'text-gray-400'
                      )} />
                    </div>
                    <div className="hidden xs:block">
                      <p className={cn(
                        'font-medium text-sm',
                        isTopThree ? 'text-white' : 'text-gray-300'
                      )}>
                        {label}
                      </p>
                      <p className="text-xs text-gray-500">شهر</p>
                    </div>
                  </div>
                )}
              </div>

              {/* ═══ القسم الثاني: شريط التقدم (يختفي على الموبايل الصغير) ═══ */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex-1">
                  <ProgressBar 
                    value={percentage} 
                    gradient={color.gradient}
                    isTop={isTopThree}
                  />
                </div>
                
                {/* النسبة المئوية */}
                <span className={cn(
                  'text-xs font-medium w-10 text-left',
                  isTopThree ? color.text : 'text-gray-400'
                )}>
                  {percentage}%
                </span>
              </div>

              {/* ═══ القسم الثالث: القيمة ═══ */}
              <div className={cn(
                'flex items-center justify-end gap-2 px-3 py-2 rounded-lg',
                isTopThree 
                  ? [color.bg, 'border', color.border]
                  : 'bg-gray-800/30'
              )}>
                {isTopThree && (
                  <TrendingUp className={cn('h-4 w-4 hidden sm:block', color.text)} />
                )}
                <span className={cn(
                  'font-bold text-sm sm:text-base whitespace-nowrap',
                  isTopThree ? 'text-white' : 'text-gray-300'
                )}>
                  <ProductPrice price={value} plain />
                </span>
              </div>
            </div>

            {/* شريط التقدم للموبايل */}
            <div className="mt-3 sm:hidden">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500 xs:hidden">{label}</span>
                <span className={cn(
                  'text-xs font-medium',
                  isTopThree ? color.text : 'text-gray-400'
                )}>
                  {percentage}%
                </span>
              </div>
              <ProgressBar 
                value={percentage} 
                gradient={color.gradient}
                isTop={isTopThree}
              />
            </div>
          </div>
        )
      })}

      {/* ═══ ملخص سريع ═══ */}
      <div className="mt-4 pt-4 border-t border-gray-700/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            إجمالي العناصر: {data.length}
          </span>
          <span className="text-gray-400 flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 font-medium">
              <ProductPrice price={data.reduce((sum, item) => sum + item.value, 0)} plain />
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}