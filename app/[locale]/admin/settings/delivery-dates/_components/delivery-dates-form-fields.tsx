'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ISettingInput } from '@/types'
import { TrashIcon, Plus, Truck, Clock, DollarSign, Gift, CheckCircle, Zap, Package } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'

const getDeliveryIcon = (days: number) => {
  if (days <= 1) return { icon: Zap, color: 'text-amber-400' }
  if (days <= 3) return { icon: Truck, color: 'text-blue-400' }
  return { icon: Package, color: 'text-purple-400' }
}

export default function DeliveryDatesFormFields({ form }: { form: UseFormReturn<ISettingInput> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availableDeliveryDates',
  })

  const { watch, setValue, control, formState: { errors } } = form
  const availableDeliveryDates = watch('availableDeliveryDates')
  const defaultDeliveryDate = watch('defaultDeliveryDate')

  useEffect(() => {
    const validNames = availableDeliveryDates.map((d) => d.name)
    if (!validNames.includes(defaultDeliveryDate)) setValue('defaultDeliveryDate', '')
  }, [JSON.stringify(availableDeliveryDates)])

  return (
    <div className="space-y-6">
      {/* قائمة مواعيد التوصيل */}
      <div className="space-y-4">
        {fields.map((field, index) => {
          const deliveryName = watch(`availableDeliveryDates.${index}.name`)
          const daysToDeliver = watch(`availableDeliveryDates.${index}.daysToDeliver`)
          const isDefault = deliveryName === defaultDeliveryDate
          const { icon: DeliveryIcon, color } = getDeliveryIcon(Number(daysToDeliver) || 0)

          return (
            <div key={field.id} className={cn('p-4 rounded-xl border bg-white/5 border-white/10', isDefault && 'ring-2 ring-orange-500/30')}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <DeliveryIcon className={cn('h-5 w-5', color)} />
                  <span className="text-white font-medium">{deliveryName || `خيار ${index + 1}`}</span>
                  {isDefault && <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs"><CheckCircle className="h-3 w-3 ml-1" />افتراضي</Badge>}
                </div>
                <Button type="button" variant="ghost" size="icon" disabled={fields.length === 1} onClick={() => remove(index)} className={cn('h-8 w-8', fields.length === 1 ? 'text-gray-600' : 'text-gray-400 hover:text-red-400')}>
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField control={control} name={`availableDeliveryDates.${index}.name`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-xs flex items-center gap-1"><Truck className="h-3 w-3" />الاسم</FormLabel>
                    <FormControl><Input {...field} placeholder="توصيل سريع" className="bg-white/5 border-white/10 text-white" /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={control} name={`availableDeliveryDates.${index}.daysToDeliver`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-xs flex items-center gap-1"><Clock className="h-3 w-3" />الأيام</FormLabel>
                    <FormControl><Input {...field} type="number" min="0" placeholder="1" className="bg-white/5 border-white/10 text-white" onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={control} name={`availableDeliveryDates.${index}.shippingPrice`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-xs flex items-center gap-1"><DollarSign className="h-3 w-3" />سعر الشحن</FormLabel>
                    <FormControl><Input {...field} type="number" min="0" step="0.01" placeholder="0.00" className="bg-white/5 border-white/10 text-white" onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />

                <FormField control={control} name={`availableDeliveryDates.${index}.freeShippingMinPrice`} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 text-xs flex items-center gap-1"><Gift className="h-3 w-3" />شحن مجاني فوق</FormLabel>
                    <FormControl><Input {...field} type="number" min="0" step="0.01" placeholder="0.00" className="bg-white/5 border-white/10 text-white" onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />
              </div>
            </div>
          )
        })}
      </div>

      <Button type="button" variant="outline" onClick={() => append({ name: '', daysToDeliver: 0, shippingPrice: 0, freeShippingMinPrice: 0 })} className="w-full border-dashed border-white/20 text-gray-400 hover:text-orange-400">
        <Plus className="h-4 w-4 ml-2" />إضافة خيار توصيل جديد
      </Button>

      {/* خيار التوصيل الافتراضي */}
      <div className="pt-6 border-t border-white/10">
        <FormField control={control} name="defaultDeliveryDate" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">خيار التوصيل الافتراضي</FormLabel>
            <FormControl>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="اختر خيار التوصيل الافتراضي" /></SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {availableDeliveryDates.filter((x) => x.name).map((d, i) => {
                    const { icon: Icon, color } = getDeliveryIcon(Number(d.daysToDeliver) || 0)
                    return (
                      <SelectItem key={i} value={d.name} className="text-white">
                        <div className="flex items-center gap-3">
                          <Icon className={cn('h-4 w-4', color)} />
                          <span>{d.name}</span>
                          <span className="text-gray-500 text-xs">({d.daysToDeliver} أيام - {d.shippingPrice} ر.س)</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )} />
      </div>
    </div>
  )
}