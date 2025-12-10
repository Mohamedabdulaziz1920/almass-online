// components/shared/header/menu.tsx
import { 
  Menu as MenuIcon, 
  X,
  Globe,
  Moon,
  Sun,
  User,
  ShoppingCart,
  Heart,
  Settings
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import CartButton from './cart-button'
import UserButton from './user-button'
import ThemeSwitcher from './theme-switcher'
import LanguageSwitcher from './language-switcher'
import { useTranslations } from 'next-intl'
import { Separator } from '@/components/ui/separator'

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  const t = useTranslations()

  return (
    <div className="flex items-center justify-end gap-1">
      {/* ═══════════════════ Desktop Menu ═══════════════════ */}
      <nav className="hidden md:flex items-center gap-1">
        {/* Language Switcher */}
        <div className="header-button-enhanced">
          <LanguageSwitcher />
        </div>

        {/* Theme Switcher */}
        <div className="header-button-enhanced">
          <ThemeSwitcher />
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-600 to-transparent mx-1" />

        {/* User Button */}
        <div className="header-button-enhanced">
          <UserButton />
        </div>

        {/* Cart Button */}
        {!forAdmin && (
          <div className="header-button-enhanced">
            <CartButton />
          </div>
        )}
      </nav>

      {/* ═══════════════════ Mobile Menu ═══════════════════ */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="relative p-2 rounded-lg border border-gray-700 hover:border-primary/50 hover:bg-white/5 transition-all duration-300 group">
            <MenuIcon className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" />
            {/* Notification dot for cart */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary text-[8px] text-primary-foreground font-bold items-center justify-center">
                3
              </span>
            </span>
          </SheetTrigger>

          <SheetContent 
            side="left"
            className="w-[320px] p-0 bg-gradient-to-b from-gray-900 via-gray-900 to-black border-gray-800"
          >
            {/* Header */}
            <SheetHeader className="p-0">
              <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-amber-500 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {t('Header.Welcome')}
                      </span>
                      <span className="text-xs text-gray-400">
                        {t('Header.sign in')} {t('Header.for best experience')}
                      </span>
                    </div>
                  </SheetTitle>
                </div>
              </div>
            </SheetHeader>

            {/* Menu Content */}
            <div className="flex flex-col h-full">
              {/* Quick Actions */}
              <div className="p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {t('Header.Quick Actions')}
                </p>
                
                {/* User Button */}
                <div className="mobile-menu-item">
                  <UserButton />
                </div>

                {/* Cart Button */}
                {!forAdmin && (
                  <div className="mobile-menu-item">
                    <CartButton />
                  </div>
                )}
              </div>

              <Separator className="bg-gray-800" />

              {/* Settings */}
              <div className="p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {t('Header.Settings')}
                </p>

                {/* Language */}
                <div className="mobile-menu-item flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Globe className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-gray-300">{t('Header.Language')}</span>
                  </div>
                  <LanguageSwitcher />
                </div>

                {/* Theme */}
                <div className="mobile-menu-item flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Moon className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-gray-300">{t('Header.Theme')}</span>
                  </div>
                  <ThemeSwitcher />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto p-4 border-t border-gray-800">
                <p className="text-xs text-gray-500 text-center">
                  © 2024 {t('Header.All rights reserved')}
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu