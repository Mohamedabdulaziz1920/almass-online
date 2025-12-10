// components/shared/home/home-carousel.tsx
'use client'

import * as React from 'react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { ICarousel } from '@/types'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

export function HomeCarousel({ items }: { items: ICarousel[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  )

  const t = useTranslations('Home')

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  const toggleAutoplay = useCallback(() => {
    if (isPlaying) {
      plugin.current.stop()
    } else {
      plugin.current.play()
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  return (
    <div 
      className='relative w-full group'
      onMouseEnter={() => {
        setIsHovered(true)
        plugin.current.stop()
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        if (isPlaying) plugin.current.play()
      }}
    >
      <Carousel
        dir='ltr'
        plugins={[plugin.current]}
        className='w-full'
        setApi={setApi}
        opts={{
          loop: true,
          align: 'start',
        }}
      >
        <CarouselContent className='-ml-0'>
          {items.map((item, index) => (
            <CarouselItem key={item.title} className='pl-0'>
              <Link href={item.url} className='block'>
                <div className='relative w-full aspect-[16/9] md:aspect-[16/6] lg:aspect-[21/9] overflow-hidden'>
                  {/* 🔹 صورة الخلفية */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={cn(
                      'object-cover transition-transform duration-[2s] ease-out',
                      current === index ? 'scale-105' : 'scale-100'
                    )}
                    priority={index === 0}
                    quality={90}
                  />

                  {/* 🔹 التدرج الداكن */}
                  <div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent' />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

                  {/* 🔹 تأثير الجزيئات */}
                  <div className='absolute inset-0 opacity-30'>
                    <div className='absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping' 
                         style={{ animationDuration: '3s', animationDelay: '0s' }} />
                    <div className='absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping' 
                         style={{ animationDuration: '4s', animationDelay: '1s' }} />
                    <div className='absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-ping' 
                         style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
                  </div>

                  {/* 🔹 المحتوى */}
                  <div className='absolute inset-0 flex items-center'>
                    <div className='container mx-auto px-6 md:px-12 lg:px-20'>
                      <div className='max-w-2xl'>
                        {/* 🔹 Badge */}
                        <div className={cn(
                          'inline-flex items-center gap-2 px-4 py-1.5 mb-4',
                          'bg-white/10 backdrop-blur-sm rounded-full',
                          'border border-white/20',
                          'transform transition-all duration-700',
                          current === index 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-4 opacity-0'
                        )}
                        style={{ transitionDelay: '200ms' }}
                        >
                          <span className='w-2 h-2 rounded-full bg-primary animate-pulse' />
                          <span className='text-white/90 text-xs md:text-sm font-medium'>
                            {t('New Arrival') || 'جديد'}
                          </span>
                        </div>

                        {/* 🔹 العنوان */}
                        <h2 className={cn(
                          'text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4',
                          'text-white leading-tight',
                          'transform transition-all duration-700',
                          current === index 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-8 opacity-0'
                        )}
                        style={{ transitionDelay: '400ms' }}
                        >
                          <span className='bg-gradient-to-r from-white via-primary-foreground to-white bg-clip-text'>
                            {t(`${item.title}`)}
                          </span>
                        </h2>

                        {/* 🔹 الوصف (اختياري) */}
                        {item.description && (
                          <p className={cn(
                            'text-white/80 text-sm md:text-base lg:text-lg mb-6 max-w-lg',
                            'transform transition-all duration-700',
                            current === index 
                              ? 'translate-y-0 opacity-100' 
                              : 'translate-y-8 opacity-0'
                          )}
                          style={{ transitionDelay: '500ms' }}
                          >
                            {item.description}
                          </p>
                        )}

                        {/* 🔹 الأزرار */}
                        <div className={cn(
                          'flex flex-wrap gap-3',
                          'transform transition-all duration-700',
                          current === index 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-8 opacity-0'
                        )}
                        style={{ transitionDelay: '600ms' }}
                        >
                          <Button 
                            size='lg'
                            className='group/btn relative overflow-hidden
                                       bg-gradient-to-r from-primary to-amber-500
                                       hover:from-primary/90 hover:to-amber-500/90
                                       text-primary-foreground font-semibold
                                       px-6 md:px-8 py-3 md:py-6
                                       rounded-full
                                       shadow-lg shadow-primary/30
                                       hover:shadow-xl hover:shadow-primary/40
                                       hover:scale-105 active:scale-95
                                       transition-all duration-300'
                          >
                            {/* 🔹 تأثير اللمعة */}
                            <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                             translate-x-[-100%] group-hover/btn:translate-x-[100%]
                                             transition-transform duration-700' />
                            <span className='relative flex items-center gap-2'>
                              {t(`${item.buttonCaption}`)}
                              <ArrowRight className='w-4 h-4 group-hover/btn:translate-x-1 
                                                     rtl:rotate-180 rtl:group-hover/btn:-translate-x-1
                                                     transition-transform duration-300' />
                            </span>
                          </Button>

                          <Button 
                            variant='outline'
                            size='lg'
                            className='bg-white/10 backdrop-blur-sm
                                       border-white/30 hover:border-white/50
                                       text-white hover:text-white
                                       hover:bg-white/20
                                       px-6 md:px-8 py-3 md:py-6
                                       rounded-full
                                       transition-all duration-300
                                       hidden sm:flex'
                          >
                            {t('Learn More') || 'اعرف المزيد'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 🔹 أزرار التنقل */}
        <CarouselPrevious 
          className={cn(
            'absolute left-4 md:left-8 top-1/2 -translate-y-1/2',
            'w-10 h-10 md:w-12 md:h-12',
            'bg-white/10 backdrop-blur-md',
            'border border-white/20 hover:border-white/40',
            'text-white hover:text-white',
            'hover:bg-white/20',
            'rounded-full',
            'opacity-0 group-hover:opacity-100',
            'transition-all duration-300',
            'hover:scale-110',
            'disabled:opacity-30'
          )}
        >
          <ChevronLeft className='w-5 h-5 md:w-6 md:h-6' />
        </CarouselPrevious>

        <CarouselNext 
          className={cn(
            'absolute right-4 md:right-8 top-1/2 -translate-y-1/2',
            'w-10 h-10 md:w-12 md:h-12',
            'bg-white/10 backdrop-blur-md',
            'border border-white/20 hover:border-white/40',
            'text-white hover:text-white',
            'hover:bg-white/20',
            'rounded-full',
            'opacity-0 group-hover:opacity-100',
            'transition-all duration-300',
            'hover:scale-110',
            'disabled:opacity-30'
          )}
        >
          <ChevronRight className='w-5 h-5 md:w-6 md:h-6' />
        </CarouselNext>
      </Carousel>

      {/* ═══════════════════════════════════════════════════════════════════════════
          🔹 شريط التحكم السفلي
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div className='absolute bottom-4 md:bottom-8 left-0 right-0 z-20'>
        <div className='container mx-auto px-6 md:px-12 lg:px-20'>
          <div className='flex items-center justify-between'>
            {/* 🔹 النقاط */}
            <div className='flex items-center gap-2 md:gap-3'>
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    'group relative h-2 rounded-full transition-all duration-500 overflow-hidden',
                    current === index 
                      ? 'w-8 md:w-12 bg-white' 
                      : 'w-2 md:w-3 bg-white/40 hover:bg-white/60'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {current === index && (
                    <span 
                      className='absolute inset-0 bg-gradient-to-r from-primary to-amber-500 rounded-full'
                      style={{
                        animation: 'progressBar 5s linear forwards',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* 🔹 أرقام الشرائح + زر التشغيل/الإيقاف */}
            <div className='flex items-center gap-3'>
              {/* 🔹 عداد الشرائح */}
              <div className='hidden sm:flex items-center gap-2 text-white/70 text-sm font-medium'>
                <span className='text-white text-lg font-bold'>
                  {String(current + 1).padStart(2, '0')}
                </span>
                <span className='text-white/40'>/</span>
                <span>{String(count).padStart(2, '0')}</span>
              </div>

              {/* 🔹 الخط الفاصل */}
              <div className='hidden sm:block w-px h-6 bg-white/20' />

              {/* 🔹 زر التشغيل/الإيقاف */}
              <button
                onClick={toggleAutoplay}
                className={cn(
                  'w-10 h-10 rounded-full',
                  'bg-white/10 backdrop-blur-sm',
                  'border border-white/20 hover:border-white/40',
                  'flex items-center justify-center',
                  'text-white',
                  'hover:bg-white/20',
                  'transition-all duration-300',
                  'hover:scale-110'
                )}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className='w-4 h-4' />
                ) : (
                  <Play className='w-4 h-4 ml-0.5' />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          🔹 شريط التقدم العلوي
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div className='absolute top-0 left-0 right-0 h-1 bg-white/10 z-20'>
        <div 
          className='h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-300'
          style={{ width: `${((current + 1) / count) * 100}%` }}
        />
      </div>
    </div>
  )
}