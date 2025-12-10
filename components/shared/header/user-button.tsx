// components/shared/header/user-button.tsx
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOut } from '@/lib/actions/user.actions'
import { cn } from '@/lib/utils'
import { 
  ChevronDownIcon, 
  User, 
  Package,  
  LogOut, 
  LogIn,
  UserPlus,
  Shield,
  Sparkles
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function UserButton() {
  const t = await getTranslations()
  const session = await auth()
  
  return (
    <div className='flex items-center'>
      <DropdownMenu>
        {/* 🔹 زر القائمة المنسدلة */}
        <DropdownMenuTrigger asChild>
          <button 
            className='group relative flex items-center gap-3 px-3 py-2
                       rounded-xl
                       bg-white/5 hover:bg-white/10
                       border border-white/10 hover:border-purple-500/30
                       transition-all duration-300
                       hover:shadow-lg hover:shadow-purple-500/10
                       focus:outline-none focus:ring-2 focus:ring-purple-500/50'
          >
            {/* 🔹 أيقونة المستخدم */}
            <div className='relative'>
              {/* 🔹 حلقة متحركة للمستخدم المسجل */}
              {session && (
                <div className='absolute -inset-0.5 rounded-full 
                                bg-gradient-to-r from-purple-500 to-pink-500
                                opacity-50 blur-sm animate-pulse'></div>
              )}
              
              <div className={cn(
                'relative p-2 rounded-lg transition-all duration-300',
                session 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30'
                  : 'bg-white/10 group-hover:bg-white/20'
              )}>
                <User className={cn(
                  'h-4 w-4 transition-colors duration-200',
                  session ? 'text-white' : 'text-gray-300 group-hover:text-white'
                )} />
              </div>
              
              {/* 🔹 مؤشر الحالة للمستخدم المسجل */}
              {session && (
                <span className='absolute -bottom-0.5 -right-0.5 
                                 w-3 h-3 rounded-full
                                 bg-green-500 border-2 border-gray-900
                                 shadow-lg shadow-green-500/50'></span>
              )}
            </div>

            {/* 🔹 النص */}
            <div className='hidden sm:flex flex-col items-start'>
              <span className='text-[10px] text-gray-400 leading-tight'>
                {t('Header.Hello')},{' '}
                <span className={cn(
                  'font-medium',
                  session ? 'text-purple-300' : 'text-gray-300'
                )}>
                  {session ? session.user.name?.split(' ')[0] : t('Header.sign in')}
                </span>
              </span>
              <span className='text-xs font-bold text-white leading-tight flex items-center gap-1'>
                {t('Header.Account & Orders')}
                {session?.user.role === 'Admin' && (
                  <Shield className='w-3 h-3 text-amber-400' />
                )}
              </span>
            </div>

            {/* 🔹 السهم */}
            <ChevronDownIcon className='h-4 w-4 text-gray-400 
                                         group-hover:text-white
                                         group-data-[state=open]:rotate-180
                                         transition-all duration-300' />
          </button>
        </DropdownMenuTrigger>

        {/* 🔹 محتوى القائمة المنسدلة - للمستخدم المسجل */}
        {session ? (
          <DropdownMenuContent 
            className='w-72 p-2
                       bg-gray-900/95 backdrop-blur-xl
                       border border-white/10
                       rounded-2xl shadow-2xl shadow-black/50
                       animate-in fade-in-0 zoom-in-95 duration-200'
            align='end' 
            forceMount
            sideOffset={8}
          >
            {/* 🔹 هيدر المستخدم */}
            <DropdownMenuLabel className='p-0 mb-2'>
              <div className='relative overflow-hidden rounded-xl 
                              bg-gradient-to-br from-purple-600/90 via-pink-600/90 to-purple-700/90
                              p-4'>
                {/* 🔹 نمط زخرفي */}
                <div className='absolute inset-0 opacity-10'>
                  <div className='absolute inset-0'
                       style={{
                         backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                         backgroundSize: '16px 16px'
                       }}></div>
                </div>
                
                <div className='relative flex items-center gap-3'>
                  {/* 🔹 صورة المستخدم */}
                  <div className='relative'>
                    <div className='absolute -inset-1 bg-white/30 rounded-full blur'></div>
                    <div className='relative w-12 h-12 rounded-full 
                                    bg-gradient-to-br from-white/20 to-white/5
                                    border-2 border-white/40
                                    flex items-center justify-center
                                    shadow-lg'>
                      <span className='text-lg font-bold text-white'>
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* 🔹 مؤشر Online */}
                    <span className='absolute -bottom-0.5 -right-0.5 
                                     w-4 h-4 rounded-full
                                     bg-green-500 border-2 border-purple-600
                                     flex items-center justify-center'>
                      <span className='w-2 h-2 rounded-full bg-green-300 animate-pulse'></span>
                    </span>
                  </div>
                  
                  {/* 🔹 معلومات المستخدم */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-bold text-white truncate'>
                      {session.user.name}
                    </p>
                    <p className='text-xs text-white/70 truncate'>
                      {session.user.email}
                    </p>
                    {session.user.role === 'Admin' && (
                      <span className='inline-flex items-center gap-1 mt-1 px-2 py-0.5 
                                       bg-amber-500/20 text-amber-300 
                                       text-[10px] font-semibold rounded-full
                                       border border-amber-500/30'>
                        <Shield className='w-3 h-3' />
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* 🔹 روابط القائمة */}
            <DropdownMenuGroup className='space-y-1'>
              {/* 🔹 حسابك */}
              <DropdownMenuItem asChild className='p-0'>
                <Link 
                  href='/account'
                  className='flex items-center gap-3 w-full px-3 py-2.5
                             rounded-lg cursor-pointer
                             hover:bg-white/5
                             transition-colors duration-200
                             group/item'
                >
                  <div className='p-2 rounded-lg bg-blue-500/10 
                                  group-hover/item:bg-blue-500/20 
                                  transition-colors duration-200'>
                    <User className='w-4 h-4 text-blue-400' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-white'>
                      {t('Header.Your account')}
                    </p>
                    <p className='text-xs text-gray-500'>
                      إدارة معلوماتك الشخصية
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>

              {/* 🔹 طلباتك */}
              <DropdownMenuItem asChild className='p-0'>
                <Link 
                  href='/account/orders'
                  className='flex items-center gap-3 w-full px-3 py-2.5
                             rounded-lg cursor-pointer
                             hover:bg-white/5
                             transition-colors duration-200
                             group/item'
                >
                  <div className='p-2 rounded-lg bg-green-500/10 
                                  group-hover/item:bg-green-500/20 
                                  transition-colors duration-200'>
                    <Package className='w-4 h-4 text-green-400' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-white'>
                      {t('Header.Your orders')}
                    </p>
                    <p className='text-xs text-gray-500'>
                      تتبع وإدارة طلباتك
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>

              {/* 🔹 لوحة التحكم - للأدمن فقط */}
              {session.user.role === 'Admin' && (
                <DropdownMenuItem asChild className='p-0'>
                  <Link 
                    href='/admin/overview'
                    className='flex items-center gap-3 w-full px-3 py-2.5
                               rounded-lg cursor-pointer
                               bg-gradient-to-r from-amber-500/10 to-orange-500/10
                               hover:from-amber-500/20 hover:to-orange-500/20
                               border border-amber-500/20
                               transition-all duration-200
                               group/item'
                  >
                    <div className='p-2 rounded-lg bg-amber-500/20'>
                      <Shield className='w-4 h-4 text-amber-400' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-amber-300'>
                        {t('Header.Admin')}
                      </p>
                      <p className='text-xs text-amber-500/70'>
                        لوحة تحكم المدير
                      </p>
                    </div>
                    <Sparkles className='w-4 h-4 text-amber-400' />
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className='my-2 bg-white/10' />

            {/* 🔹 تسجيل الخروج */}
            <DropdownMenuItem asChild className='p-0'>
              <form action={SignOut} className='w-full'>
                <Button
                  variant='ghost'
                  className='w-full justify-start gap-3 px-3 py-2.5 h-auto
                             rounded-lg
                             text-gray-400 hover:text-red-400
                             hover:bg-red-500/10
                             transition-all duration-200
                             group/signout'
                >
                  <div className='p-2 rounded-lg bg-red-500/10 
                                  group-hover/signout:bg-red-500/20 
                                  transition-colors duration-200'>
                    <LogOut className='w-4 h-4 text-red-400' />
                  </div>
                  <span className='text-sm font-medium'>
                    {t('Header.Sign out')}
                  </span>
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        ) : (
          /* 🔹 محتوى القائمة المنسدلة - للزائر */
          <DropdownMenuContent 
            className='w-72 p-3
                       bg-gray-900/95 backdrop-blur-xl
                       border border-white/10
                       rounded-2xl shadow-2xl shadow-black/50
                       animate-in fade-in-0 zoom-in-95 duration-200'
            align='end' 
            forceMount
            sideOffset={8}
          >
            {/* 🔹 هيدر الترحيب */}
            <div className='text-center mb-4'>
              <div className='inline-flex p-3 rounded-full 
                              bg-gradient-to-br from-purple-500/20 to-pink-500/20
                              border border-purple-500/30 mb-3'>
                <User className='w-8 h-8 text-purple-400' />
              </div>
              <h3 className='text-lg font-bold text-white'>
                مرحباً بك! 👋
              </h3>
              <p className='text-sm text-gray-400'>
                سجل دخولك للوصول لحسابك
              </p>
            </div>

            {/* 🔹 زر تسجيل الدخول */}
            <DropdownMenuItem asChild className='p-0 mb-2'>
              <Link
                href='/sign-in'
                className='flex items-center justify-center gap-2 w-full py-3
                           bg-gradient-to-r from-purple-600 to-pink-600
                           hover:from-purple-700 hover:to-pink-700
                           text-white font-semibold
                           rounded-xl
                           shadow-lg shadow-purple-500/25
                           hover:shadow-xl hover:shadow-purple-500/30
                           transition-all duration-300
                           hover:scale-[1.02] active:scale-[0.98]'
              >
                <LogIn className='w-5 h-5' />
                {t('Header.Sign in')}
              </Link>
            </DropdownMenuItem>

            {/* 🔹 الفاصل */}
            <div className='relative my-4'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-white/10'></div>
              </div>
              <div className='relative flex justify-center text-xs'>
                <span className='bg-gray-900 px-3 text-gray-500'>
                  {t('Header.New Customer')}?
                </span>
              </div>
            </div>

            {/* 🔹 زر إنشاء حساب */}
            <DropdownMenuItem asChild className='p-0'>
              <Link
                href='/sign-up'
                className='flex items-center justify-center gap-2 w-full py-3
                           bg-white/5 hover:bg-white/10
                           border border-white/10 hover:border-purple-500/30
                           text-gray-300 hover:text-white font-medium
                           rounded-xl
                           transition-all duration-300
                           group'
              >
                <UserPlus className='w-5 h-5 group-hover:text-purple-400 
                                     transition-colors duration-200' />
                {t('Header.Sign up')}
              </Link>
            </DropdownMenuItem>

            {/* 🔹 ملاحظة */}
            <p className='text-center text-xs text-gray-600 mt-4'>
              🔒 معلوماتك محمية وآمنة
            </p>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}