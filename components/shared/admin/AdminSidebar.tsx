// components/shared/admin/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  Boxes,
  LogOut,
  HelpCircle,
  Sparkles,
  X,
  Shield,
  ChevronDown,
  ChevronLeft,
  Building2,
  Palette,
  ImageIcon,
  Languages,
  CircleDollarSign,
  CreditCard,
  Truck,
} from 'lucide-react'
import { useSidebar } from '@/context/sidebar-context'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { SignOut } from '@/lib/actions/user.actions'
import { useState, useEffect } from 'react'

// ═══════════════════════════════════════════════════════════════
// 📋 تعريف الروابط الفرعية للإعدادات
// ═══════════════════════════════════════════════════════════════
const settingsSubLinks = [
  {
    key: 'siteInfo',
    label: 'معلومات الموقع',
    href: '/admin/settings/site-info',  // ✅ رابط مباشر
    icon: Building2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    key: 'common',
    label: 'الإعدادات العامة',
    href: '/admin/settings/common',
    icon: Palette,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    key: 'carousels',
    label: 'السلايدر',
    href: '/admin/settings/carousels',
    icon: ImageIcon,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    key: 'languages',
    label: 'اللغات',
    href: '/admin/settings/languages',
    icon: Languages,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
  {
    key: 'currencies',
    label: 'العملات',
    href: '/admin/settings/currencies',
    icon: CircleDollarSign,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    key: 'paymentMethods',
    label: 'طرق الدفع',
    href: '/admin/settings/payment-methods',
    icon: CreditCard,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    key: 'deliveryDates',
    label: 'مواعيد التوصيل',
    href: '/admin/settings/delivery-dates',
    icon: Truck,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
]

// ═══════════════════════════════════════════════════════════════
// 📋 تعريف الروابط الرئيسية
// ═══════════════════════════════════════════════════════════════
const sidebarLinks = [
  {
    key: 'overview',
    href: '/admin/overview',
    icon: Home,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
  },
  {
    key: 'categories',
    href: '/admin/categories',
    icon: Boxes,
    gradient: 'from-teal-500 to-emerald-500',
    bgColor: 'bg-teal-500/10',
    textColor: 'text-teal-400',
  },
  {
    key: 'products',
    href: '/admin/products',
    icon: Package,
    gradient: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-400',
  },
  {
    key: 'orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    gradient: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    badge: '12',
  },
  {
    key: 'users',
    href: '/admin/users',
    icon: Users,
    gradient: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
  },
  {
    key: 'pages',
    href: '/admin/web-pages',
    icon: FileText,
    gradient: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-400',
  },
]

// ═══════════════════════════════════════════════════════════════
// 🧩 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════
export default function AdminSidebar() {
  const pathname = usePathname()
  const t = useTranslations('AdminNav')
  const user = useCurrentUser()
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const { isOpen, close } = useSidebar()
  
  // حالة فتح قائمة الإعدادات الفرعية
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const isSettingsActive = pathname.includes('/admin/settings')

  // فتح قائمة الإعدادات تلقائياً إذا كنا في صفحة الإعدادات
  useEffect(() => {
    if (isSettingsActive) {
      setIsSettingsOpen(true)
    }
  }, [isSettingsActive])

  // ═══════════════════════════════════════════════════════════════
  // 🎯 معالجة التنقل للإعدادات الفرعية
  // ═══════════════════════════════════════════════════════════════
  const handleSettingsSubLinkClick = (hash: string) => {
    // إذا كنا في صفحة الإعدادات، نتنقل مباشرة للقسم
    if (isSettingsActive) {
      const element = document.querySelector(hash.replace('#', '#'))
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 100
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
    close() // إغلاق السايدبار على الموبايل
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎯 مكون معلومات المستخدم
  // ═══════════════════════════════════════════════════════════════
  const UserInfo = () =>
    user ? (
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-4 border border-gray-700/50">
        <div className="flex items-center gap-3">
          {/* صورة المستخدم */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-70 blur-sm" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold text-lg shadow-lg">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              ) : (
                user.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-gray-900 bg-emerald-500" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">
              {t('welcome')} 👋
            </p>
            <p className="text-sm text-gray-400 truncate">{user.name}</p>
          </div>
        </div>

        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-400 border border-yellow-400/20">
            <Shield className="h-3 w-3" />
            مدير النظام
          </span>
        </div>
      </div>
    ) : null

  // ═══════════════════════════════════════════════════════════════
  // 🎯 مكون الروابط
  // ═══════════════════════════════════════════════════════════════
  const SidebarLinks = () => (
    <nav className="space-y-1.5">
      <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        القائمة الرئيسية
      </h3>

      {sidebarLinks.map((item) => {
        const isActive = pathname.startsWith(item.href)
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => close()}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300',
              isActive
                ? ['bg-gradient-to-r', item.gradient, 'text-white shadow-lg']
                : ['text-gray-400', 'hover:bg-gray-800/50', 'hover:text-white']
            )}
          >
            {isActive && (
              <span className={cn(
                'absolute top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-white/50',
                isRTL ? 'right-0' : 'left-0'
              )} />
            )}

            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300',
              isActive ? 'bg-white/20' : [item.bgColor, 'group-hover:scale-110']
            )}>
              <Icon className={cn(
                'h-5 w-5 transition-all duration-300',
                isActive ? 'text-white' : item.textColor
              )} />
            </div>

            <span className="flex-1 font-medium">{t(`links.${item.key}`)}</span>

            {item.badge && (
              <span className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-bold',
                isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white animate-pulse'
              )}>
                {item.badge}
              </span>
            )}

            {isActive && (
              <Sparkles className="h-4 w-4 text-white/70 animate-pulse" />
            )}
          </Link>
        )
      })}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ⚙️ قسم الإعدادات مع القائمة الفرعية */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="pt-4 mt-4 border-t border-gray-800/50">
        <h3 className="px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          الإعدادات
        </h3>

        {/* زر الإعدادات الرئيسي */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={cn(
            'group relative flex items-center gap-3 rounded-xl px-3 py-3 w-full transition-all duration-300',
            isSettingsActive
              ? 'bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-lg'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
          )}
        >
          {isSettingsActive && (
            <span className={cn(
              'absolute top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-white/50',
              isRTL ? 'right-0' : 'left-0'
            )} />
          )}

          <div className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300',
            isSettingsActive ? 'bg-white/20' : 'bg-slate-500/10 group-hover:scale-110'
          )}>
            <Settings className={cn(
              'h-5 w-5 transition-all duration-300',
              isSettingsActive ? 'text-white' : 'text-slate-400'
            )} />
          </div>

          <span className="flex-1 font-medium text-right">{t('links.settings')}</span>

          <ChevronDown className={cn(
            'h-4 w-4 transition-transform duration-300',
            isSettingsOpen ? 'rotate-180' : ''
          )} />

          {isSettingsActive && (
            <Sparkles className="h-4 w-4 text-white/70 animate-pulse" />
          )}
        </button>

        {/* القائمة الفرعية للإعدادات */}
        <div className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isSettingsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="mt-2 mr-3 pr-3 border-r-2 border-gray-700/50 space-y-1">
            {settingsSubLinks.map((subItem) => {
              const SubIcon = subItem.icon
              
              return (
                <Link
                  key={subItem.key}
                  href={`/admin/settings${subItem.hash}`}
                  onClick={() => handleSettingsSubLinkClick(subItem.hash)}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                    'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  )}
                >
                  <div className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200',
                    subItem.bgColor,
                    'group-hover:scale-110'
                  )}>
                    <SubIcon className={cn('h-4 w-4', subItem.color)} />
                  </div>
                  <span className="text-sm">{subItem.label}</span>
                  <ChevronLeft className={cn(
                    'h-3 w-3 mr-auto opacity-0 group-hover:opacity-100 transition-opacity',
                    isRTL ? 'rotate-180' : ''
                  )} />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )

  // ═══════════════════════════════════════════════════════════════
  // 🎯 بطاقة المساعدة
  // ═══════════════════════════════════════════════════════════════
  const HelpCard = () => (
    <div className="mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 p-4 border border-indigo-500/20">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
          <HelpCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-white text-sm">تحتاج مساعدة؟</h4>
          <p className="text-xs text-gray-400">نحن هنا لمساعدتك</p>
        </div>
      </div>
      <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all active:scale-95">
        تواصل معنا
      </button>
    </div>
  )

  // ═══════════════════════════════════════════════════════════════
  // 🎯 زر تسجيل الخروج
  // ═══════════════════════════════════════════════════════════════
  const LogoutButton = () => (
    <form action={SignOut}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-gray-400 hover:text-red-400 bg-gray-800/50 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all group"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-700/50 group-hover:bg-red-500/20 transition-colors">
          <LogOut className="h-5 w-5" />
        </div>
        <span className="font-medium">تسجيل الخروج</span>
      </button>
    </form>
  )

  // ═══════════════════════════════════════════════════════════════
  // 🎨 محتوى السايدبار
  // ═══════════════════════════════════════════════════════════════
  const SidebarContent = ({ showCloseButton = false }: { showCloseButton?: boolean }) => (
    <div className="flex h-full flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* الشريط الملون */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />

      {/* الهيدر */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800/50">
        <Link href="/admin/overview" className="flex items-center gap-3 group" onClick={() => close()}>
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 opacity-50 blur-sm" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
              <Image src="/icons/logo.svg" alt="Logo" width={28} height={28} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {t('Dashboard')}
            </span>
            <span className="text-xs text-gray-500">لوحة التحكم</span>
          </div>
        </Link>

        {/* زر الإغلاق للموبايل */}
        {showCloseButton && (
          <button
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* المحتوى */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <UserInfo />
        <SidebarLinks />
      </div>

      {/* الفوتر */}
      <div className="border-t border-gray-800/50 p-4">
        <HelpCard />
        <LogoutButton />
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════════════════════
  // 🖥️ JSX الرئيسي
  // ═══════════════════════════════════════════════════════════════
  return (
    <>
      {/* ═══════════════ Overlay للموبايل ═══════════════ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* ═══════════════ السايدبار للموبايل ═══════════════ */}
      <aside
        className={cn(
          'fixed top-0 z-50 h-screen w-72 max-w-[85vw] lg:hidden',
          'transform transition-transform duration-300 ease-in-out',
          'shadow-2xl shadow-black/50',
          isRTL ? 'right-0' : 'left-0',
          isOpen
            ? 'translate-x-0'
            : isRTL
              ? 'translate-x-full'
              : '-translate-x-full'
        )}
      >
        <SidebarContent showCloseButton />
      </aside>

      {/* ═══════════════ السايدبار للديسكتوب ═══════════════ */}
      <aside
        className={cn(
          'fixed top-0 z-30 hidden h-screen w-72 lg:flex lg:flex-col',
          'border-gray-800/50 shadow-xl',
          isRTL ? 'right-0 border-l' : 'left-0 border-r'
        )}
      >
        <SidebarContent />
      </aside>

      {/* ═══════════════ Spacer للديسكتوب ═══════════════ */}
      <div className="hidden w-72 flex-shrink-0 lg:block" />
    </>
  )
}