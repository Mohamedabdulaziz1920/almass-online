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
import { MapPin, Headphones, TruckIcon } from 'lucide-react'

export default async function Header() {
  const categories = await getAllCategories()
  const { site } = await getSetting()
  const t = await getTranslations()

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ═══════════════════ Top Bar ═══════════════════ */}
      <div className="hidden lg:block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-9 text-xs">
            {/* Left Side */}
            <div className="flex items-center gap-6 text-gray-300">
              <button className="flex items-center gap-1.5 hover:text-white transition-colors group">
                <MapPin className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span>{t('Header.Deliver to')}</span>
                <span className="font-semibold text-white">
                  {t('Header.Location')}
                </span>
              </button>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <TruckIcon className="h-3.5 w-3.5" />
                <span>{t('Header.Free shipping over')} $35</span>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4 text-gray-300">
              <Link
                href="/page/help"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Headphones className="h-3.5 w-3.5" />
                {t('Header.Help')}
              </Link>
              <span className="w-px h-4 bg-gray-600" />
              <Link
                href="/page/sell"
                className="hover:text-white transition-colors"
              >
                {t('Header.Sell on')} {site.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ Main Header ═══════════════════ */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative w-10 h-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Image
                  src={site.logo}
                  fill
                  alt={`${site.name} logo`}
                  className="object-contain drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl md:text-2xl bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
                  {site.name}
                </span>
                <span className="text-[10px] text-gray-400 -mt-1 hidden sm:block">
                  {site.slogan}
                </span>
              </div>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <Search />
            </div>

            {/* Menu */}
            <Menu />
          </div>

          {/* Search - Mobile */}
          <div className="md:hidden pb-3">
            <Search />
          </div>
        </div>
      </div>

      {/* ═══════════════════ Navigation Bar ═══════════════════ */}
      <nav className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-t border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-11">
            {/* Sidebar Toggle */}
            <Sidebar categories={categories} />

            {/* Divider */}
            <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-500 to-transparent mx-3 hidden sm:block" />

            {/* Menu Links - Scrollable */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-1">
                {data.headerMenus.map((menu, index) => (
                  <Link
                    href={menu.href}
                    key={menu.href}
                    className={`
                      relative px-3 py-2 text-sm font-medium whitespace-nowrap
                      transition-all duration-300 rounded-md group
                      ${
                        menu.name === "Today's Deal"
                          ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {/* Special Badge for Today's Deal */}
                    {menu.name === "Today's Deal" && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                    )}

                    {t('Header.' + menu.name)}

                    {/* Underline Effect */}
                    <span
                      className={`
                      absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full
                      transition-all duration-300 w-0 group-hover:w-4/5
                      ${
                        menu.name === "Today's Deal"
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                          : 'bg-gradient-to-r from-primary to-yellow-400'
                      }
                    `}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}