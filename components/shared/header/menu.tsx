// components/shared/header/menu.tsx
import { EllipsisVertical, X, Sparkles } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
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

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  const t = useTranslations()
  
  return (
    <div className='flex justify-end'>
      {/* 🔹 قائمة Desktop */}
      <nav className='hidden md:flex items-center gap-2'>
        {/* 🔹 حاوية الأزرار مع تأثير زجاجي */}
        <div className='flex items-center gap-1 p-1.5 
                        bg-white/5 backdrop-blur-sm 
                        rounded-2xl border border-white/10
                        shadow-lg shadow-black/5'>
          
          <div className='flex items-center gap-1 px-1'>
            <LanguageSwitcher />
          </div>
          
          <div className='w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent'></div>
          
          <div className='flex items-center gap-1 px-1'>
            <ThemeSwitcher />
          </div>
          
          <div className='w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent'></div>
          
          <div className='flex items-center gap-1 px-1'>
            <UserButton />
          </div>
          
          {!forAdmin && (
            <>
              <div className='w-px h-6 bg-gradient-to-b from-transparent via-white/20 to-transparent'></div>
              <div className='flex items-center gap-1 px-1'>
                <CartButton />
              </div>
            </>
          )}
        </div>
      </nav>

      {/* 🔹 قائمة Mobile */}
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger 
            className='relative p-2.5 rounded-xl
                       bg-white/10 backdrop-blur-sm
                       border border-white/20
                       text-white
                       hover:bg-white/20 hover:border-white/30
                       active:scale-95
                       transition-all duration-300
                       group'
          >
            {/* 🔹 تأثير التوهج */}
            <div className='absolute inset-0 rounded-xl 
                            bg-gradient-to-r from-purple-500/20 to-pink-500/20
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-300'></div>
            <EllipsisVertical className='relative h-5 w-5' />
          </SheetTrigger>
          
          <SheetContent 
            className='w-[300px] sm:w-[350px] p-0 border-l-0
                       bg-gradient-to-b from-gray-900 via-gray-900 to-black
                       text-white overflow-hidden'
            side='right'
          >
            {/* 🔹 خلفية متحركة */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
              <div className='absolute -top-24 -right-24 w-48 h-48 
                              bg-purple-500/20 rounded-full blur-3xl'></div>
              <div className='absolute -bottom-24 -left-24 w-48 h-48 
                              bg-pink-500/20 rounded-full blur-3xl'></div>
            </div>
            
            {/* 🔹 المحتوى */}
            <div className='relative z-10 flex flex-col h-full'>
              {/* 🔹 الهيدر */}
              <SheetHeader className='p-6 border-b border-white/10'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500'>
                      <Sparkles className='w-5 h-5 text-white' />
                    </div>
                    <SheetTitle className='text-xl font-bold text-white'>
                      {t('Header.Site Menu')}
                    </SheetTitle>
                  </div>
                  <SheetClose 
                    className='p-2 rounded-lg 
                               hover:bg-white/10 
                               transition-colors duration-200'
                  >
                    <X className='w-5 h-5 text-gray-400' />
                  </SheetClose>
                </div>
                <SheetDescription className='sr-only'>
                  Navigation menu
                </SheetDescription>
              </SheetHeader>

              {/* 🔹 عناصر القائمة */}
              <div className='flex-1 p-4 space-y-2'>
                {/* 🔹 Language Switcher */}
                <div className='group p-3 rounded-xl
                                bg-white/5 hover:bg-white/10
                                border border-white/5 hover:border-white/10
                                transition-all duration-300
                                hover:translate-x-1'>
                  <LanguageSwitcher />
                </div>

                {/* 🔹 Theme Switcher */}
                <div className='group p-3 rounded-xl
                                bg-white/5 hover:bg-white/10
                                border border-white/5 hover:border-white/10
                                transition-all duration-300
                                hover:translate-x-1'>
                  <ThemeSwitcher />
                </div>

                {/* 🔹 User Button */}
                <div className='group p-3 rounded-xl
                                bg-white/5 hover:bg-white/10
                                border border-white/5 hover:border-white/10
                                transition-all duration-300
                                hover:translate-x-1'>
                  <UserButton />
                </div>

                {/* 🔹 Cart Button */}
                {!forAdmin && (
                  <div className='group p-3 rounded-xl
                                  bg-gradient-to-r from-purple-500/10 to-pink-500/10
                                  hover:from-purple-500/20 hover:to-pink-500/20
                                  border border-purple-500/20 hover:border-purple-500/30
                                  transition-all duration-300
                                  hover:translate-x-1'>
                    <CartButton />
                  </div>
                )}
              </div>

              {/* 🔹 الفوتر */}
              <div className='p-4 border-t border-white/10'>
                <div className='text-center text-xs text-gray-500'>
                  <p>© 2024 جميع الحقوق محفوظة</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu