// components/shared/header/theme-switcher.tsx
'use client'

import { ChevronDownIcon, Moon, Sun, Palette, Sparkles, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import useColorStore from '@/hooks/use-color-store'
import useIsMounted from '@/hooks/use-is-mounted'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const { availableColors, color, setColor } = useColorStore(theme)
  const t = useTranslations('Header')
  const isMounted = useIsMounted()

  const changeTheme = (value: string) => {
    setTheme(value)
  }

  // 🔹 تحديد لون الخلفية للـ Trigger
  const getThemeStyles = () => {
    if (!isMounted) return 'bg-white/10'
    if (theme === 'dark') {
      return 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30'
    }
    return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30'
  }

  return (
    <DropdownMenu>
      {/* 🔹 زر القائمة المنسدلة */}
      <DropdownMenuTrigger 
        className={cn(
          `group relative flex items-center gap-2 px-3 py-2
           rounded-xl border
           transition-all duration-300
           hover:scale-[1.02] active:scale-[0.98]
           focus:outline-none focus:ring-2 focus:ring-purple-500/50`,
          getThemeStyles()
        )}
      >
        {/* 🔹 أيقونة الثيم مع تأثيرات */}
        <div className='relative'>
          {isMounted && theme === 'dark' ? (
            <>
              {/* 🌙 أيقونة القمر */}
              <div className='absolute inset-0 rounded-lg bg-indigo-500/30 blur animate-pulse'></div>
              <div className='relative p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600
                              shadow-lg shadow-indigo-500/30'>
                <Moon className='h-4 w-4 text-white animate-[spin_3s_ease-in-out_infinite]' 
                      style={{ animationDirection: 'reverse' }} />
              </div>
              {/* ✨ النجوم */}
              <span className='absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full 
                               animate-ping opacity-75'></span>
              <span className='absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-purple-300 rounded-full 
                               animate-pulse'></span>
            </>
          ) : (
            <>
              {/* ☀️ أيقونة الشمس */}
              <div className='absolute inset-0 rounded-lg bg-amber-500/30 blur animate-pulse'></div>
              <div className='relative p-1.5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500
                              shadow-lg shadow-amber-500/30'>
                <Sun className='h-4 w-4 text-white animate-[spin_10s_linear_infinite]' />
              </div>
              {/* 🌟 أشعة الشمس */}
              <span className='absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full 
                               animate-ping opacity-60'></span>
            </>
          )}
        </div>

        {/* 🔹 النص */}
        <div className='hidden sm:flex flex-col items-start'>
          <span className='text-[10px] text-gray-400 leading-tight'>
            {t('Theme') || 'Theme'}
          </span>
          <span className='text-xs font-bold text-white leading-tight'>
            {isMounted ? (theme === 'dark' ? t('Dark') : t('Light')) : '...'}
          </span>
        </div>

        {/* 🔹 السهم */}
        <ChevronDownIcon className='h-4 w-4 text-gray-400 
                                     group-hover:text-white
                                     group-data-[state=open]:rotate-180
                                     transition-all duration-300' />

        {/* 🔹 مؤشر اللون الحالي */}
        <div 
          className='absolute -bottom-1 left-1/2 -translate-x-1/2
                     w-6 h-1 rounded-full shadow-lg'
          style={{ 
            backgroundColor: color?.name || '#8b5cf6',
            boxShadow: `0 0 10px ${color?.name || '#8b5cf6'}`
          }}
        ></div>
      </DropdownMenuTrigger>

      {/* 🔹 محتوى القائمة المنسدلة */}
      <DropdownMenuContent 
        className='w-64 p-2
                   bg-gray-900/95 backdrop-blur-xl
                   border border-white/10
                   rounded-2xl shadow-2xl shadow-black/50
                   animate-in fade-in-0 zoom-in-95 duration-200'
        align='end'
        sideOffset={8}
      >
        {/* ═══════════════════════════════════════════════════════ */}
        {/* 🔹 قسم الثيم */}
        {/* ═══════════════════════════════════════════════════════ */}
        <DropdownMenuLabel className='flex items-center gap-2 px-2 py-1.5 text-gray-400'>
          <Monitor className='w-4 h-4' />
          <span className='text-xs font-semibold uppercase tracking-wider'>
            {t('Theme') || 'Theme'}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuRadioGroup 
          value={theme} 
          onValueChange={changeTheme}
          className='grid grid-cols-2 gap-2 p-1'
        >
          {/* 🔹 الوضع الداكن */}
          <DropdownMenuRadioItem 
            value='dark'
            className={cn(
              `flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer
               border-2 transition-all duration-300
               hover:scale-[1.02]`,
              theme === 'dark' 
                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50' 
                : 'bg-white/5 border-transparent hover:border-white/20'
            )}
          >
            <div className={cn(
              'p-3 rounded-xl transition-all duration-300',
              theme === 'dark'
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30'
                : 'bg-white/10'
            )}>
              <Moon className={cn(
                'h-6 w-6 transition-colors duration-200',
                theme === 'dark' ? 'text-white' : 'text-gray-400'
              )} />
            </div>
            <span className={cn(
              'text-sm font-medium transition-colors duration-200',
              theme === 'dark' ? 'text-white' : 'text-gray-400'
            )}>
              {t('Dark')}
            </span>
            {theme === 'dark' && (
              <span className='absolute top-1 right-1 w-2 h-2 rounded-full 
                               bg-indigo-500 animate-pulse'></span>
            )}
          </DropdownMenuRadioItem>

          {/* 🔹 الوضع الفاتح */}
          <DropdownMenuRadioItem 
            value='light'
            className={cn(
              `flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer
               border-2 transition-all duration-300
               hover:scale-[1.02]`,
              theme === 'light' 
                ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50' 
                : 'bg-white/5 border-transparent hover:border-white/20'
            )}
          >
            <div className={cn(
              'p-3 rounded-xl transition-all duration-300',
              theme === 'light'
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30'
                : 'bg-white/10'
            )}>
              <Sun className={cn(
                'h-6 w-6 transition-colors duration-200',
                theme === 'light' ? 'text-white' : 'text-gray-400'
              )} />
            </div>
            <span className={cn(
              'text-sm font-medium transition-colors duration-200',
              theme === 'light' ? 'text-white' : 'text-gray-400'
            )}>
              {t('Light')}
            </span>
            {theme === 'light' && (
              <span className='absolute top-1 right-1 w-2 h-2 rounded-full 
                               bg-amber-500 animate-pulse'></span>
            )}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator className='my-3 bg-white/10' />

        {/* ═══════════════════════════════════════════════════════ */}
        {/* 🔹 قسم الألوان */}
        {/* ═══════════════════════════════════════════════════════ */}
        <DropdownMenuLabel className='flex items-center gap-2 px-2 py-1.5 text-gray-400'>
          <Palette className='w-4 h-4' />
          <span className='text-xs font-semibold uppercase tracking-wider'>
            {t('Color')}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={color.name}
          onValueChange={(value) => setColor(value, true)}
          className='grid grid-cols-4 gap-2 p-2'
        >
          {availableColors.map((c) => (
            <DropdownMenuRadioItem
              key={c.name}
              value={c.name}
              className={cn(
                `group/color flex flex-col items-center gap-1.5 p-2 rounded-xl cursor-pointer
                 border-2 transition-all duration-300
                 hover:scale-105`,
                color.name === c.name 
                  ? 'border-white/50 bg-white/10' 
                  : 'border-transparent hover:border-white/20'
              )}
            >
              {/* 🔹 دائرة اللون */}
              <div className='relative'>
                {/* 🔹 تأثير التوهج */}
                {color.name === c.name && (
                  <div 
                    className='absolute inset-0 rounded-full blur-md animate-pulse'
                    style={{ backgroundColor: c.name, opacity: 0.5 }}
                  ></div>
                )}
                <div
                  className={cn(
                    `relative w-8 h-8 rounded-full
                     border-2 transition-all duration-300
                     group-hover/color:scale-110
                     shadow-lg`,
                    color.name === c.name ? 'border-white' : 'border-white/30'
                  )}
                  style={{ 
                    backgroundColor: c.name,
                    boxShadow: color.name === c.name 
                      ? `0 0 20px ${c.name}` 
                      : `0 4px 15px ${c.name}40`
                  }}
                >
                  {/* 🔹 علامة الاختيار */}
                  {color.name === c.name && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <svg 
                        className='w-4 h-4 text-white drop-shadow-lg' 
                        fill='none' 
                        viewBox='0 0 24 24' 
                        stroke='currentColor'
                      >
                        <path 
                          strokeLinecap='round' 
                          strokeLinejoin='round' 
                          strokeWidth={3} 
                          d='M5 13l4 4L19 7' 
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 🔹 اسم اللون */}
              <span className={cn(
                'text-[10px] font-medium transition-colors duration-200 text-center leading-tight',
                color.name === c.name ? 'text-white' : 'text-gray-500'
              )}>
                {t(c.name)}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        {/* 🔹 معاينة اللون الحالي */}
        <div className='mt-3 p-3 rounded-xl bg-white/5 border border-white/10'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Sparkles className='w-4 h-4 text-gray-400' />
              <span className='text-xs text-gray-400'>اللون الحالي</span>
            </div>
            <div className='flex items-center gap-2'>
              <div 
                className='w-5 h-5 rounded-full shadow-lg'
                style={{ 
                  backgroundColor: color.name,
                  boxShadow: `0 0 10px ${color.name}`
                }}
              ></div>
              <span className='text-xs font-medium text-white'>
                {t(color.name)}
              </span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}