// components/shared/product/product-slider.tsx
'use client'

import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import ProductCard from './product-card'
import { IProduct } from '@/lib/db/models/product.model'
import { cn } from '@/lib/utils'

interface ProductSliderProps {
  title?: string
  products: IProduct[]
  hideDetails?: boolean
  variant?: 'default' | 'deals' | 'bestseller' | 'featured' | 'compact'
  showDots?: boolean
  autoPlay?: boolean
  className?: string
}

export default function ProductSlider({
  title,
  products,
  hideDetails = false,
  variant = 'default',
  showDots = false,
  autoPlay = false,
  className,
}: ProductSliderProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  // 🔹 تحديث حالة الأزرار
  const updateScrollButtons = useCallback(() => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [api])

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    updateScrollButtons()

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
      updateScrollButtons()
    })

    api.on('reInit', updateScrollButtons)
  }, [api, updateScrollButtons])

  // 🔹 التشغيل التلقائي
  useEffect(() => {
    if (!api || !autoPlay) return

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0)
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [api, autoPlay])

  // 🔹 تحديد عدد العناصر حسب النوع
  const getItemBasis = () => {
    switch (variant) {
      case 'compact':
        return 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 xl:basis-1/7'
      case 'deals':
        return 'basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5'
      case 'bestseller':
        return 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6'
      case 'featured':
        return 'basis-[90%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4'
      default:
        return hideDetails
          ? 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6'
          : 'basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5'
    }
  }

  // 🔹 أنماط الـ Variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'deals':
        return {
          card: 'ring-1 ring-red-500/20 hover:ring-red-500/40',
          badge: 'bg-gradient-to-r from-red-500 to-orange-500',
        }
      case 'bestseller':
        return {
          card: 'ring-1 ring-emerald-500/20 hover:ring-emerald-500/40',
          badge: 'bg-gradient-to-r from-emerald-500 to-teal-500',
        }
      case 'featured':
        return {
          card: 'ring-1 ring-purple-500/20 hover:ring-purple-500/40',
          badge: 'bg-gradient-to-r from-purple-500 to-pink-500',
        }
      default:
        return {
          card: '',
          badge: 'bg-gradient-to-r from-primary to-amber-500',
        }
    }
  }

  const variantStyles = getVariantStyles()

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* 🔹 العنوان */}
      {title && (
        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-xl md:text-2xl font-bold text-foreground'>
            {title}
          </h2>
          
          {/* 🔹 عداد الشرائح */}
          {count > 1 && (
            <div className='hidden sm:flex items-center gap-2 text-sm text-muted-foreground'>
              <span className='font-semibold text-foreground'>{current + 1}</span>
              <span>/</span>
              <span>{count}</span>
            </div>
          )}
        </div>
      )}

      {/* 🔹 الكاروسيل */}
      <div className='group/slider relative'>
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: false,
            skipSnaps: false,
            dragFree: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-3 md:-ml-4'>
            {products.map((product, index) => (
              <CarouselItem
                key={product.slug}
                className={cn(
                  'pl-3 md:pl-4',
                  getItemBasis()
                )}
              >
                <div 
                  className={cn(
                    'h-full transition-all duration-300',
                    'animate-fade-in',
                    variantStyles.card
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* ✅ تم إزالة variant من هنا */}
                  <ProductCard
                    hideDetails={hideDetails}
                    hideAddToCart={variant === 'compact'}
                    hideBorder
                    product={product}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* 🔹 أزرار التنقل المحسّنة */}
          <CarouselPrevious 
            className={cn(
              'absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10',
              'w-10 h-10 md:w-12 md:h-12',
              'bg-background/90 backdrop-blur-sm',
              'border border-border/50 hover:border-primary/50',
              'shadow-lg hover:shadow-xl',
              'text-foreground hover:text-primary',
              'rounded-full',
              'opacity-0 group-hover/slider:opacity-100',
              'disabled:opacity-0',
              'transition-all duration-300',
              'hover:scale-110 hover:bg-background',
              !canScrollPrev && 'hidden'
            )}
          />

          <CarouselNext 
            className={cn(
              'absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10',
              'w-10 h-10 md:w-12 md:h-12',
              'bg-background/90 backdrop-blur-sm',
              'border border-border/50 hover:border-primary/50',
              'shadow-lg hover:shadow-xl',
              'text-foreground hover:text-primary',
              'rounded-full',
              'opacity-0 group-hover/slider:opacity-100',
              'disabled:opacity-0',
              'transition-all duration-300',
              'hover:scale-110 hover:bg-background',
              !canScrollNext && 'hidden'
            )}
          />
        </Carousel>

        {/* 🔹 تدرج الحواف */}
        <div className={cn(
          'absolute left-0 top-0 bottom-0 w-8 md:w-12',
          'bg-gradient-to-r from-background to-transparent',
          'pointer-events-none z-[5]',
          'transition-opacity duration-300',
          canScrollPrev ? 'opacity-100' : 'opacity-0'
        )} />
        
        <div className={cn(
          'absolute right-0 top-0 bottom-0 w-8 md:w-12',
          'bg-gradient-to-l from-background to-transparent',
          'pointer-events-none z-[5]',
          'transition-opacity duration-300',
          canScrollNext ? 'opacity-100' : 'opacity-0'
        )} />
      </div>

      {/* 🔹 النقاط (اختياري) */}
      {showDots && count > 1 && (
        <div className='flex items-center justify-center gap-2 mt-6'>
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                current === index 
                  ? 'w-6 bg-primary' 
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* 🔹 شريط التقدم (للموبايل) */}
      <div className='sm:hidden mt-4'>
        <div className='h-1 bg-muted rounded-full overflow-hidden'>
          <div 
            className={cn(
              'h-full rounded-full transition-all duration-300',
              variantStyles.badge
            )}
            style={{ width: `${((current + 1) / count) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}