'use client'

import {
  ChevronDown,
  Moon,
  Sun,
  Monitor,
  Palette,
  Check,
  Sparkles,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import useColorStore from '@/hooks/use-color-store'
import useIsMounted from '@/hooks/use-is-mounted'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

// Theme configurations
const themes = [
  {
    value: 'light',
    label: 'Light',
    icon: Sun,
    description: 'Light mode for day time',
    gradient: 'from-amber-400 to-orange-500',
    bgPreview: 'bg-white',
    textPreview: 'text-gray-900',
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: Moon,
    description: 'Dark mode for night time',
    gradient: 'from-indigo-500 to-purple-600',
    bgPreview: 'bg-gray-900',
    textPreview: 'text-white',
  },
  {
    value: 'system',
    label: 'System',
    icon: Monitor,
    description: 'Follow system preferences',
    gradient: 'from-gray-400 to-gray-600',
    bgPreview: 'bg-gradient-to-r from-white to-gray-900',
    textPreview: 'text-gray-600',
  },
]

export default function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { availableColors, color, setColor } = useColorStore(theme)
  const t = useTranslations('Header')
  const isMounted = useIsMounted()
  const [isOpen, setIsOpen] = React.useState(false)

  const currentTheme = themes.find((t) => t.value === theme) || themes[0]
  const CurrentIcon = currentTheme.icon

  if (!isMounted) {
    return (
      <div className="w-[100px] h-[41px] rounded-xl bg-gray-800/50 animate-pulse" />
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
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
          {/* Icon Container */}
          <div
            className={cn(
              'relative w-8 h-8 rounded-lg',
              'bg-gradient-to-br',
              currentTheme.gradient,
              'flex items-center justify-center',
              'transition-all duration-300',
              'group-hover:scale-110 group-hover:shadow-lg',
              resolvedTheme === 'dark'
                ? 'shadow-indigo-500/30'
                : 'shadow-amber-500/30'
            )}
          >
            <CurrentIcon className="h-4 w-4 text-white" />

            {/* Animated Ring */}
            <div
              className={cn(
                'absolute inset-0 rounded-lg',
                'bg-gradient-to-br',
                currentTheme.gradient,
                'opacity-0 group-hover:opacity-50',
                'blur-md transition-opacity duration-300',
                '-z-10'
              )}
            />
          </div>

          {/* Label - Hidden on mobile */}
          <span className="hidden sm:block text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
            {t(currentTheme.label)}
          </span>

          {/* Chevron */}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-gray-400',
              'transition-all duration-300',
              'group-hover:text-white',
              isOpen && 'rotate-180'
            )}
          />

          {/* Hover Ring */}
          <div
            className={cn(
              'absolute inset-0 rounded-xl',
              'border border-transparent',
              'group-hover:border-white/20',
              'transition-all duration-300 pointer-events-none'
            )}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          'w-80 p-0',
          'bg-gray-900/95 backdrop-blur-xl',
          'border border-gray-700',
          'shadow-2xl shadow-black/50',
          'animate-in fade-in-0 zoom-in-95'
        )}
        align="end"
        sideOffset={8}
      >
        {/* ═══════════════════ Theme Section ═══════════════════ */}
        <div className="p-4">
          <DropdownMenuLabel className="flex items-center gap-2 px-0 text-white mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-amber-500/20 flex items-center justify-center">
              <Sun className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t('Theme')}</p>
              <p className="text-xs font-normal text-gray-400">
                {t('Choose your preferred theme')}
              </p>
            </div>
          </DropdownMenuLabel>

          {/* Theme Cards */}
          <div className="grid grid-cols-3 gap-2">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              const isSelected = theme === themeOption.value

              return (
                <button
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={cn(
                    'relative flex flex-col items-center gap-2 p-3 rounded-xl',
                    'border-2 transition-all duration-300',
                    'hover:scale-105',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                  )}
                >
                  {/* Preview */}
                  <div
                    className={cn(
                      'w-full h-10 rounded-lg mb-1 overflow-hidden',
                      'border border-gray-600',
                      themeOption.bgPreview
                    )}
                  >
                    {/* Mini preview UI */}
                    <div className="p-1.5">
                      <div
                        className={cn(
                          'h-1.5 w-8 rounded-full mb-1',
                          themeOption.value === 'light'
                            ? 'bg-gray-300'
                            : themeOption.value === 'dark'
                              ? 'bg-gray-600'
                              : 'bg-gradient-to-r from-gray-300 to-gray-600'
                        )}
                      />
                      <div
                        className={cn(
                          'h-1 w-5 rounded-full',
                          themeOption.value === 'light'
                            ? 'bg-gray-200'
                            : themeOption.value === 'dark'
                              ? 'bg-gray-700'
                              : 'bg-gradient-to-r from-gray-200 to-gray-700'
                        )}
                      />
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full',
                      'bg-gradient-to-br',
                      themeOption.gradient,
                      'flex items-center justify-center',
                      'shadow-lg',
                      isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-gray-900'
                    )}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isSelected ? 'text-primary' : 'text-gray-400'
                    )}
                  >
                    {t(themeOption.label)}
                  </span>

                  {/* Selected Check */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-gray-800" />

        {/* ═══════════════════ Color Section ═══════════════════ */}
        <div className="p-4">
          <DropdownMenuLabel className="flex items-center gap-2 px-0 text-white mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
              <Palette className="h-4 w-4 text-pink-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t('Accent Color')}</p>
              <p className="text-xs font-normal text-gray-400">
                {t('Personalize your experience')}
              </p>
            </div>
          </DropdownMenuLabel>

          {/* Color Grid */}
          <div className="grid grid-cols-5 gap-2">
            {availableColors.map((c) => {
              const isSelected = color.name === c.name

              // Map color names to actual colors
              const colorMap: Record<string, string> = {
                Gold: '#F59E0B',
                Green: '#10B981',
                Blue: '#3B82F6',
                Red: '#EF4444',
                Pink: '#EC4899',
                Purple: '#8B5CF6',
                Orange: '#F97316',
                Teal: '#14B8A6',
                Indigo: '#6366F1',
                Rose: '#F43F5E',
              }

              const bgColor = colorMap[c.name] || c.name

              return (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name, true)}
                  className={cn(
                    'relative group flex flex-col items-center gap-1.5 p-2 rounded-xl',
                    'transition-all duration-300',
                    'hover:bg-gray-800',
                    isSelected && 'bg-gray-800'
                  )}
                  title={t(c.name)}
                >
                  {/* Color Circle */}
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full',
                      'transition-all duration-300',
                      'group-hover:scale-110 group-hover:shadow-lg',
                      isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110'
                    )}
                    style={{
                      backgroundColor: bgColor,
                      boxShadow: isSelected ? `0 0 20px ${bgColor}50` : 'none',
                    }}
                  >
                    {/* Selected Check */}
                    {isSelected && (
                      <div className="w-full h-full rounded-full flex items-center justify-center bg-black/20">
                        <Check className="h-4 w-4 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </div>

                  {/* Color Name */}
                  <span
                    className={cn(
                      'text-[10px] font-medium truncate w-full text-center',
                      isSelected ? 'text-white' : 'text-gray-500'
                    )}
                  >
                    {t(c.name)}
                  </span>

                  {/* Glow Effect */}
                  <div
                    className={cn(
                      'absolute inset-0 rounded-xl opacity-0',
                      'group-hover:opacity-100 transition-opacity duration-300',
                      '-z-10 blur-xl'
                    )}
                    style={{ backgroundColor: `${bgColor}30` }}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* ═══════════════════ Footer ═══════════════════ */}
        <div className="p-3 bg-gray-800/50 border-t border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>{t('Current')}: </span>
              <span
                className="font-medium"
                style={{ color: color.name }}
              >
                {t(color.name)}
              </span>
            </div>
            <span>
              {resolvedTheme === 'dark' ? '🌙' : '☀️'} {t(currentTheme.label)}
            </span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}