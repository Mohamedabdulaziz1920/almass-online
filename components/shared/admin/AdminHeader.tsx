// components/shared/admin/AdminHeader.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSidebar } from '@/context/sidebar-context'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import ThemeSwitcher from '@/components/shared/header/theme-switcher'
import LanguageSwitcher from '@/components/shared/header/language-switcher'
import { SignOut } from '@/lib/actions/user.actions'
import {
  Bell,
  User,
  Menu,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  X,
  ShoppingCart,
  AlertTriangle,
  Clock,
  MessageSquare,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// 📋 بيانات الإشعارات
// ═══════════════════════════════════════════════════════════════
const notifications = [
  {
    id: 1,
    title: 'طلب جديد #1234',
    message: 'تم استلام طلب جديد بقيمة 500 ريال',
    time: 'منذ 5 دقائق',
    type: 'order',
    unread: true,
    icon: ShoppingCart,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 2,
    title: 'تنبيه المخزون',
    message: 'المنتج "سماعات بلوتوث" وصل للحد الأدنى',
    time: 'منذ ساعة',
    type: 'warning',
    unread: true,
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    id: 3,
    title: 'تقييم جديد ⭐',
    message: 'قام العميل أحمد بإضافة تقييم 5 نجوم',
    time: 'منذ 3 ساعات',
    type: 'review',
    unread: false,
    icon: MessageSquare,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
]

// ═══════════════════════════════════════════════════════════════
// 🧩 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════
export default function AdminHeader() {
  const t = useTranslations('AdminHeader')
  const user = useCurrentUser()
  const pathname = usePathname()
  const { toggle } = useSidebar()
  const locale = useLocale()

  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // لا تظهر الهيدر إلا في صفحات الأدمن
  if (!pathname.includes('/admin')) return null

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <>
      {/* ═══════════════ الهيدر الرئيسي ═══════════════ */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full',
          'bg-gray-900/95 backdrop-blur-xl',
          'border-b border-gray-800/50',
          'shadow-lg shadow-black/10'
        )}
      >
        {/* الشريط الملون العلوي */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />

        {/* محتوى الهيدر */}
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6">
          
          {/* ═══ القسم الأيمن ═══ */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* زر القائمة - يظهر دائماً على الموبايل والتابلت */}
            <button
              onClick={toggle}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 active:scale-95 transition-all"
              aria-label="فتح القائمة"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* اللوجو والعنوان - للموبايل */}
            <Link 
              href="/admin/overview" 
              className="flex lg:hidden items-center gap-2"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 opacity-50 blur-sm" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
                  <Image
                    src="/icons/logo.svg"
                    alt="Logo"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-yellow-400 hidden xs:inline">
                لوحة التحكم
              </span>
            </Link>

            {/* الترحيب - للديسكتوب فقط */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">
                  مرحباً بك!
                </h1>
                <span className="text-xl">👋</span>
              </div>
              <p className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* ═══ شريط البحث (Desktop) ═══ */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl mx-4">
            <div className="relative w-full group">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-yellow-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن المنتجات، الطلبات..."
                className="w-full rounded-xl border border-gray-700/50 bg-gray-800/50 py-2 sm:py-2.5 pr-10 pl-4 text-sm text-white placeholder-gray-500 transition-all focus:border-yellow-500/50 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                dir="rtl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* ═══ القسم الأيسر ═══ */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* زر البحث - للموبايل */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 active:scale-95 transition-all"
              aria-label="البحث"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* تبديل السمة */}
            <div className="hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700">
              <ThemeSwitcher />
            </div>

            {/* تبديل اللغة */}
            <div className="hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700">
              <LanguageSwitcher />
            </div>

            {/* ═══ الإشعارات ═══ */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 active:scale-95 transition-all">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-[9px] sm:text-[10px] font-bold text-white shadow-lg animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-[calc(100vw-2rem)] sm:w-80 md:w-96 p-0 bg-gray-900 border-gray-700/50 rounded-2xl shadow-2xl"
              >
                {/* هيدر الإشعارات */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    <h3 className="font-bold text-white text-sm sm:text-base">الإشعارات</h3>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-semibold">
                      {unreadCount} جديدة
                    </span>
                  )}
                </div>

                {/* قائمة الإشعارات */}
                <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                  {notifications.map((notif) => {
                    const Icon = notif.icon
                    return (
                      <div
                        key={notif.id}
                        className={cn(
                          'flex gap-3 p-3 sm:p-4 cursor-pointer transition-colors border-b border-gray-800/30 last:border-0',
                          notif.unread
                            ? 'bg-yellow-400/5 hover:bg-yellow-400/10'
                            : 'hover:bg-gray-800/30'
                        )}
                      >
                        <div className={cn('flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl', notif.bg)}>
                          <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', notif.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs sm:text-sm text-white truncate">
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* فوتر */}
                <div className="p-2 sm:p-3 border-t border-gray-800/50">
                  <button className="w-full py-2 rounded-xl bg-gray-800 text-gray-300 text-xs sm:text-sm font-medium hover:bg-gray-700 transition-colors">
                    عرض الكل
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* الفاصل */}
            <div className="hidden sm:block h-6 sm:h-8 w-px bg-gray-700/50 mx-1" />

            {/* ═══ قائمة المستخدم ═══ */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-xl hover:bg-gray-800/50 active:scale-95 transition-all">
                  <div className="relative">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5">
                      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gray-900 overflow-hidden">
                        {user?.image ? (
                          <Image
                            src={user.image}
                            width={36}
                            height={36}
                            alt={user.name || 'User'}
                            className="rounded-[10px] object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                        )}
                      </div>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 border-gray-900 bg-emerald-500" />
                  </div>

                  {/* معلومات المستخدم - للشاشات الكبيرة */}
                  <div className="hidden lg:block text-right">
                    <p className="text-sm font-semibold text-white truncate max-w-[100px]">
                      {user?.name || 'المستخدم'}
                    </p>
                    <p className="text-xs text-gray-400">مدير</p>
                  </div>
                  <ChevronDown className="hidden lg:block h-4 w-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 sm:w-64 p-2 bg-gray-900 border-gray-700/50 rounded-2xl shadow-2xl"
              >
                {/* معلومات المستخدم */}
                <div className="p-3 mb-2 rounded-xl bg-gray-800/50 border border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5">
                      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-gray-900">
                        {user?.image ? (
                          <Image
                            src={user.image}
                            width={44}
                            height={44}
                            alt={user.name || 'User'}
                            className="rounded-[10px] object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800/50 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>{t('Your account')}</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800/50 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>الإعدادات</span>
                  </Link>
                </DropdownMenuItem>

                {/* للموبايل فقط */}
                <div className="sm:hidden">
                  <DropdownMenuSeparator className="my-2 bg-gray-700/50" />
                  <DropdownMenuItem className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-300">
                    <ThemeSwitcher />
                    <span>تبديل السمة</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-300">
                    <LanguageSwitcher />
                    <span>تبديل اللغة</span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="my-2 bg-gray-700/50" />

                <DropdownMenuItem className="p-0">
                  <form action={SignOut} className="w-full">
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ═══ شريط البحث للموبايل ═══ */}
        {showSearch && (
          <div className="border-t border-gray-800/50 bg-gray-900 p-3 md:hidden animate-in slide-in-from-top duration-200">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="ابحث..."
                className="w-full rounded-xl border border-gray-700/50 bg-gray-800/50 py-2.5 pr-10 pl-10 text-sm text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none"
                dir="rtl"
                autoFocus
              />
              <button
                onClick={() => setShowSearch(false)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}