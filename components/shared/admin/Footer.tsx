// components/shared/admin/Footer.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import useCartStore from '@/hooks/use-cart-store'
import { cn } from '@/lib/utils'
import {
  Home,
  ShoppingCart,
  User,
  Package,
  Heart,
  ArrowUp,
  LayoutDashboard,
  Settings,
} from 'lucide-react'

export default function Footer() {
  const { cart } = useCartStore()
  const pathname = usePathname()
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const currentYear = new Date().getFullYear()
  const isAdmin = pathname.startsWith('/admin')

  // روابط التنقل السفلي للأدمن
  const adminNavLinks = [
    { 
      href: '/admin/overview', 
      icon: LayoutDashboard, 
      label: 'الرئيسية', 
      active: pathname === '/admin/overview' 
    },
    { 
      href: '/admin/products', 
      icon: Package, 
      label: 'المنتجات', 
      active: pathname.includes('/products') 
    },
    { 
      href: '/admin/orders', 
      icon: ShoppingCart, 
      label: 'الطلبات', 
      active: pathname.includes('/orders'),
      badge: 3 
    },
    { 
      href: '/admin/users', 
      icon: User, 
      label: 'المستخدمين', 
      active: pathname.includes('/users') 
    },
    { 
      href: '/admin/settings', 
      icon: Settings, 
      label: 'الإعدادات', 
      active: pathname.includes('/settings') 
    },
  ]

  // روابط التنقل للموقع الرئيسي
  const mainNavLinks = [
    { href: '/', icon: Home, label: 'الرئيسية', active: pathname === '/' },
    { href: '/products', icon: Package, label: 'المنتجات', active: pathname.includes('/products') },
    { href: '/cart', icon: ShoppingCart, label: 'السلة', active: pathname === '/cart', badge: cart.items.length },
    { href: '/account', icon: User, label: 'حسابي', active: pathname === '/account' },
  ]

  const navLinks = isAdmin ? adminNavLinks : mainNavLinks

  return (
    <footer dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ═══════════════ الفوتر الرئيسي ═══════════════ */}
      <div className="border-t bg-gray-900 border-gray-800/50 hidden md:block">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* حقوق الملكية */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>صُنع بـ</span>
              <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-pulse" />
              <Link
                href="https://mohammed-almalgami.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Mohammed Almalgami
              </Link>
            </div>

            {/* الإصدار */}
            <div className="flex items-center gap-2 rounded-full bg-yellow-400/10 px-4 py-1.5 border border-yellow-400/20">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-yellow-400">v2.0.0</span>
            </div>

            {/* حقوق النشر */}
            <p className="text-xs text-gray-500">
              © {currentYear} جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════ شريط التنقل السفلي للموبايل ═══════════════ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50 safe-area-bottom">
        {/* الشريط الملون */}
        <div className="h-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
        
        <div className="flex items-center justify-around py-2 px-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-0',
                  link.active
                    ? 'text-yellow-400'
                    : 'text-gray-400 active:text-yellow-400'
                )}
              >
                {/* الخلفية النشطة */}
                {link.active && (
                  <span className="absolute inset-0 rounded-lg bg-yellow-400/10" />
                )}

                {/* الأيقونة */}
                <div className="relative z-10">
                  <Icon className={cn(
                    'h-5 w-5',
                    link.active && 'scale-110'
                  )} />
                  {link.badge && link.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {link.badge > 9 ? '9+' : link.badge}
                    </span>
                  )}
                </div>

                {/* النص */}
                <span className={cn(
                  'relative z-10 text-[10px] font-medium truncate max-w-full',
                  link.active && 'font-semibold'
                )}>
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* ═══════════════ زر الصعود للأعلى ═══════════════ */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'fixed z-40 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full',
          'bg-gradient-to-r from-yellow-400 to-orange-500',
          'text-black shadow-lg',
          'hover:scale-110 active:scale-95',
          'transition-all duration-300',
          'bottom-16 md:bottom-6',
          isRTL ? 'left-3 sm:left-4' : 'right-3 sm:right-4'
        )}
        aria-label="الصعود للأعلى"
      >
        <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Spacer للموبايل */}
      <div className="h-16 md:hidden" />
    </footer>
  )
}