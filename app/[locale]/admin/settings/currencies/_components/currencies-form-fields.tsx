'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ISettingInput } from '@/types'
import { TrashIcon, Plus, Wallet, Code, Hash, ArrowRightLeft, CheckCircle } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'

const currencyFlags: Record<string, string> = {
  'SAR': '🇸🇦', 'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'AED': '🇦🇪',
}

const getFlag = (code: string) => currencyFlags[code?.toUpperCase()] || '💰'

const suggestedCurrencies = [
  { name: 'ريال سعودي', code: 'SAR', symbol: 'ر.س', convertRate: 1 },
  { name: 'دولار أمريكي', code: 'USD', symbol: '$', convertRate: 0.27 },
  { name: 'يورو', code: 'EUR', symbol: '€', convertRate: 0.24 },
  { name: 'درهم إماراتي', code: 'AED', symbol: 'د.إ', convertRate: 0.98 },
]

export default function CurrenciesFormFields({ form }: { form: UseFormReturn<ISettingInput> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availableCurrencies',
  })

  const { watch, setValue, control, formState: { errors } } = form
  const availableCurrencies = watch('availableCurrencies')
  const defaultCurrency = watch('defaultCurrency')

  useEffect(() => {
    const validCodes = availableCurrencies.map((c) => c.code)
    if (!validCodes.includes(defaultCurrency)) setValue('defaultCurrency', '')
  }, [JSON.stringify(availableCurrencies)])

  return (
    <div className="space-y-6">
      {/* قائمة العملات */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const currencyCode = watch(`availableCurrencies.${index}.code`)
          const isDefault = currencyCode === defaultCurrency

          return (
            <div key={field.id} className={cn('p-4 rounded-xl border bg-white/5 border-white/10', isDefault && 'ring-2 ring-amber-500/30')}>
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-1 flex justify-center">
                  <span className="text-2xl">{getFlag(currencyCode)}</span>
                </div>

                <div className="col-span-3">
                  <FormField control={control} name={`availableCurrencies.${index}.name`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-xs">اسم العملة</FormLabel>
                      <FormControl><Input {...field} placeholder="ريال سعودي" className="bg-white/5 border-white/10 text-white" /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />
                </div>

                <div className="col-span-2">
                  <FormField control={control} name={`availableCurrencies.${index}.code`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-xs">الرمز</FormLabel>
                      <FormControl><Input {...field} placeholder="SAR" className="bg-white/5 border-white/10 text-white uppercase" maxLength={3} onChange={(e) => field.onChange(e.target.value.toUpperCase())} dir="ltr" /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />
                </div>

                <div className="col-span-2">
                  <FormField control={control} name={`availableCurrencies.${index}.symbol`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-xs">الرمز المختصر</FormLabel>
                      <FormControl><Input {...field} placeholder="ر.س" className="bg-white/5 border-white/10 text-white" /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />
                </div>

                <div className="col-span-2">
                  <FormField control={control} name={`availableCurrencies.${index}.convertRate`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-xs">سعر التحويل</FormLabel>
                      <FormControl><Input {...field} type="number" min="0" step="0.0001" placeholder="1.00" className="bg-white/5 border-white/10 text-white" onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)} /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2">
                  {isDefault && <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-xs"><CheckCircle className="h-3 w-3 ml-1" />افتراضي</Badge>}
                  <Button type="button" variant="ghost" size="icon" disabled={fields.length === 1} onClick={() => remove(index)} className={cn('h-8 w-8', fields.length === 1 ? 'text-gray-600' : 'text-gray-400 hover:text-red-400')}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Button type="button" variant="outline" onClick={() => append({ name: '', code: '', symbol: '', convertRate: 1 })} className="w-full border-dashed border-white/20 text-gray-400 hover:text-amber-400">
        <Plus className="h-4 w-4 ml-2" />إضافة عملة جديدة
      </Button>

      {/* العملة الافتراضية */}
      <div className="pt-6 border-t border-white/10">
        <FormField control={control} name="defaultCurrency" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">العملة الافتراضية</FormLabel>
            <FormControl>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="اختر العملة الافتراضية" /></SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {availableCurrencies.filter((x) => x.code).map((c, i) => (
                    <SelectItem key={i} value={c.code} className="text-white">
                      <div className="flex items-center gap-2">
                        <span>{getFlag(c.code)}</span>
                        <span>{c.name}</span>
                        <span className="text-amber-400 font-mono">{c.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )} />
      </div>

      {/* العملات المقترحة */}
      <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
        <h4 className="text-amber-400 font-medium text-sm mb-3">إضافة سريعة</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {suggestedCurrencies.map((c) => {
            const isAdded = availableCurrencies.some((x) => x.code === c.code)
            return (
              <button key={c.code} type="button" disabled={isAdded} onClick={() => !isAdded && append(c)}
                className={cn('flex flex-col items-start gap-1 p-3 rounded-lg text-xs', isAdded ? 'bg-amber-500/20 text-amber-400 cursor-not-allowed' : 'bg-white/5 text-gray-300 hover:bg-white/10 cursor-pointer')}>
                <div className="flex items-center gap-2 w-full">
                  <span className="text-lg">{getFlag(c.code)}</span>
                  <span className="font-medium">{c.name}</span>
                  {isAdded && <CheckCircle className="h-3 w-3 mr-auto" />}
                </div>
                <span className="text-gray-500">{c.code} • {c.symbol}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}