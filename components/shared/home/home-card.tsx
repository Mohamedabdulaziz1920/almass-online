// components/shared/home/home-card.tsx
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    items?: string[]
    image: string
    href: string
  }[]
}

// 🔹 ألوان متنوعة للبطاقات
const cardColors = [
  {
    gradient: 'from-purple-500/10 to-pink-500/10',
    border: 'hover:border-purple-500/30',
    accent: 'bg-purple-500',
    text: 'text-purple-600 dark:text-purple-400',
    button: 'from-purple-500 to-pink-500',
    glow: 'group-hover:shadow-purple-500/20',
  },
  {
    gradient: 'from-blue-500/10 to-cyan-500/10',
    border: 'hover:border-blue-500/30',
    accent: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    button: 'from-blue-500 to-cyan-500',
    glow: 'group-hover:shadow-blue-500/20',
  },
  {
    gradient: 'from-amber-500/10 to-orange-500/10',
    border: 'hover:border-amber-500/30',
    accent: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    button: 'from-amber-500 to-orange-500',
    glow: 'group-hover:shadow-amber-500/20',
  },
  {
    gradient: 'from-emerald-500/10 to-teal-500/10',
    border: 'hover:border-emerald-500/30',
    accent: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    button: 'from-emerald-500 to-teal-500',
    glow: 'group-hover:shadow-emerald-500/20',
  },
]

export function HomeCard({ cards }: { cards: CardItem[] }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
      {cards.map((card, cardIndex) => {
        const colors = cardColors[cardIndex % cardColors.length]
        
        return (
          <Card 
            key={card.title} 
            className={cn(
              'group relative flex flex-col overflow-hidden',
              'rounded-2xl border border-border/50',
              'bg-gradient-to-br from-card to-card/80',
              'shadow-lg hover:shadow-2xl',
              'transition-all duration-500 ease-out',
              'hover:-translate-y-1',
              colors.border,
              colors.glow
            )}
          >
            {/* 🔹 خلفية متدرجة */}
            <div className={cn(
              'absolute inset-0 opacity-0 group-hover:opacity-100',
              'bg-gradient-to-br transition-opacity duration-500',
              colors.gradient
            )} />

            {/* 🔹 زخرفة الزاوية */}
            <div className='absolute top-0 right-0 w-24 h-24 opacity-10'>
              <div className={cn(
                'absolute top-0 right-0 w-full h-full',
                'bg-gradient-to-br rounded-full blur-2xl',
                colors.button
              )} />
            </div>

            <CardContent className='relative p-5 md:p-6 flex-1'>
              {/* 🔹 عنوان البطاقة */}
              <div className='flex items-center gap-3 mb-5'>
                <div className={cn(
                  'w-1 h-8 rounded-full',
                  colors.accent
                )} />
                <h3 className='text-lg md:text-xl font-bold text-foreground'>
                  {card.title}
                </h3>
              </div>

              {/* 🔹 شبكة المنتجات */}
              <div className='grid grid-cols-2 gap-3 md:gap-4'>
                {card.items.map((item, itemIndex) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group/item relative flex flex-col items-center p-3',
                      'rounded-xl',
                      'bg-background/50 hover:bg-background',
                      'border border-transparent hover:border-border/50',
                      'transition-all duration-300',
                      'hover:shadow-lg hover:-translate-y-0.5'
                    )}
                    style={{ animationDelay: `${itemIndex * 100}ms` }}
                  >
                    {/* 🔹 حاوية الصورة */}
                    <div className='relative w-full aspect-square mb-2 overflow-hidden rounded-lg bg-muted/30'>
                      {/* 🔹 تأثير التوهج */}
                      <div className={cn(
                        'absolute inset-0 opacity-0 group-hover/item:opacity-100',
                        'bg-gradient-to-t from-black/5 to-transparent',
                        'transition-opacity duration-300'
                      )} />
                      
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className={cn(
                          'object-contain p-2',
                          'transition-transform duration-500 ease-out',
                          'group-hover/item:scale-110'
                        )}
                        sizes='(max-width: 768px) 40vw, 15vw'
                      />

                      {/* 🔹 Badge للمنتج الأول */}
                      {itemIndex === 0 && (
                        <div className={cn(
                          'absolute top-1 right-1 px-1.5 py-0.5',
                          'text-[10px] font-semibold text-white',
                          'rounded-md',
                          `bg-gradient-to-r ${colors.button}`
                        )}>
                          <Sparkles className='w-3 h-3 inline mr-0.5' />
                          HOT
                        </div>
                      )}
                    </div>

                    {/* 🔹 اسم المنتج */}
                    <p className={cn(
                      'text-center text-xs md:text-sm font-medium',
                      'text-muted-foreground group-hover/item:text-foreground',
                      'line-clamp-2 leading-tight',
                      'transition-colors duration-200'
                    )}>
                      {item.name}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>

            {/* 🔹 الفوتر */}
            {card.link && (
              <CardFooter className='relative p-4 pt-0'>
                <Link 
                  href={card.link.href} 
                  className={cn(
                    'group/link flex items-center justify-between w-full',
                    'px-4 py-2.5 rounded-xl',
                    'bg-gradient-to-r opacity-90 hover:opacity-100',
                    colors.button,
                    'text-white font-medium text-sm',
                    'shadow-lg hover:shadow-xl',
                    'transition-all duration-300',
                    'hover:scale-[1.02] active:scale-[0.98]'
                  )}
                >
                  <span>{card.link.text}</span>
                  <ArrowRight className='w-4 h-4 group-hover/link:translate-x-1 
                                         rtl:rotate-180 rtl:group-hover/link:-translate-x-1
                                         transition-transform duration-300' />
                </Link>
              </CardFooter>
            )}
          </Card>
        )
      })}
    </div>
  )
}