'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { COLORS, THEMES } from '@/lib/constants'
import { ISettingInput } from '@/types'
import { 
  Layers, 
  Gift, 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  Construction,
  AlertTriangle
} from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'

const themeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  'light': { icon: Sun, color: 'text-amber-400' },
  'dark': { icon: Moon, color: 'text-blue-400' },
  'system': { icon: Monitor, color: 'text-purple-400' },
}

const colorStyles: Record<string, string> = {
  'Gold': 'bg-amber-500',
  'Green': 'bg-emerald-500',
  'Blue': 'bg-blue-500',
  'Red': 'bg-red-500',
  'Purple': 'bg-purple-500',
  'Pink': 'bg-pink-500',
  'Orange': 'bg-orange-500',
  'Cyan': 'bg-cyan-500',
}

export default function CommonFormFields({ form }: { form: UseFormReturn<ISettingInput> }) {
  const { control, watch } = form
  const isMaintenanceMode = watch('common.isMaintenanceMode')
  const selectedColor = watch('common.defaultColor')

  return (
    <div className="space-y-6">
      {/* إعدادات العرض */}
      <div className="space-y-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Layers className="h-4 w-4 text-purple-400" />
          إعدادات العرض
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={control}
            name="common.pageSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">عدد العناصر في الصفحة</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="1"
                    max="100"
                    placeholder="10"
                    className="bg-white/5 border-white/10 text-white"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="common.freeShippingMinPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 flex items-center gap-2">
                  <Gift className="h-4 w-4 text-emerald-400" />
                  الحد الأدنى للشحن المجاني
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* إعدادات المظهر */}
      <div className="pt-6 border-t border-white/10 space-y-4">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Palette className="h-4 w-4 text-pink-400" />
          إعدادات المظهر
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={control}
            name="common.defaultColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">اللون الأساسي</FormLabel>
                <FormControl>
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="اختر اللون" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10">
                      {COLORS.map((color) => (
                        <SelectItem key={color} value={color} className="text-white">
                          <div className="flex items-center gap-3">
                            <div className={cn('w-4 h-4 rounded-full', colorStyles[color] || 'bg-gray-500')} />
                            <span>{color}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="common.defaultTheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">الوضع الافتراضي</FormLabel>
                <FormControl>
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="اختر الوضع" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/10">
                      {THEMES.map((theme) => {
                        const config = themeConfig[theme.toLowerCase()] || themeConfig['system']
                        const Icon = config.icon
                        return (
                          <SelectItem key={theme} value={theme} className="text-white">
                            <div className="flex items-center gap-3">
                              <Icon className={cn('h-4 w-4', config.color)} />
                              <span>{theme === 'light' ? 'فاتح' : theme === 'dark' ? 'داكن' : 'تلقائي'}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        {/* معاينة اللون */}
        {selectedColor && (
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm text-gray-400 mb-3">معاينة اللون:</p>
            <div className="flex items-center gap-4">
              <div className={cn('w-12 h-12 rounded-xl shadow-lg', colorStyles[selectedColor] || 'bg-gray-500')} />
              <p className="text-white font-medium">{selectedColor}</p>
            </div>
          </div>
        )}
      </div>

      {/* وضع الصيانة */}
      <div className="pt-6 border-t border-white/10">
        <FormField
          control={control}
          name="common.isMaintenanceMode"
          render={({ field }) => (
            <FormItem>
              <div className={cn(
                'p-4 rounded-xl border transition-all',
                field.value ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Construction className={cn('h-5 w-5', field.value ? 'text-amber-400' : 'text-gray-400')} />
                    <div>
                      <FormLabel className="text-white font-medium">وضع الصيانة</FormLabel>
                      <p className="text-gray-400 text-sm">{field.value ? 'الموقع مغلق للزوار' : 'الموقع متاح للجميع'}</p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-amber-500" />
                  </FormControl>
                </div>

                {field.value && (
                  <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5" />
                      <p className="text-amber-300 text-sm">تحذير: لن يتمكن الزوار من الوصول للموقع</p>
                    </div>
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}