'use client'

import { ShoppingCart, ShoppingBag, Sparkles } from 'lucide-react'
import Link from 'next/link'
import useIsMounted from '@/hooks/use-is-mounted'
import useShowSidebar from '@/hooks/use-cart-sidebar'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import { useLocale, useTranslations } from 'next-intl'
import { getDirection } from '@/i18n-config'
import { useEffect, useState } from 'react'

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

  // Animation state for when items are added
  const [isAnimating, setIsAnimating] = useState(false)
  const [prevCount, setPrevCount] = useState(cartItemsCount)

  useEffect(() => {
    if (cartItemsCount > prevCount) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 600)
      return () => clearTimeout(timer)
    }
    setPrevCount(cartItemsCount)
  }, [cartItemsCount, prevCount])

  return (
    <Link
      href="/cart"
      className={cn(
        'relative flex items-center gap-2 px-3 py-2 rounded-xl',
        'transition-all duration-300 ease-out',
        'hover:bg-white/10',
        'group',
        // Glow effect when has items
        cartItemsCount > 0 && 'hover:shadow-lg hover:shadow-primary/20'
      )}
    >
      {/* Cart Icon Container */}
      <div className="relative">
        {/* Background Glow Effect */}
        {cartItemsCount > 0 && (
          <div
            className={cn(
              'absolute inset-0 rounded-full blur-md',
              'bg-gradient-to-r from-primary/40 to-amber-500/40',
              'opacity-0 group-hover:opacity-100',
              'transition-opacity duration-300',
              '-z-10 scale-150'
            )}
          />
        )}

        {/* Cart Icon */}
        <div
          className={cn(
            'relative transition-all duration-300',
            'group-hover:scale-110',
            isAnimating && 'animate-cart-bounce'
          )}
        >
          <ShoppingCart
            className={cn(
              'h-7 w-7 transition-colors duration-200',
              cartItemsCount > 0 ? 'text-primary' : 'text-gray-300',
              'group-hover:text-primary'
            )}
          />

          {/* Sparkle Effect when animating */}
          {isAnimating && (
            <>
              <Sparkles
                className={cn(
                  'absolute -top-2 -right-2 h-4 w-4 text-yellow-400',
                  'animate-ping'
                )}
              />
              <Sparkles
                className={cn(
                  'absolute -top-1 -left-1 h-3 w-3 text-amber-400',
                  'animate-ping animation-delay-100'
                )}
              />
            </>
          )}
        </div>

        {/* Badge */}
        {isMounted && cartItemsCount > 0 && (
          <span
            className={cn(
              'absolute flex items-center justify-center',
              'min-w-[20px] h-5 px-1.5',
              'text-xs font-bold',
              'rounded-full',
              'bg-gradient-to-r from-red-500 to-rose-600',
              'text-white',
              'border-2 border-gray-900',
              'shadow-lg shadow-red-500/30',
              'transition-all duration-300',
              // Position based on RTL
              isRTL ? '-top-2 -left-2' : '-top-2 -right-2',
              // Animation
              isAnimating && 'animate-badge-pop',
              // Scale for large numbers
              cartItemsCount >= 10 && 'text-[10px] min-w-[24px]',
              cartItemsCount >= 100 && 'text-[9px] min-w-[28px]'
            )}
          >
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </span>
        )}
      </div>

      {/* Text Label */}
      <div className="hidden sm:flex flex-col items-start">
        <span className="text-[10px] text-gray-400 leading-tight">
          {t('Header.Your')}
        </span>
        <span
          className={cn(
            'text-sm font-bold leading-tight transition-colors duration-200',
            cartItemsCount > 0 ? 'text-white' : 'text-gray-300',
            'group-hover:text-white'
          )}
        >
          {t('Header.Cart')}
        </span>
      </div>

      {/* Total Price Preview (optional) */}
      {isMounted && cartItemsCount > 0 && (
        <div className="hidden lg:block mr-2 pr-2 border-r border-gray-700">
          <span className="text-xs text-primary font-semibold">
            {items
              .reduce((a, c) => a + c.price * c.quantity, 0)
              .toFixed(2)}{' '}
            $
          </span>
        </div>
      )}

      {/* Sidebar Arrow Indicator */}
      {showSidebar && (
        <div
          className={cn(
            'absolute top-full mt-2',
            'w-0 h-0',
            'border-l-[8px] border-r-[8px] border-b-[10px]',
            'border-l-transparent border-r-transparent',
            'border-b-background',
            'z-50',
            // Position based on RTL
            isRTL ? 'left-4' : 'right-4',
            // Animation
            'animate-fade-in-up'
          )}
        />
      )}

      {/* Hover Ring Effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-xl',
          'border border-transparent',
          'group-hover:border-primary/30',
          'transition-all duration-300',
          'pointer-events-none'
        )}
      />
    </Link>
  )
}