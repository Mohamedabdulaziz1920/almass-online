// app/[locale]/admin/overview/date-range-picker.tsx
'use client'

import * as React from 'react'
import { DateRange } from 'react-day-picker'
import { PopoverClose } from '@radix-ui/react-popover'
import { useLocale } from 'next-intl'
import {
  CalendarIcon,
  ChevronDown,
  X,
  Check,
  Calendar as CalendarLucide,
  Clock,
  Sparkles,
} from 'lucide-react'

import { cn, formatDateTime } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

// ═══════════════════════════════════════════════════════════════
// 📅 خيارات التواريخ السريعة
// ═══════════════════════════════════════════════════════════════
const quickDateOptions = [
  { label: 'اليوم', days: 0 },
  { label: 'آخر 7 أيام', days: 7 },
  { label: 'آخر 14 يوم', days: 14 },
  { label: 'آخر 30 يوم', days: 30 },
  { label: 'آخر 3 أشهر', days: 90 },
  { label: 'آخر 6 أشهر', days: 180 },
  { label: 'السنة الماضية', days: 365 },
]

// ═══════════════════════════════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════
export function CalendarDateRangePicker({
  defaultDate,
  setDate,
  className,
}: {
  defaultDate?: DateRange
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  className?: string
}) {
  const locale = useLocale()
  const isRTL = locale === 'ar'
  
  const [calendarDate, setCalendarDate] = React.useState<DateRange | undefined>(
    defaultDate
  )
  const [isOpen, setIsOpen] = React.useState(false)

  // حساب عدد الأيام المحددة
  const selectedDays = React.useMemo(() => {
    if (calendarDate?.from && calendarDate?.to) {
      const diffTime = Math.abs(calendarDate.to.getTime() - calendarDate.from.getTime())
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
    return 0
  }, [calendarDate])

  // تحديد تاريخ سريع
  const handleQuickSelect = (days: number) => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - days)
    setCalendarDate({ from, to })
  }

  // تطبيق التاريخ
  const handleApply = () => {
    setDate(calendarDate)
    setIsOpen(false)
  }

  // إلغاء وإعادة التعيين
  const handleCancel = () => {
    setCalendarDate(defaultDate)
    setIsOpen(false)
  }

  // مسح التاريخ
  const handleClear = () => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    setCalendarDate({ from: thirtyDaysAgo, to: today })
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        {/* ═══════════════ زر التفعيل ═══════════════ */}
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'group relative h-10 sm:h-11 px-3 sm:px-4',
              'justify-between text-right font-medium',
              'bg-gray-800/50 hover:bg-gray-800',
              'border-gray-700/50 hover:border-yellow-500/50',
              'text-gray-300 hover:text-white',
              'rounded-xl transition-all duration-300',
              'shadow-sm hover:shadow-md hover:shadow-yellow-500/10',
              isOpen && 'border-yellow-500/50 bg-gray-800 ring-2 ring-yellow-500/20',
              !calendarDate && 'text-gray-500'
            )}
          >
            {/* أيقونة التقويم */}
            <div className={cn(
              'flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg',
              'bg-yellow-500/10 group-hover:bg-yellow-500/20',
              'transition-colors duration-300',
              isRTL ? 'ml-2 sm:ml-3' : 'mr-2 sm:mr-3'
            )}>
              <CalendarIcon className="h-4 w-4 text-yellow-400" />
            </div>

            {/* نص التاريخ */}
            <div className="flex-1 text-sm truncate">
              {calendarDate?.from ? (
                calendarDate.to ? (
                  <span className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                    <span className="font-semibold text-white">
                      {formatDateTime(calendarDate.from).dateOnly}
                    </span>
                    <span className="text-gray-500">—</span>
                    <span className="font-semibold text-white">
                      {formatDateTime(calendarDate.to).dateOnly}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium">
                      <Clock className="h-3 w-3" />
                      {selectedDays} يوم
                    </span>
                  </span>
                ) : (
                  <span className="font-semibold text-white">
                    {formatDateTime(calendarDate.from).dateOnly}
                  </span>
                )
              ) : (
                <span className="text-gray-400">اختر نطاق التاريخ...</span>
              )}
            </div>

            {/* سهم */}
            <ChevronDown className={cn(
              'h-4 w-4 text-gray-400 transition-transform duration-300',
              isRTL ? 'mr-2' : 'ml-2',
              isOpen && 'rotate-180 text-yellow-400'
            )} />
          </Button>
        </PopoverTrigger>

        {/* ═══════════════ محتوى النافذة المنبثقة ═══════════════ */}
        <PopoverContent
          onCloseAutoFocus={() => setCalendarDate(defaultDate)}
          className={cn(
            'w-auto p-0',
            'bg-gray-900 border-gray-700/50',
            'rounded-2xl shadow-2xl shadow-black/50',
            'overflow-hidden'
          )}
          align="end"
          sideOffset={8}
        >
          <div className="flex flex-col lg:flex-row">
            {/* ═══ القسم الأول: خيارات سريعة ═══ */}
            <div className="p-4 border-b lg:border-b-0 lg:border-l border-gray-800 bg-gray-800/30">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <h4 className="text-sm font-semibold text-white">
                  اختيار سريع
                </h4>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5 lg:w-36">
                {quickDateOptions.map((option) => {
                  // التحقق إذا كان الخيار محدد
                  const isSelected = selectedDays === option.days || 
                    (option.days === 0 && selectedDays === 0)
                  
                  return (
                    <button
                      key={option.days}
                      onClick={() => handleQuickSelect(option.days)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-lg text-right',
                        'transition-all duration-200',
                        isSelected
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      )}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ═══ القسم الثاني: التقويم ═══ */}
            <div className="p-4">
              {/* هيدر التقويم */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarLucide className="h-5 w-5 text-yellow-400" />
                  <h3 className="font-bold text-white">
                    اختر النطاق الزمني
                  </h3>
                </div>
                
                {/* زر المسح */}
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="h-3 w-3" />
                  إعادة تعيين
                </button>
              </div>

              {/* عرض التاريخ المحدد */}
              {calendarDate?.from && (
                <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">من:</span>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
                      {formatDateTime(calendarDate.from).dateOnly}
                    </span>
                  </div>
                  
                  {calendarDate.to && (
                    <>
                      <span className="text-gray-600">→</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">إلى:</span>
                        <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                          {formatDateTime(calendarDate.to).dateOnly}
                        </span>
                      </div>
                    </>
                  )}
                  
                  {selectedDays > 0 && (
                    <span className="px-2 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">
                      {selectedDays} يوم
                    </span>
                  )}
                </div>
              )}

              {/* التقويم */}
              <Calendar
                mode="range"
                defaultMonth={defaultDate?.from}
                selected={calendarDate}
                onSelect={setCalendarDate}
                numberOfMonths={2}
                className="rounded-xl border border-gray-800"
                classNames={{
                  months: "flex flex-col sm:flex-row gap-4",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-white font-semibold",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-gray-800 hover:bg-gray-700 rounded-lg",
                    "inline-flex items-center justify-center",
                    "text-gray-400 hover:text-white transition-colors"
                  ),
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: cn(
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                    "first:[&:has([aria-selected])]:rounded-r-md",
                    "last:[&:has([aria-selected])]:rounded-l-md"
                  ),
                  day: cn(
                    "h-9 w-9 p-0 font-normal rounded-lg",
                    "hover:bg-gray-800 hover:text-white",
                    "focus:bg-gray-800 focus:text-white",
                    "aria-selected:opacity-100 transition-colors"
                  ),
                  day_selected: cn(
                    "bg-yellow-500 text-black hover:bg-yellow-400",
                    "focus:bg-yellow-500 focus:text-black font-semibold"
                  ),
                  day_today: "bg-gray-800 text-yellow-400 font-semibold",
                  day_outside: "text-gray-600 opacity-50",
                  day_disabled: "text-gray-600 opacity-30",
                  day_range_middle: "aria-selected:bg-yellow-500/20 aria-selected:text-yellow-400",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>

          {/* ═══ أزرار الإجراءات ═══ */}
          <div className="flex items-center justify-between gap-3 p-4 border-t border-gray-800 bg-gray-800/30">
            {/* معلومات */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>اختر تاريخ البداية والنهاية</span>
            </div>

            {/* الأزرار */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <PopoverClose asChild>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className={cn(
                    'flex-1 sm:flex-none h-10 px-4',
                    'bg-gray-800 hover:bg-gray-700',
                    'border-gray-700 hover:border-gray-600',
                    'text-gray-300 hover:text-white',
                    'rounded-xl transition-all'
                  )}
                >
                  <X className="h-4 w-4 ml-2" />
                  إلغاء
                </Button>
              </PopoverClose>
              
              <PopoverClose asChild>
                <Button
                  onClick={handleApply}
                  disabled={!calendarDate?.from || !calendarDate?.to}
                  className={cn(
                    'flex-1 sm:flex-none h-10 px-5',
                    'bg-gradient-to-r from-yellow-400 to-orange-500',
                    'hover:from-yellow-500 hover:to-orange-600',
                    'text-black font-semibold',
                    'rounded-xl transition-all',
                    'shadow-lg shadow-yellow-500/25',
                    'hover:shadow-yellow-500/40',
                    'hover:scale-[1.02] active:scale-[0.98]',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                  )}
                >
                  <Check className="h-4 w-4 ml-2" />
                  تطبيق
                </Button>
              </PopoverClose>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}