// app/admin/admin-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Settings,
  ChevronLeft,
  Sparkles
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// 📋 تعريف الروابط مع الأيقونات والألوان
// ═══════════════════════════════════════════════════════════════
const links = [
  {
    title: 'Overview',
    href: '/admin/overview',
    icon: LayoutDashboard,
    gradient: 'from-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/25',
    bgHover: 'hover:bg-blue-500/10',
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
    gradient: 'from-violet-500 to-purple-500',
    shadowColor: 'shadow-violet-500/25',
    bgHover: 'hover:bg-violet-500/10',
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    gradient: 'from-emerald-500 to-green-500',
    shadowColor: 'shadow-emerald-500/25',
    bgHover: 'hover:bg-emerald-500/10',
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
    gradient: 'from-orange-500 to-amber-500',
    shadowColor: 'shadow-orange-500/25',
    bgHover: 'hover:bg-orange-500/10',
  },
  {
    title: 'Pages',
    href: '/admin/web-pages',
    icon: FileText,
    gradient: 'from-pink-500 to-rose-500',
    shadowColor: 'shadow-pink-500/25',
    bgHover: 'hover:bg-pink-500/10',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    gradient: 'from-slate-500 to-gray-500',
    shadowColor: 'shadow-slate-500/25',
    bgHover: 'hover:bg-slate-500/10',
  },
]

// ═══════════════════════════════════════════════════════════════
// 🧩 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════
export function AdminNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const t = useTranslations('Admin')

  return (
    <nav
      className={cn(
        'flex items-center gap-1 lg:gap-2',
        className
      )}
      {...props}
    >
      {links.map((item) => {
        const isActive = pathname.includes(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className="group relative"
          >
            {/* ═══ الزر/الرابط ═══ */}
            <div
              className={cn(
                // الأساسيات
                'relative flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2.5',
                'rounded-xl font-medium text-sm',
                'transition-all duration-300 ease-out',
                'border border-transparent',
                
                // الحالة النشطة
                isActive ? [
                  'bg-gradient-to-r',
                  item.gradient,
                  'text-white',
                  'shadow-lg',
                  item.shadowColor,
                  'border-white/20',
                  'scale-105',
                ] : [
                  // الحالة العادية
                  'text-gray-300',
                  'hover:text-white',
                  item.bgHover,
                  'hover:border-white/10',
                  'hover:scale-102',
                ]
              )}
            >
              {/* الأيقونة */}
              <Icon 
                className={cn(
                  'h-4 w-4 lg:h-5 lg:w-5 transition-all duration-300',
                  isActive 
                    ? 'drop-shadow-lg' 
                    : 'group-hover:scale-110'
                )} 
              />
              
              {/* النص */}
              <span className={cn(
                'hidden sm:inline-block whitespace-nowrap',
                'transition-all duration-300',
                isActive && 'font-semibold'
              )}>
                {t(item.title)}
              </span>

              {/* مؤشر الصفحة النشطة */}
              {isActive && (
                <>
                  {/* النقطة المتوهجة */}
                  <Sparkles className="h-3 w-3 animate-pulse hidden lg:block" />
                  
                  {/* الخط السفلي المتوهج */}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-white/50 rounded-full blur-sm" />
                </>
              )}
            </div>

            {/* ═══ Tooltip للموبايل ═══ */}
            <div className={cn(
              'absolute -bottom-12 left-1/2 -translate-x-1/2',
              'px-3 py-1.5 rounded-lg',
              'bg-gray-900 text-white text-xs font-medium',
              'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
              'transition-all duration-200 delay-300',
              'shadow-xl border border-white/10',
              'sm:hidden', // يظهر فقط على الموبايل
              'z-50 whitespace-nowrap'
            )}>
              {t(item.title)}
              {/* السهم */}
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-t border-white/10" />
            </div>
          </Link>
        )
      })}
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎨 نسخة بديلة: قائمة عمودية (للـ Sidebar)
// ═══════════════════════════════════════════════════════════════
export function AdminNavVertical({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const t = useTranslations('Admin')

  return (
    <nav
      className={cn(
        'flex flex-col gap-2 p-4',
        className
      )}
      {...props}
    >
      {/* العنوان */}
      <div className="px-3 py-2 mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          القائمة الرئيسية
        </h3>
      </div>

      {links.map((item) => {
        const isActive = pathname.includes(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              // الأساسيات
              'group relative flex items-center gap-3 px-4 py-3',
              'rounded-xl font-medium text-sm',
              'transition-all duration-300 ease-out',
              'border border-transparent',
              
              // الحالة النشطة
              isActive ? [
                'bg-gradient-to-r',
                item.gradient,
                'text-white',
                'shadow-lg',
                item.shadowColor,
                'border-white/20',
              ] : [
                // الحالة العادية
                'text-gray-400',
                'hover:text-white',
                'hover:bg-white/5',
                'hover:border-white/10',
              ]
            )}
          >
            {/* شريط جانبي للعنصر النشط */}
            {isActive && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/50 rounded-l-full" />
            )}

            {/* الأيقونة */}
            <div className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300',
              isActive 
                ? 'bg-white/20' 
                : 'bg-gray-800 group-hover:bg-gray-700'
            )}>
              <Icon className={cn(
                'h-5 w-5 transition-transform duration-300',
                !isActive && 'group-hover:scale-110'
              )} />
            </div>
            
            {/* النص */}
            <span className="flex-1">
              {t(item.title)}
            </span>

            {/* السهم */}
            <ChevronLeft className={cn(
              'h-4 w-4 transition-all duration-300',
              'opacity-0 -translate-x-2',
              'group-hover:opacity-100 group-hover:translate-x-0',
              isActive && 'opacity-100 translate-x-0'
            )} />
          </Link>
        )
      })}
    </nav>
  )
}