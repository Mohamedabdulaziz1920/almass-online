// components/shared/header/sidebar.tsx
import * as React from 'react'
import Link from 'next/link'
import { 
  X, 
  ChevronRight, 
  ChevronLeft,
  UserCircle, 
  MenuIcon,
  ShoppingBag,
  Headphones,
  LogOut,
  LogIn,
  User,
  Sparkles,
  Layers,
  Settings,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SignOut } from '@/lib/actions/user.actions'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { auth } from '@/auth'
import { getLocale, getTranslations } from 'next-intl/server'
import { getDirection } from '@/i18n-config'
import { cn } from '@/lib/utils'

export default async function Sidebar({
  categories,
}: {
  categories: string[]
}) {
  const session = await auth()
  const locale = await getLocale()
  const t = await getTranslations()
  const isRTL = getDirection(locale) === 'rtl'
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <Drawer direction={isRTL ? 'right' : 'left'}>
      {/* ═══════════════════════════════════════════════════════════════════════
          🔹 زر فتح القائمة
          ═══════════════════════════════════════════════════════════════════════ */}
      <DrawerTrigger 
        className='group flex items-center gap-2 px-4 py-2.5
                   bg-gradient-to-r from-primary to-amber-500
                   hover:from-primary/90 hover:to-amber-500/90
                   text-primary-foreground font-medium text-sm
                   rounded-xl
                   shadow-lg shadow-primary/25
                   hover:shadow-xl hover:shadow-primary/30
                   hover:scale-[1.02] active:scale-[0.98]
                   transition-all duration-300
                   overflow-hidden relative'
      >
        {/* 🔹 تأثير اللمعة */}
        <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                        translate-x-[-100%] group-hover:translate-x-[100%]
                        transition-transform duration-700' />
        
        <MenuIcon className='h-5 w-5 group-hover:rotate-180 transition-transform duration-500' />
        <span className='relative'>{t('Header.All')}</span>
      </DrawerTrigger>

      {/* ═══════════════════════════════════════════════════════════════════════
          🔹 محتوى الـ Drawer
          ═══════════════════════════════════════════════════════════════════════ */}
      <DrawerContent 
        className={cn(
          'w-[320px] sm:w-[380px] h-full mt-0 top-0',
          'bg-gradient-to-b from-gray-900 via-gray-900 to-black',
          'border-0 shadow-2xl'
        )}
      >
        {/* 🔹 خلفية متوهجة */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-32 -right-32 w-64 h-64 
                          bg-primary/20 rounded-full blur-3xl animate-pulse' />
          <div className='absolute top-1/2 -left-32 w-64 h-64 
                          bg-amber-500/15 rounded-full blur-3xl animate-pulse' 
               style={{ animationDelay: '1s' }} />
          <div className='absolute -bottom-32 -right-32 w-64 h-64 
                          bg-blue-500/15 rounded-full blur-3xl animate-pulse'
               style={{ animationDelay: '0.5s' }} />
        </div>

        <div className='relative z-10 flex flex-col h-full'>
          
          {/* ═══════════════════════════════════════════════════════════════════
              🔹 قسم المستخدم - User Section
              ═══════════════════════════════════════════════════════════════════ */}
          <div className='relative overflow-hidden'>
            {/* 🔹 خلفية متدرجة */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary/90 via-amber-500/90 to-primary/90' />
            
            {/* 🔹 نمط زخرفي */}
            <div className='absolute inset-0 opacity-10'>
              <div className='absolute top-0 left-0 w-full h-full'
                   style={{
                     backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                     backgroundSize: '24px 24px'
                   }} />
            </div>

            <div className='relative p-5'>
              <div className='flex items-center justify-between'>
                <DrawerHeader className='p-0 flex-1'>
                  <DrawerTitle className='flex items-center gap-3'>
                    {/* 🔹 صورة المستخدم */}
                    <div className='relative'>
                      <div className='absolute -inset-1 bg-white/30 rounded-full blur' />
                      <div className='relative w-12 h-12 rounded-full 
                                      bg-gradient-to-br from-white/20 to-white/5
                                      border-2 border-white/30
                                      flex items-center justify-center
                                      shadow-lg'>
                        {session ? (
                          <span className='text-white text-lg font-bold'>
                            {session.user.name?.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <UserCircle className='h-7 w-7 text-white' />
                        )}
                      </div>
                      {/* 🔹 مؤشر Online */}
                      {session && (
                        <span className='absolute -bottom-0.5 -right-0.5 
                                         w-4 h-4 rounded-full
                                         bg-green-500 border-2 border-white
                                         flex items-center justify-center'>
                          <span className='w-2 h-2 rounded-full bg-green-300 animate-pulse' />
                        </span>
                      )}
                    </div>
                    
                    {/* 🔹 معلومات المستخدم */}
                    <div className='flex flex-col'>
                      <span className='text-white/70 text-xs font-medium'>
                        {t('Header.Hello')} 👋
                      </span>
                      {session ? (
                        <DrawerClose asChild>
                          <Link 
                            href='/account'
                            className='text-white text-lg font-bold hover:text-white/90 
                                       transition-colors duration-200'
                          >
                            {session.user.name}
                          </Link>
                        </DrawerClose>
                      ) : (
                        <DrawerClose asChild>
                          <Link 
                            href='/sign-in'
                            className='text-white text-lg font-bold hover:text-white/90 
                                       transition-colors duration-200 flex items-center gap-1'
                          >
                            {t('Header.sign in')}
                            <Sparkles className='w-4 h-4' />
                          </Link>
                        </DrawerClose>
                      )}
                    </div>
                  </DrawerTitle>
                  <DrawerDescription className='sr-only'>
                    Sidebar navigation menu
                  </DrawerDescription>
                </DrawerHeader>

                {/* 🔹 زر الإغلاق */}
                <DrawerClose asChild>
                  <Button 
                    variant='ghost' 
                    size='icon' 
                    className='w-10 h-10 rounded-xl
                               bg-white/10 hover:bg-white/20
                               text-white hover:text-white
                               border border-white/20
                               transition-all duration-200
                               hover:rotate-90'
                  >
                    <X className='h-5 w-5' />
                    <span className='sr-only'>Close</span>
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              🔹 قسم التصنيفات - Categories Section
              ═══════════════════════════════════════════════════════════════════ */}
          <div className='flex-1 overflow-y-auto custom-scrollbar'>
            {/* 🔹 عنوان القسم */}
            <div className='sticky top-0 z-10 p-4 
                            bg-gray-900/95 backdrop-blur-sm
                            border-b border-white/5'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-gradient-to-br from-primary/20 to-amber-500/20
                                border border-primary/20'>
                  <Layers className='w-5 h-5 text-primary' />
                </div>
                <h2 className='text-white font-bold text-lg'>
                  {t('Header.Shop By Department')}
                </h2>
              </div>
            </div>

            {/* 🔹 قائمة التصنيفات */}
            <nav className='p-3 space-y-1'>
              {categories.map((category, index) => (
                <DrawerClose asChild key={category}>
                  <Link
                    href={`/search?category=${category}`}
                    className='group flex items-center justify-between p-3.5 rounded-xl
                               bg-white/5 hover:bg-gradient-to-r hover:from-primary/20 hover:to-amber-500/20
                               border border-transparent hover:border-primary/30
                               transition-all duration-300
                               hover:translate-x-1 rtl:hover:-translate-x-1'
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-2 h-2 rounded-full 
                                      bg-gradient-to-r from-primary to-amber-500
                                      opacity-0 group-hover:opacity-100
                                      scale-0 group-hover:scale-100
                                      transition-all duration-300' />
                      <span className='text-gray-300 group-hover:text-white 
                                       font-medium transition-colors duration-200'>
                        {category}
                      </span>
                    </div>
                    <ChevronIcon className='h-4 w-4 text-gray-500 
                                            group-hover:text-primary
                                            group-hover:translate-x-1 rtl:group-hover:-translate-x-1
                                            transition-all duration-200' />
                  </Link>
                </DrawerClose>
              ))}
            </nav>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              🔹 قسم المساعدة والإعدادات - Help & Settings
              ═══════════════════════════════════════════════════════════════════ */}
          <div className='border-t border-white/10 bg-gray-900/50 backdrop-blur-sm'>
            {/* 🔹 عنوان القسم */}
            <div className='p-4 border-b border-white/5'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-blue-500/10 border border-blue-500/20'>
                  <Settings className='w-4 h-4 text-blue-400' />
                </div>
                <h2 className='text-gray-400 font-semibold text-sm uppercase tracking-wider'>
                  {t('Header.Help & Settings')}
                </h2>
              </div>
            </div>

            {/* 🔹 روابط المساعدة */}
            <div className='p-3 space-y-1'>
              {/* 🔹 حسابك */}
              <DrawerClose asChild>
                <Link 
                  href='/account' 
                  className='group flex items-center gap-3 p-3 rounded-xl
                             hover:bg-white/5 transition-all duration-200'
                >
                  <div className='p-2 rounded-lg bg-blue-500/10 
                                  group-hover:bg-blue-500/20 transition-colors duration-200'>
                    <User className='w-4 h-4 text-blue-400' />
                  </div>
                  <span className='text-gray-300 group-hover:text-white 
                                   transition-colors duration-200'>
                    {t('Header.Your account')}
                  </span>
                </Link>
              </DrawerClose>

              {/* 🔹 خدمة العملاء */}
              <DrawerClose asChild>
                <Link 
                  href='/page/customer-service' 
                  className='group flex items-center gap-3 p-3 rounded-xl
                             hover:bg-white/5 transition-all duration-200'
                >
                  <div className='p-2 rounded-lg bg-green-500/10 
                                  group-hover:bg-green-500/20 transition-colors duration-200'>
                    <Headphones className='w-4 h-4 text-green-400' />
                  </div>
                  <span className='text-gray-300 group-hover:text-white 
                                   transition-colors duration-200'>
                    {t('Header.Customer Service')}
                  </span>
                </Link>
              </DrawerClose>

              {/* 🔹 المساعدة */}
              <DrawerClose asChild>
                <Link 
                  href='/page/help' 
                  className='group flex items-center gap-3 p-3 rounded-xl
                             hover:bg-white/5 transition-all duration-200'
                >
                  <div className='p-2 rounded-lg bg-purple-500/10 
                                  group-hover:bg-purple-500/20 transition-colors duration-200'>
                    <HelpCircle className='w-4 h-4 text-purple-400' />
                  </div>
                  <span className='text-gray-300 group-hover:text-white 
                                   transition-colors duration-200'>
                    {t('Header.Help')}
                  </span>
                </Link>
              </DrawerClose>

              {/* 🔹 تسجيل الدخول/الخروج */}
              {session ? (
                <form action={SignOut} className='w-full'>
                  <Button
                    className='w-full justify-start gap-3 p-3 h-auto
                               bg-transparent hover:bg-red-500/10
                               text-gray-300 hover:text-red-400
                               rounded-xl transition-all duration-200
                               group'
                    variant='ghost'
                  >
                    <div className='p-2 rounded-lg bg-red-500/10 
                                    group-hover:bg-red-500/20 transition-colors duration-200'>
                      <LogOut className='w-4 h-4 text-red-400' />
                    </div>
                    <span>{t('Header.Sign out')}</span>
                  </Button>
                </form>
              ) : (
                <DrawerClose asChild>
                  <Link 
                    href='/sign-in' 
                    className='group flex items-center gap-3 p-3 rounded-xl
                               bg-gradient-to-r from-primary/10 to-amber-500/10
                               hover:from-primary/20 hover:to-amber-500/20
                               border border-primary/20
                               transition-all duration-200'
                  >
                    <div className='p-2 rounded-lg bg-primary/20'>
                      <LogIn className='w-4 h-4 text-primary' />
                    </div>
                    <span className='text-primary group-hover:text-white 
                                     font-medium transition-colors duration-200'>
                      {t('Header.Sign in')}
                    </span>
                  </Link>
                </DrawerClose>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              🔹 الفوتر
              ═══════════════════════════════════════════════════════════════════ */}
          <div className='p-4 border-t border-white/5 bg-black/30'>
            <div className='flex items-center justify-center gap-2 text-xs text-gray-600'>
              <ShoppingBag className='w-3 h-3' />
              <span>© 2024 - جميع الحقوق محفوظة</span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}