// components/shared/header/cart-button.tsx - Alternative Version
'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import useIsMounted from '@/hooks/use-is-mounted'
import useShowSidebar from '@/hooks/use-cart-sidebar'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import { useLocale, useTranslations } from 'next-intl'
import { getDirection } from '@/i18n-config'

export default function CartButton() {
  const isMounted = useIsMounted()
  const {
    cart: { items },
  } = useCartStore()
  const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
  const showSidebar = useShowSidebar()
  const t = useTranslations()
  const locale = useLocale()
  const isRTL = getDirection(locale) === 'rtl'

  return (
    <Link 
      href='/cart' 
      className='group relative'
    >
      {/* 🔹 الحاوية الرئيسية */}
      <div className='relative flex items-center gap-3 px-4 py-2.5
                      bg-white/10 hover:bg-white/15
                      backdrop-blur-sm
                      rounded-2xl
                      border border-white/10 hover:border-amber-500/30
                      transition-all duration-300
                      hover:shadow-lg hover:shadow-amber-500/10'>
        
        {/* 🔹 أيقونة العربة مع الـ Badge */}
        <div className='relative'>
          {/* 🔹 خلفية الأيقونة */}
          <div className={cn(
            `p-2.5 rounded-xl transition-all duration-300`,
            cartItemsCount > 0
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30'
              : 'bg-white/10 group-hover:bg-white/20'
          )}>
            <ShoppingCart className={cn(
              'h-5 w-5 transition-all duration-300',
              cartItemsCount > 0 
                ? 'text-white' 
                : 'text-gray-300 group-hover:text-white'
            )} />
          </div>

          {/* 🔹 Badge العدد */}
          {isMounted && cartItemsCount > 0 && (
            <div className={cn(
              `absolute -top-2 flex items-center justify-center
               min-w-[22px] h-[22px] px-1
               bg-gradient-to-r from-red-500 to-pink-600
               text-white text-xs font-bold
               rounded-full
               shadow-lg shadow-red-500/40
               border-2 border-gray-900
               animate-in zoom-in duration-200`,
              isRTL ? '-right-2' : '-left-2'
            )}>
              <span className={cn(
                cartItemsCount >= 10 && 'text-[10px]',
                cartItemsCount >= 100 && 'text-[8px]'
              )}>
                {cartItemsCount > 99 ? '99+' : cartItemsCount}
              </span>
            </div>
          )}
        </div>

        {/* 🔹 النص والسعر */}
        <div className='flex flex-col'>
          <span className='text-[11px] text-gray-400 leading-tight'>
            {t('Header.Cart')}
          </span>
          <span className='text-sm font-bold text-white leading-tight'>
            {isMounted && cartItemsCount > 0 
              ? `${cartItemsCount} عناصر`
              : 'فارغة'
            }
          </span>
        </div>

        {/* 🔹 الخط العمودي */}
        <div className='hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent'></div>

        {/* 🔹 رمز الدخول */}
        <div className='hidden sm:flex items-center justify-center w-8 h-8 
                        rounded-full bg-white/5 
                        group-hover:bg-amber-500/20
                        transition-colors duration-200'>
          <svg className='w-4 h-4 text-gray-400 group-hover:text-amber-400 
                          transition-colors duration-200
                          rtl:rotate-180' 
               fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </div>
      </div>

      {/* 🔹 سهم Sidebar */}
      {showSidebar && (
        <div className={cn(
          `absolute left-1/2 -translate-x-1/2 -bottom-4 z-20`,
          'w-0 h-0 border-l-[10px] border-r-[10px] border-b-[12px]',
          'border-transparent border-b-white dark:border-b-gray-800',
          'animate-bounce drop-shadow-lg'
        )} style={{ animationDuration: '1.5s' }}></div>
      )}
    </Link>
  )
}