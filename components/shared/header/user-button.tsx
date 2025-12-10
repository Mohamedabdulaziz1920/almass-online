import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
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
  ChevronDown,
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
  CreditCard,
  MapPin,
  Bell,
  HelpCircle,
  Sparkles,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function UserButton() {
  const t = await getTranslations()
  const session = await auth()

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Menu items for logged in users
  const menuItems = [
    {
      label: t('Header.Your account'),
      href: '/account',
      icon: User,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: t('Header.Your orders'),
      href: '/account/orders',
      icon: Package,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: t('Header.Wishlist'),
      href: '/wishlist',
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: t('Header.Addresses'),
      href: '/account/addresses',
      icon: MapPin,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: t('Header.Payment Methods'),
      href: '/account/payment',
      icon: CreditCard,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'relative flex items-center gap-2 px-3 py-2 rounded-xl',
            'transition-all duration-300 ease-out',
            'hover:bg-white/10',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'group'
          )}
        >
          {/* Avatar */}
          <div className="relative">
            {session?.user?.image ? (
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/50 group-hover:ring-primary transition-all">
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  fill
                  className="object-cover"
                />
              </div>
            ) : session ? (
              <div
                className={cn(
                  'w-9 h-9 rounded-full',
                  'bg-gradient-to-br from-primary to-amber-500',
                  'flex items-center justify-center',
                  'text-sm font-bold text-primary-foreground',
                  'ring-2 ring-primary/30 group-hover:ring-primary/60',
                  'transition-all duration-300',
                  'group-hover:scale-105'
                )}
              >
                {getInitials(session.user.name || 'U')}
              </div>
            ) : (
              <div
                className={cn(
                  'w-9 h-9 rounded-full',
                  'bg-gray-700 group-hover:bg-gray-600',
                  'flex items-center justify-center',
                  'transition-all duration-300',
                  'group-hover:scale-105'
                )}
              >
                <User className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            )}

            {/* Online Indicator */}
            {session && (
              <span
                className={cn(
                  'absolute -bottom-0.5 -right-0.5',
                  'w-3 h-3 rounded-full',
                  'bg-green-500 border-2 border-gray-900',
                  'shadow-lg shadow-green-500/50'
                )}
              />
            )}

            {/* Admin Badge */}
            {session?.user?.role === 'Admin' && (
              <span
                className={cn(
                  'absolute -top-1 -right-1',
                  'w-4 h-4 rounded-full',
                  'bg-gradient-to-r from-purple-500 to-pink-500',
                  'flex items-center justify-center',
                  'border border-gray-900'
                )}
              >
                <Shield className="h-2.5 w-2.5 text-white" />
              </span>
            )}
          </div>

          {/* Text */}
          <div className="hidden sm:flex flex-col items-start text-right">
            <span className="text-[10px] text-gray-400 leading-tight">
              {t('Header.Hello')},{' '}
              {session ? (
                <span className="text-primary font-medium">
                  {session.user?.name?.split(' ')[0]}
                </span>
              ) : (
                t('Header.sign in')
              )}
            </span>
            <span className="text-sm font-bold text-white leading-tight group-hover:text-primary transition-colors">
              {t('Header.Account & Orders')}
            </span>
          </div>

          {/* Chevron */}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-gray-400',
              'transition-all duration-300',
              'group-hover:text-primary',
              'group-data-[state=open]:rotate-180'
            )}
          />

          {/* Hover Ring */}
          <div
            className={cn(
              'absolute inset-0 rounded-xl',
              'border border-transparent',
              'group-hover:border-primary/30',
              'transition-all duration-300 pointer-events-none'
            )}
          />
        </button>
      </DropdownMenuTrigger>

      {session ? (
        /* ═══════════════════ Logged In Menu ═══════════════════ */
        <DropdownMenuContent
          className={cn(
            'w-72 p-0',
            'bg-gray-900/95 backdrop-blur-xl',
            'border border-gray-700',
            'shadow-2xl shadow-black/50',
            'animate-in fade-in-0 zoom-in-95'
          )}
          align="end"
          sideOffset={8}
        >
          {/* User Header */}
          <div className="p-4 bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 border-b border-gray-800">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              {session.user?.image ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/50">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    'w-12 h-12 rounded-full',
                    'bg-gradient-to-br from-primary to-amber-500',
                    'flex items-center justify-center',
                    'text-lg font-bold text-primary-foreground'
                  )}
                >
                  {getInitials(session.user?.name || 'U')}
                </div>
              )}

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white truncate">
                    {session.user?.name}
                  </p>
                  {session.user?.role === 'Admin' && (
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] font-bold',
                        'bg-gradient-to-r from-purple-500 to-pink-500',
                        'text-white'
                      )}
                    >
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {session.user?.email}
                </p>
              </div>
            </div>

            {/* Quick Stats (Optional) */}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700/50">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">12</p>
                <p className="text-[10px] text-gray-400">{t('Header.Orders')}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-400">5</p>
                <p className="text-[10px] text-gray-400">{t('Header.Wishlist')}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-400">150</p>
                <p className="text-[10px] text-gray-400">{t('Header.Points')}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <DropdownMenuGroup>
              {menuItems.map((item, index) => (
                <DropdownMenuItem key={index} asChild className="p-0">
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                      'transition-all duration-200',
                      'hover:bg-white/5',
                      'group/item cursor-pointer'
                    )}
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center',
                        'transition-all duration-200',
                        item.bgColor,
                        'group-hover/item:scale-110'
                      )}
                    >
                      <item.icon className={cn('h-4 w-4', item.color)} />
                    </div>
                    <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors">
                      {item.label}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            {/* Admin Link */}
            {session.user?.role === 'Admin' && (
              <>
                <DropdownMenuSeparator className="bg-gray-800 my-2" />
                <DropdownMenuItem asChild className="p-0">
                  <Link
                    href="/admin/overview"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                      'bg-gradient-to-r from-purple-500/10 to-pink-500/10',
                      'border border-purple-500/20',
                      'transition-all duration-200',
                      'hover:from-purple-500/20 hover:to-pink-500/20',
                      'group/item cursor-pointer'
                    )}
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center',
                        'bg-gradient-to-r from-purple-500 to-pink-500',
                        'group-hover/item:scale-110 transition-transform'
                      )}
                    >
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">
                        {t('Header.Admin Dashboard')}
                      </span>
                      <p className="text-[10px] text-gray-400">
                        {t('Header.Manage your store')}
                      </p>
                    </div>
                    <Sparkles className="h-4 w-4 text-purple-400 mr-auto" />
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator className="bg-gray-800 my-2" />

            {/* Help */}
            <DropdownMenuItem asChild className="p-0">
              <Link
                href="/page/help"
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg',
                  'transition-all duration-200',
                  'hover:bg-white/5',
                  'group/item cursor-pointer'
                )}
              >
                <HelpCircle className="h-4 w-4 text-gray-400 group-hover/item:text-white transition-colors" />
                <span className="text-sm text-gray-400 group-hover/item:text-white transition-colors">
                  {t('Header.Help & Support')}
                </span>
              </Link>
            </DropdownMenuItem>

            {/* Sign Out */}
            <DropdownMenuItem className="p-0 mt-1">
              <form action={SignOut} className="w-full">
                <Button
                  type="submit"
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3 px-3 py-2.5 h-auto',
                    'rounded-lg',
                    'text-red-400 hover:text-red-300',
                    'hover:bg-red-500/10',
                    'transition-all duration-200'
                  )}
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center',
                      'bg-red-500/10'
                    )}
                  >
                    <LogOut className="h-4 w-4" />
                  </div>
                  {t('Header.Sign out')}
                </Button>
              </form>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      ) : (
        /* ═══════════════════ Guest Menu ═══════════════════ */
        <DropdownMenuContent
          className={cn(
            'w-72 p-0',
            'bg-gray-900/95 backdrop-blur-xl',
            'border border-gray-700',
            'shadow-2xl shadow-black/50',
            'animate-in fade-in-0 zoom-in-95'
          )}
          align="end"
          sideOffset={8}
        >
          {/* Welcome Header */}
          <div className="p-6 text-center bg-gradient-to-r from-primary/10 via-amber-500/10 to-primary/10 border-b border-gray-800">
            <div
              className={cn(
                'w-16 h-16 mx-auto mb-4 rounded-full',
                'bg-gradient-to-br from-gray-700 to-gray-800',
                'flex items-center justify-center',
                'ring-2 ring-gray-600'
              )}
            >
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {t('Header.Welcome')}!
            </h3>
            <p className="text-sm text-gray-400">
              {t('Header.Sign in for personalized experience')}
            </p>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-3">
            {/* Sign In Button */}
            <Link href="/sign-in" className="block">
              <Button
                className={cn(
                  'w-full h-12',
                  'bg-gradient-to-r from-primary to-amber-500',
                  'hover:from-primary/90 hover:to-amber-500/90',
                  'text-primary-foreground font-semibold',
                  'shadow-lg shadow-primary/30',
                  'transition-all duration-300',
                  'group'
                )}
              >
                <LogIn className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                {t('Header.Sign in')}
              </Button>
            </Link>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-xs text-gray-500">{t('Header.or')}</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            {/* Sign Up Button */}
            <Link href="/sign-up" className="block">
              <Button
                variant="outline"
                className={cn(
                  'w-full h-12',
                  'border-gray-700 hover:border-gray-600',
                  'bg-transparent hover:bg-white/5',
                  'text-white',
                  'transition-all duration-300',
                  'group'
                )}
              >
                <UserPlus className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
                {t('Header.Create account')}
              </Button>
            </Link>
          </div>

          {/* Benefits */}
          <div className="px-4 pb-4">
            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <p className="text-xs font-semibold text-gray-300 mb-2">
                {t('Header.Why create an account')}?
              </p>
              <ul className="space-y-1.5">
                {[
                  t('Header.Track your orders'),
                  t('Header.Save your wishlist'),
                  t('Header.Faster checkout'),
                  t('Header.Exclusive offers'),
                ].map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-xs text-gray-400"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}