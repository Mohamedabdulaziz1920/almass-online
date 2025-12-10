'use client'

import { useState } from 'react'
import { Search, Command, X } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface SearchCommandProps {
  categories: Array<{ _id: string; name: string; slug: string; icon?: string }>
  siteName: string
}

export default function SearchCommand({ categories, siteName }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const t = useTranslations()
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
      >
        <Search className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
        <kbd className="hidden sm:flex absolute -bottom-2 -right-2 bg-black/70 backdrop-blur text-xs px-2 py-1 rounded border border-white/20 text-white/70">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b border-white/10 px-4">
          <Command className="h-6 w-6 text-white/50" />
          <CommandInput 
            placeholder={t('Header.Search Site', { name: siteName })} 
            className="placeholder:text-white/40"
          />
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white/50" />
          </button>
        </div>

        <CommandList className="max-h-[60vh]">
          <CommandEmpty className="text-center py-12 text-white/50">
            {t('Header.No results found')}
          </CommandEmpty>

          <CommandGroup heading={t('Header.Categories')}>
            {categories.slice(0, 8).map((cat) => (
              <CommandItem
                key={cat._id}
                onSelect={() => {
                  router.push(`/category/${cat.slug}`)
                  setOpen(false)
                }}
                className="cursor-pointer"
              >
                <span className="mr-3">{cat.icon || '🛍️'}</span>
                {cat.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={t('Header.Quick Links')}>
            <CommandItem onSelect={() => { router.push('/offers'); setOpen(false) }}>
              🔥 {t('Header.Hot Offers')}
            </CommandItem>
            <CommandItem onSelect={() => { router.push('/new'); setOpen(false) }}>
              ✨ {t('Header.New Arrivals')}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}