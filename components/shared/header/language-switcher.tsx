// components/shared/header/language-switcher.tsx
'use client'

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

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import useSettingStore from '@/hooks/use-setting-store'
import { i18n } from '@/i18n-config'
import { setCurrencyOnServer } from '@/lib/actions/setting.actions'
import { ChevronDownIcon, Globe, Coins, Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher() {
  const { locales } = i18n
  const locale = useLocale()
  const pathname = usePathname()
  const currentLocale = locales.find((l) => l.code === locale)

  const {
    setting: { availableCurrencies, currency },
    setCurrency,
  } = useSettingStore()
  
  const currentCurrency = availableCurrencies.find((c) => c.code === currency)

  const handleCurrencyChange = async (newCurrency: string) => {
    await setCurrencyOnServer(newCurrency)
    setCurrency(newCurrency)
  }

  return (
    <DropdownMenu>
      {/* 🔹 زر القائمة المنسدلة */}
      <DropdownMenuTrigger 
        className='group relative flex items-center gap-2 px-3 py-2
                   rounded-xl
                   bg-gradient-to-r from-emerald-500/10 to-teal-500/10
                   hover:from-emerald-500/20 hover:to-teal-500/20
                   border border-emerald-500/20 hover:border-emerald-500/40
                   transition-all duration-300
                   hover:scale-[1.02] active:scale-[0.98]
                   focus:outline-none focus:ring-2 focus:ring-emerald-500/50'
      >
        {/* 🔹 تأثير التوهج */}
        <div className='absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 
                        rounded-xl blur opacity-0 group-hover:opacity-20
                        transition-opacity duration-500'></div>

        {/* 🔹 أيقونة الكرة الأرضية */}
        <div className='relative'>
          <div className='absolute inset-0 rounded-lg bg-emerald-500/30 blur animate-pulse'></div>
          <div className='relative p-1.5 rounded-lg 
                          bg-gradient-to-br from-emerald-500 to-teal-600
                          shadow-lg shadow-emerald-500/30'>
            <Globe className='h-4 w-4 text-white animate-[spin_20s_linear_infinite]' />
          </div>
        </div>

        {/* 🔹 العلم واللغة */}
        <div className='relative flex items-center gap-2'>
          {/* 🔹 علم اللغة */}
          <span className='text-xl leading-none drop-shadow-md'>
            {currentLocale?.icon}
          </span>
          
          {/* 🔹 معلومات اللغة والعملة */}
          <div className='hidden sm:flex flex-col items-start'>
            <span className='text-[10px] text-gray-400 leading-tight'>
              {currentLocale?.name || 'Language'}
            </span>
            <span className='text-xs font-bold text-white leading-tight flex items-center gap-1'>
              {currentCurrency?.symbol} {currency}
            </span>
          </div>
        </div>

        {/* 🔹 السهم */}
        <ChevronDownIcon className='h-4 w-4 text-gray-400 
                                     group-hover:text-white
                                     group-data-[state=open]:rotate-180
                                     transition-all duration-300' />
      </DropdownMenuTrigger>

      {/* 🔹 محتوى القائمة المنسدلة */}
      <DropdownMenuContent 
        className='w-72 p-2
                   bg-gray-900/95 backdrop-blur-xl
                   border border-white/10
                   rounded-2xl shadow-2xl shadow-black/50
                   animate-in fade-in-0 zoom-in-95 duration-200'
        align='end'
        sideOffset={8}
      >
        {/* ═══════════════════════════════════════════════════════ */}
        {/* 🔹 قسم اللغات */}
        {/* ═══════════════════════════════════════════════════════ */}
        <DropdownMenuLabel className='flex items-center gap-2 px-2 py-1.5 text-gray-400'>
          <div className='p-1.5 rounded-lg bg-emerald-500/10'>
            <Globe className='w-4 h-4 text-emerald-400' />
          </div>
          <span className='text-xs font-semibold uppercase tracking-wider'>
            Language
          </span>
        </DropdownMenuLabel>

        <DropdownMenuRadioGroup value={locale} className='space-y-1 p-1'>
          {locales.map((l) => (
            <DropdownMenuRadioItem 
              key={l.code} 
              value={l.code}
              className='p-0 focus:bg-transparent'
            >
              <Link
                href={pathname}
                locale={l.code}
                className={cn(
                  `flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
                   transition-all duration-300 cursor-pointer`,
                  locale === l.code
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30'
                    : 'hover:bg-white/5 border border-transparent'
                )}
              >
                {/* 🔹 العلم */}
                <div className='relative'>
                  <span className={cn(
                    'text-2xl leading-none transition-transform duration-300',
                    locale === l.code && 'scale-110'
                  )}>
                    {l.icon}
                  </span>
                  {/* 🔹 حلقة التحديد */}
                  {locale === l.code && (
                    <span className='absolute -inset-1 rounded-full 
                                     border-2 border-emerald-500/50 
                                     animate-ping opacity-50'></span>
                  )}
                </div>

                {/* 🔹 معلومات اللغة */}
                <div className='flex-1'>
                  <p className={cn(
                    'text-sm font-medium transition-colors duration-200',
                    locale === l.code ? 'text-white' : 'text-gray-300'
                  )}>
                    {l.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {l.code.toUpperCase()}
                  </p>
                </div>

                {/* 🔹 علامة الاختيار */}
                {locale === l.code && (
                  <div className='p-1.5 rounded-full bg-emerald-500/20'>
                    <Check className='w-4 h-4 text-emerald-400' />
                  </div>
                )}
              </Link>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator className='my-3 bg-white/10' />

        {/* ═══════════════════════════════════════════════════════ */}
        {/* 🔹 قسم العملات */}
        {/* ═══════════════════════════════════════════════════════ */}
        <DropdownMenuLabel className='flex items-center gap-2 px-2 py-1.5 text-gray-400'>
          <div className='p-1.5 rounded-lg bg-amber-500/10'>
            <Coins className='w-4 h-4 text-amber-400' />
          </div>
          <span className='text-xs font-semibold uppercase tracking-wider'>
            Currency
          </span>
        </DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={handleCurrencyChange}
          className='grid grid-cols-2 gap-2 p-1'
        >
          {availableCurrencies.map((c) => (
            <DropdownMenuRadioItem
              key={c.code}
              value={c.code}
              className={cn(
                `flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer
                 border-2 transition-all duration-300
                 hover:scale-[1.02]`,
                currency === c.code
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50'
                  : 'bg-white/5 border-transparent hover:border-white/20'
              )}
            >
              {/* 🔹 رمز العملة */}
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300',
                currency === c.code
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/10 text-gray-400'
              )}>
                {c.symbol}
              </div>

              {/* 🔹 معلومات العملة */}
              <div className='flex-1 min-w-0'>
                <p className={cn(
                  'text-sm font-bold transition-colors duration-200',
                  currency === c.code ? 'text-white' : 'text-gray-400'
                )}>
                  {c.code}
                </p>
                <p className='text-[10px] text-gray-500 truncate'>
                  {c.name}
                </p>
              </div>

              {/* 🔹 علامة الاختيار */}
              {currency === c.code && (
                <Check className='w-4 h-4 text-amber-400 flex-shrink-0' />
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        {/* 🔹 معلومات إضافية */}
        <div className='mt-3 p-3 rounded-xl bg-gradient-to-r from-white/5 to-transparent 
                        border border-white/5'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20'>
              <Sparkles className='w-4 h-4 text-purple-400' />
            </div>
            <div className='flex-1'>
              <p className='text-xs text-gray-400'>
                الإعدادات الحالية
              </p>
              <p className='text-sm font-medium text-white flex items-center gap-2'>
                <span>{currentLocale?.icon}</span>
                <span>{currentLocale?.name}</span>
                <span className='text-gray-500'>•</span>
                <span className='text-amber-400'>{currentCurrency?.symbol} {currency}</span>
              </p>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}