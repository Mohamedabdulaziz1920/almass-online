'use client'

import { Button } from '@/components/ui/button'
import {
  CreditCard,
  CircleDollarSign,
  ImageIcon,
  Info,
  Languages,
  Package,
  SettingsIcon,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 تعريف عناصر القائمة
// ═══════════════════════════════════════════════════════════════════════════
const navItems = [
  { 
    name: 'معلومات الموقع', 
    nameEn: 'Site Info',
    hash: 'setting-site-info', 
    icon: Info,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'الهوية والمعلومات الأساسية',
  },
  {
    name: 'الإعدادات العامة',
    nameEn: 'Common Settings',
    hash: 'setting-common',
    icon: SettingsIcon,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'إعدادات النظام الأساسية',
  },
  {
    name: 'السلايدر',
    nameEn: 'Carousels',
    hash: 'setting-carousels',
    icon: ImageIcon,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    description: 'صور العرض الرئيسية',
  },
  { 
    name: 'اللغات', 
    nameEn: 'Languages',
    hash: 'setting-languages', 
    icon: Languages,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'لغات الموقع المدعومة',
  },
  {
    name: 'العملات',
    nameEn: 'Currencies',
    hash: 'setting-currencies',
    icon: CircleDollarSign,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'العملات المتاحة',
  },
  {
    name: 'طرق الدفع',
    nameEn: 'Payment Methods',
    hash: 'setting-payment-methods',
    icon: CreditCard,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    description: 'بوابات الدفع الإلكتروني',
  },
  {
    name: 'مواعيد التوصيل',
    nameEn: 'Delivery Dates',
    hash: 'setting-delivery-dates',
    icon: Package,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    description: 'خيارات الشحن والتوصيل',
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════════════════
const SettingNav = () => {
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)

  // ═══════════════════════════════════════════════════════════════════════════
  // 👀 مراقبة التمرير
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const sections = document.querySelectorAll('div[id^="setting-"]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            // حساب نسبة التقدم
            const index = navItems.findIndex(item => item.hash === entry.target.id)
            setProgress(((index + 1) / navItems.length) * 100)
          }
        })
      },
      { threshold: 0.6, rootMargin: '0px 0px -40% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // 📜 التمرير السلس
  // ═══════════════════════════════════════════════════════════════════════════
  const handleScroll = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      const top = section.offsetTop - 100
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-4">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🎨 العنوان */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-purple-400" />
          الإعدادات
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          تخصيص متجرك
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📊 شريط التقدم */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>التقدم</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 قائمة التنقل */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <nav className="flex md:flex-col gap-2 flex-wrap md:bg-gray-800/40 md:backdrop-blur-xl md:rounded-2xl md:border md:border-white/10 md:p-3">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = active === item.hash
          const isPassed = navItems.findIndex(i => i.hash === active) > index

          return (
            <Button
              key={item.hash}
              onClick={() => handleScroll(item.hash)}
              variant="ghost"
              className={cn(
                'relative justify-start gap-3 h-auto py-3 px-3 transition-all duration-300 group',
                'hover:bg-white/5',
                isActive && `${item.bgColor} ${item.borderColor} border`,
                !isActive && 'border border-transparent'
              )}
            >
              {/* أيقونة */}
              <div className={cn(
                'relative flex-shrink-0 p-2 rounded-lg transition-all duration-300',
                isActive ? item.bgColor : 'bg-white/5 group-hover:bg-white/10',
              )}>
                <Icon className={cn(
                  'h-4 w-4 transition-colors',
                  isActive ? item.color : 'text-gray-400 group-hover:text-white'
                )} />
                
                {/* علامة الإكمال */}
                {isPassed && (
                  <div className="absolute -top-1 -right-1 p-0.5 bg-emerald-500 rounded-full">
                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* النص */}
              <div className="flex-1 text-right hidden md:block">
                <span className={cn(
                  'block text-sm font-medium transition-colors',
                  isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                )}>
                  {item.name}
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  {item.description}
                </span>
              </div>

              {/* النص للموبايل */}
              <span className="md:hidden text-sm text-gray-300">
                {item.name}
              </span>

              {/* سهم الإشارة */}
              {isActive && (
                <ChevronLeft className={cn(
                  'h-4 w-4 hidden md:block',
                  item.color
                )} />
              )}

              {/* خط المؤشر */}
              {isActive && (
                <span className={cn(
                  'absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full hidden md:block',
                  'bg-gradient-to-b',
                  item.color.replace('text-', 'from-'),
                  item.color.replace('text-', 'to-').replace('400', '600')
                )} />
              )}
            </Button>
          )
        })}
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💡 نصيحة */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-white mb-1">
              نصيحة سريعة
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              يمكنك النقر على أي قسم للانتقال إليه مباشرة، أو التمرير لأسفل للتنقل بين الأقسام.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🔗 رابط المساعدة */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block text-center">
        <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          تحتاج مساعدة؟ 📚
        </button>
      </div>
    </div>
  )
}

export default SettingNav