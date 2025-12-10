// components/shared/header/search.tsx
import { Search as SearchIcon, Mic, Camera } from 'lucide-react'
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
      action="/search"
      method="GET"
      className="relative flex items-stretch w-full group"
    >
      {/* Glow Effect on Focus */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-amber-400 to-primary rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-all duration-300" />

      {/* Search Container */}
      <div className="relative flex items-stretch w-full bg-white rounded-lg overflow-hidden">
        {/* Category Select */}
        <Select name="category">
          <SelectTrigger
            className="
              w-[90px] sm:w-[120px] h-11 
              bg-gradient-to-b from-gray-100 to-gray-200 
              hover:from-gray-200 hover:to-gray-300
              border-0 border-r border-gray-300
              rounded-none rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg
              text-gray-700 text-sm font-medium
              focus:ring-0 focus:ring-offset-0
              transition-all duration-200
            "
          >
            <SelectValue placeholder={t('Header.All')} />
          </SelectTrigger>
          <SelectContent 
            position="popper" 
            className="max-h-[300px] bg-white/95 backdrop-blur-lg border-gray-200"
          >
            <SelectItem 
              value="all" 
              className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
            >
              {t('Header.All')}
            </SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category}
                value={category}
                className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10"
              >
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Input */}
        <div className="relative flex-1">
          <Input
            className="
              h-11 w-full
              border-0 rounded-none
              bg-white text-gray-900 
              text-base placeholder:text-gray-400
              focus-visible:ring-0 focus-visible:ring-offset-0
              pr-20
            "
            placeholder={t('Header.Search Site', { name })}
            name="q"
            type="search"
            autoComplete="off"
          />

          {/* Voice & Camera Icons (Optional) */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title={t('Header.Voice search')}
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title={t('Header.Image search')}
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="
            px-4 sm:px-6
            bg-gradient-to-b from-amber-400 to-amber-500
            hover:from-amber-500 hover:to-amber-600
            active:from-amber-600 active:to-amber-700
            text-gray-900
            rounded-none rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg
            transition-all duration-200
            flex items-center justify-center
            group/btn
          "
        >
          <SearchIcon className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
        </button>
      </div>
    </form>
  )
}