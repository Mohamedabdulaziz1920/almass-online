// components/shared/header/index.tsx
import Image from 'next/image'
import Link from 'next/link'
import { getAllCategories } from '@/lib/actions/product.actions'
import Menu from './menu'
import Search from './search'
import data from '@/lib/data'
import Sidebar from './sidebar'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function Header() {
  const categories = await getAllCategories()
  const { site } = await getSetting()
  const t = await getTranslations()
  
  return (
    <header className='sticky top-0 z-50 w-full'>
      {/* 🔹 الشريط العلوي - Top Bar */}
      <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 text-xs py-2 hidden lg:block'>
        <div className='container mx-auto px-4 flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <span className='flex items-center gap-1'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
              </svg>
              +966 50 123 4567
            </span>
            <span className='flex items-center gap-1'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
              </svg>
              support@store.com
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <span className='animate-pulse text-yellow-400'>🔥 خصم 20% على جميع المنتجات</span>
          </div>
        </div>
      </div>

      {/* 🔹 الهيدر الرئيسي - Main Header */}
      <div className='bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-lg shadow-purple-500/10'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-16 md:h-20'>
            
            {/* 🔹 اللوجو */}
            <Link
              href='/'
              className='flex items-center gap-3 group'
            >
              <div className='relative'>
                <div className='absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300'></div>
                <div className='relative bg-white rounded-full p-1'>
                  <Image
                    src={site.logo}
                    width={44}
                    height={44}
                    alt={`${site.name} logo`}
                    className='rounded-full'
                  />
                </div>
              </div>
              <span className='font-bold text-xl md:text-2xl bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent'>
                {site.name}
              </span>
            </Link>

            {/* 🔹 البحث - Desktop */}
            <div className='hidden md:flex flex-1 max-w-2xl mx-8'>
              <Search />
            </div>

            {/* 🔹 القائمة */}
            <Menu />
          </div>

          {/* 🔹 البحث - Mobile */}
          <div className='md:hidden pb-4'>
            <Search />
          </div>
        </div>
      </div>

      {/* 🔹 شريط التنقل - Navigation Bar */}
      <nav className='bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-t border-gray-700/50'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center h-12'>
            {/* 🔹 Sidebar للتصنيفات */}
            <Sidebar categories={categories} />
            
            {/* 🔹 روابط التنقل */}
            <div className='flex items-center gap-1 overflow-x-auto scrollbar-hide'>
              {data.headerMenus.map((menu) => (
                <Link
                  href={menu.href}
                  key={menu.href}
                  className='relative px-4 py-2 text-sm font-medium text-gray-300 rounded-lg
                           transition-all duration-300 ease-out
                           hover:text-white hover:bg-white/10
                           before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
                           before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500
                           before:transition-all before:duration-300
                           hover:before:w-full
                           whitespace-nowrap'
                >
                  {t('Header.' + menu.name)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}