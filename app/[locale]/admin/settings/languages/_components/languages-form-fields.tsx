'use client'

import { Button } from '@/components/ui/button'
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
import { ISettingInput } from '@/types'
import { TrashIcon, Plus, Globe, Code, CheckCircle } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'

const languageFlags: Record<string, string> = {
  'ar': '🇸🇦', 'en': '🇺🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'es': '🇪🇸', 'tr': '🇹🇷',
}

const getFlag = (code: string) => languageFlags[code?.toLowerCase()] || '🌐'

const suggestedLanguages = [
  { name: 'العربية', code: 'ar' },
  { name: 'English', code: 'en' },
  { name: 'Français', code: 'fr' },
  { name: 'Türkçe', code: 'tr' },
]

export default function LanguagesFormFields({ form }: { form: UseFormReturn<ISettingInput> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availableLanguages',
  })

  const { watch, setValue, control, formState: { errors } } = form
  const availableLanguages = watch('availableLanguages')
  const defaultLanguage = watch('defaultLanguage')

  useEffect(() => {
    const validCodes = availableLanguages.map((l) => l.code)
    if (!validCodes.includes(defaultLanguage)) setValue('defaultLanguage', '')
  }, [JSON.stringify(availableLanguages)])

  return (
    <div className="space-y-6">
      {/* قائمة اللغات */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const langCode = watch(`availableLanguages.${index}.code`)
          const isDefault = langCode === defaultLanguage

          return (
            <div key={field.id} className={cn('p-4 rounded-xl border bg-white/5 border-white/10', isDefault && 'ring-2 ring-emerald-500/30')}>
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 flex justify-center">
                  <span className="text-2xl">{getFlag(langCode)}</span>
                </div>

                <div className="col-span-5">
                  <FormField
                    control={control}
                    name={`availableLanguages.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-xs">اسم اللغة</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="العربية" className="bg-white/5 border-white/10 text-white" />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-4">
                  <FormField
                    control={control}
                    name={`availableLanguages.${index}.code`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-xs">الرمز (ISO)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="ar" className="bg-white/5 border-white/10 text-white uppercase" maxLength={5} onChange={(e) => field.onChange(e.target.value.toLowerCase())} dir="ltr" />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2">
                  {isDefault && <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs"><CheckCircle className="h-3 w-3 ml-1" />افتراضي</Badge>}
                  <Button type="button" variant="ghost" size="icon" disabled={fields.length === 1} onClick={() => remove(index)} className={cn('h-8 w-8', fields.length === 1 ? 'text-gray-600' : 'text-gray-400 hover:text-red-400')}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* زر الإضافة */}
      <Button type="button" variant="outline" onClick={() => append({ name: '', code: '' })} className="w-full border-dashed border-white/20 text-gray-400 hover:text-emerald-400">
        <Plus className="h-4 w-4 ml-2" />إضافة لغة جديدة
      </Button>

      {/* اللغة الافتراضية */}
      <div className="pt-6 border-t border-white/10">
        <FormField
          control={control}
          name="defaultLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">اللغة الافتراضية</FormLabel>
              <FormControl>
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="اختر اللغة الافتراضية" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10">
                    {availableLanguages.filter((x) => x.code).map((lang, i) => (
                      <SelectItem key={i} value={lang.code} className="text-white">
                        <div className="flex items-center gap-2">
                          <span>{getFlag(lang.code)}</span>
                          <span>{lang.name}</span>
                          <span className="text-gray-500">({lang.code})</span>
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
      </div>

      {/* اللغات المقترحة */}
      <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
        <h4 className="text-emerald-400 font-medium text-sm mb-3">إضافة سريعة</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {suggestedLanguages.map((lang) => {
            const isAdded = availableLanguages.some((l) => l.code === lang.code)
            return (
              <button key={lang.code} type="button" disabled={isAdded} onClick={() => !isAdded && append(lang)}
                className={cn('flex items-center gap-2 p-2 rounded-lg text-xs', isAdded ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed' : 'bg-white/5 text-gray-300 hover:bg-white/10 cursor-pointer')}>
                <span>{getFlag(lang.code)}</span>
                <span>{lang.name}</span>
                {isAdded && <CheckCircle className="h-3 w-3 mr-auto" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}