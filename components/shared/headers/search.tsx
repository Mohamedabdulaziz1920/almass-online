// components/shared/header/search.tsx
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getAllCategories } from '@/lib/actions/product.actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import { getSetting } from '@/lib/actions/setting.actions'
import { getTranslations } from 'next-intl/server'

export default async function Search() {
  const {
    site: { name },
  } = await getSetting()
  const categories = await getAllCategories()
  const t = await getTranslations()

  return (
    <form 
      action='/search' 
      method='GET' 
      className='relative flex items-stretch w-full group'
    >
      {/* 🔹 تأثير التوهج الخلفي */}
      <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 
                      rounded-xl blur opacity-0 group-hover:opacity-30 group-focus-within:opacity-50 
                      transition-all duration-500'></div>
      
      {/* 🔹 الحاوية الرئيسية */}
      <div className='relative flex items-stretch w-full h-11 md:h-12 bg-white rounded-xl 
                      shadow-lg shadow-black/5 overflow-hidden
                      ring-2 ring-transparent group-focus-within:ring-purple-500/50
                      transition-all duration-300'>
        
        {/* 🔹 اختيار التصنيف */}
        <Select name='category'>
          <SelectTrigger 
            className='w-[100px] md:w-[130px] h-full px-3
                       bg-gradient-to-b from-gray-50 to-gray-100
                       border-0 border-r border-gray-200
                       rounded-none rounded-r-xl rtl:rounded-r-none rtl:rounded-l-xl
                       text-gray-700 font-medium text-sm
                       hover:from-gray-100 hover:to-gray-150
                       focus:ring-0 focus:ring-offset-0
                       transition-all duration-200
                       [&>svg]:text-gray-500 [&>svg]:w-4 [&>svg]:h-4'
          >
            <SelectValue placeholder={t('Header.All')} />
          </SelectTrigger>
          <SelectContent 
            position='popper'
            className='bg-white/95 backdrop-blur-xl border-gray-200 shadow-xl shadow-black/10
                       rounded-xl overflow-hidden animate-in fade-in-0 zoom-in-95'
          >
            <SelectItem 
              value='all'
              className='cursor-pointer hover:bg-purple-50 focus:bg-purple-50 
                         focus:text-purple-700 rounded-lg mx-1 my-0.5'
            >
              {t('Header.All')}
            </SelectItem>
            {categories.map((category) => (
              <SelectItem 
                key={category} 
                value={category}
                className='cursor-pointer hover:bg-purple-50 focus:bg-purple-50 
                           focus:text-purple-700 rounded-lg mx-1 my-0.5'
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 🔹 حقل البحث */}
        <div className='relative flex-1 flex items-center'>
          <Input
            className='w-full h-full px-4
                       bg-transparent border-0
                       text-gray-800 text-base placeholder:text-gray-400
                       focus:ring-0 focus:outline-none focus-visible:ring-0
                       transition-all duration-200'
            placeholder={`${t('Header.Search Site', { name })}...`}
            name='q'
            type='search'
          />
          
          {/* 🔹 خط فاصل متحرك */}
          <div className='absolute bottom-0 left-0 right-0 h-0.5 
                          bg-gradient-to-r from-transparent via-purple-500 to-transparent
                          scale-x-0 group-focus-within:scale-x-100
                          transition-transform duration-500 origin-center'></div>
        </div>

        {/* 🔹 زر البحث */}
        <button
          type='submit'
          className='relative px-4 md:px-5 h-full
                     bg-gradient-to-r from-purple-600 to-pink-600
                     hover:from-purple-700 hover:to-pink-700
                     active:from-purple-800 active:to-pink-800
                     text-white font-medium
                     rounded-l-xl rtl:rounded-l-none rtl:rounded-r-xl
                     transition-all duration-300 ease-out
                     hover:shadow-lg hover:shadow-purple-500/30
                     hover:scale-[1.02] active:scale-[0.98]
                     overflow-hidden group/btn'
        >
          {/* 🔹 تأثير اللمعة */}
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                          translate-x-[-100%] group-hover/btn:translate-x-[100%]
                          transition-transform duration-700'></div>
          
          <SearchIcon className='relative w-5 h-5 md:w-6 md:h-6' />
        </button>
      </div>
    </form>
  )
}