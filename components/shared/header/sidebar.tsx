// components/shared/header/sidebar.tsx
import * as React from 'react'
import Link from 'next/link'
import {
  X,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Menu as MenuIcon,
  ShoppingBag,
  Settings,
  HelpCircle,
  LogOut,
  LogIn,
  Heart,
  Package,
  Grid3X3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { auth } from '@/auth'
import { getLocale, getTranslations } from 'next-intl/server'
import { getDirection } from '@/i18n-config'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

export default async function Sidebar({
  categories,
}: {
  categories: string[]
}) {
  const session = await auth()
  const locale = await getLocale()
  const t = await getTranslations()
  const isRTL = getDirection(locale) === 'rtl'

  // أيقونات للتصنيفات (يمكنك تخصيصها)
  const categoryIcons: Record<string, string> = {
    'T-Shirts': '👕',
    'Jeans': '👖',
    'Shoes': '👟',
    'Wrist Watches': '⌚',
    'Electronics': '📱',
    'Home': '🏠',
    'Books': '📚',
  }

  return (
    <Drawer direction={isRTL ? 'right' : 'left'}>
      <DrawerTrigger
        className="
          flex items-center gap-2 px-3 py-2
          text-gray-300 hover:text-white
          bg-transparent hover:bg-white/10
          border border-transparent hover:border-gray-600
          rounded-lg transition-all duration-300
          group
        "
      >
        <MenuIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
        <span className="font-medium text-sm">{t('Header.All')}</span>
      </DrawerTrigger>

      <DrawerContent
        className="
          w-[320px] sm:w-[360px] h-full
          bg-gradient-to-b from-gray-900 via-gray-900 to-black
          border-gray-800
        "
      >
        <div className="flex flex-col h-full">
          {/* ═══════════════════ Header ═══════════════════ */}
          <DrawerHeader className="p-0">
            <div
              className="
                bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800
                p-4 flex items-center justify-between
              "
            >
              <DrawerTitle className="flex items-center gap-3 text-white">
                <div
                  className="
                    w-10 h-10 rounded-full 
                    bg-gradient-to-r from-primary to-amber-500
                    flex items-center justify-center
                    shadow-lg shadow-primary/30
                  "
                >
                  <UserCircle className="h-5 w-5 text-primary-foreground" />
                </div>

                {session ? (
                  <DrawerClose asChild>
                    <Link href="/account" className="group">
                      <span className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {t('Header.Hello')}, {session.user.name}
                      </span>
                      <p className="text-xs text-gray-400">
                        {t('Header.View your account')}
                      </p>
                    </Link>
                  </DrawerClose>
                ) : (
                  <DrawerClose asChild>
                    <Link href="/sign-in" className="group">
                      <span className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {t('Header.Hello')}, {t('Header.sign in')}
                      </span>
                      <p className="text-xs text-gray-400">
                        {t('Header.Sign in for best experience')}
                      </p>
                    </Link>
                  </DrawerClose>
                )}
              </DrawerTitle>

              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {/* ═══════════════════ Content ═══════════════════ */}
          <ScrollArea className="flex-1">
            {/* Quick Links */}
            {session && (
              <>
                <div className="p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {t('Header.Quick Links')}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <DrawerClose asChild>
                      <Link
                        href="/account/orders"
                        className="sidebar-quick-link"
                      >
                        <Package className="h-4 w-4" />
                        <span>{t('Header.Orders')}</span>
                      </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                      <Link href="/wishlist" className="sidebar-quick-link">
                        <Heart className="h-4 w-4" />
                        <span>{t('Header.Wishlist')}</span>
                      </Link>
                    </DrawerClose>
                  </div>
                </div>
                <Separator className="bg-gray-800" />
              </>
            )}

            {/* Categories */}
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Grid3X3 className="h-3.5 w-3.5" />
                {t('Header.Shop By Department')}
              </p>

              <nav className="space-y-1">
                {categories.map((category, index) => (
                  <DrawerClose asChild key={category}>
                    <Link
                      href={`/search?category=${category}`}
                      className="
                        flex items-center justify-between
                        px-3 py-3 rounded-lg
                        text-gray-300 hover:text-white
                        bg-transparent hover:bg-white/5
                        border border-transparent hover:border-gray-700
                        transition-all duration-200
                        group
                      "
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {categoryIcons[category] || '📦'}
                        </span>
                        <span className="font-medium">{category}</span>
                      </div>
                      {isRTL ? (
                        <ChevronLeft className="h-4 w-4 text-gray-500 group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      )}
                    </Link>
                  </DrawerClose>
                ))}
              </nav>
            </div>

            <Separator className="bg-gray-800" />

            {/* Help & Settings */}
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Settings className="h-3.5 w-3.5" />
                {t('Header.Help & Settings')}
              </p>

              <nav className="space-y-1">
                <DrawerClose asChild>
                  <Link
                    href="/account"
                    className="sidebar-item group"
                  >
                    <div className="sidebar-item-icon bg-blue-500/20">
                      <UserCircle className="h-4 w-4 text-blue-400" />
                    </div>
                    <span>{t('Header.Your account')}</span>
                    {isRTL ? (
                      <ChevronLeft className="h-4 w-4 mr-auto text-gray-500 group-hover:text-blue-400 transition-colors" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-auto text-gray-500 group-hover:text-blue-400 transition-colors" />
                    )}
                  </Link>
                </DrawerClose>

                <DrawerClose asChild>
                  <Link
                    href="/page/customer-service"
                    className="sidebar-item group"
                  >
                    <div className="sidebar-item-icon bg-green-500/20">
                      <HelpCircle className="h-4 w-4 text-green-400" />
                    </div>
                    <span>{t('Header.Customer Service')}</span>
                    {isRTL ? (
                      <ChevronLeft className="h-4 w-4 mr-auto text-gray-500 group-hover:text-green-400 transition-colors" />
                    ) : (
                      <ChevronRight className="h-4 w-4 ml-auto text-gray-500 group-hover:text-green-400 transition-colors" />
                    )}
                  </Link>
                </DrawerClose>
              </nav>
            </div>
          </ScrollArea>

          {/* ═══════════════════ Footer ═══════════════════ */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            {session ? (
              <form action={SignOut} className="w-full">
                <Button
                  variant="ghost"
                  className="
                    w-full justify-start gap-3
                    text-red-400 hover:text-red-300
                    hover:bg-red-500/10
                    rounded-lg h-12
                  "
                >
                  <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <LogOut className="h-4 w-4" />
                  </div>
                  {t('Header.Sign out')}
                </Button>
              </form>
            ) : (
              <DrawerClose asChild>
                <Link href="/sign-in">
                  <Button
                    variant="default"
                    className="
                      w-full justify-center gap-2
                      bg-gradient-to-r from-primary to-amber-500
                      hover:from-primary/90 hover:to-amber-500/90
                      text-primary-foreground
                      rounded-lg h-12 font-semibold
                      shadow-lg shadow-primary/30
                    "
                  >
                    <LogIn className="h-4 w-4" />
                    {t('Header.Sign in')}
                  </Button>
                </Link>
              </DrawerClose>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}