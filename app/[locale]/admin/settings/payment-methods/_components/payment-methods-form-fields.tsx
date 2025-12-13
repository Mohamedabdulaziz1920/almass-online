'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ISettingInput } from '@/types'
import { TrashIcon, Plus, CreditCard, Percent, CheckCircle, Wallet, Building2 } from 'lucide-react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'

const paymentIcons: Record<string, React.ElementType> = {
  'PayPal': Wallet,
  'Stripe': CreditCard,
  'CashOnDelivery': Building2,
  'Cash On Delivery': Building2,
}

const getPaymentIcon = (name: string) => paymentIcons[name] || CreditCard

export default function PaymentMethodsFormFields({ form }: { form: UseFormReturn<ISettingInput> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availablePaymentMethods',
  })

  const { watch, setValue, control, formState: { errors } } = form
  const availablePaymentMethods = watch('availablePaymentMethods')
  const defaultPaymentMethod = watch('defaultPaymentMethod')

  useEffect(() => {
    const validNames = availablePaymentMethods.map((m) => m.name)
    if (!validNames.includes(defaultPaymentMethod)) setValue('defaultPaymentMethod', '')
  }, [JSON.stringify(availablePaymentMethods)])

  return (
    <div className="space-y-6">
      {/* قائمة طرق الدفع */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const methodName = watch(`availablePaymentMethods.${index}.name`)
          const isDefault = methodName === defaultPaymentMethod
          const PaymentIcon = getPaymentIcon(methodName)

          return (
            <div key={field.id} className={cn('p-4 rounded-xl border bg-white/5 border-white/10', isDefault && 'ring-2 ring-cyan-500/30')}>
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1 flex justify-center">
                  <PaymentIcon className="h-6 w-6 text-cyan-400" />
                </div>

                <div className="col-span-5">
                  <FormField control={control} name={`availablePaymentMethods.${index}.name`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-xs">اسم طريقة الدفع</FormLabel>
                      <FormControl><Input {...field} placeholder="PayPal, Stripe" className="bg-white/5 border-white/10 text-white" /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />
                </div>

                <div className="col-span-4">
                  <FormField control={control} name={`availablePaymentMethods.${index}.commission`} render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-xs flex items-center gap-1"><Percent className="h-3 w-3" />العمولة</FormLabel>
                      <FormControl><Input {...field} type="number" min="0" step="0.01" placeholder="0.00" className="bg-white/5 border-white/10 text-white" onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2">
                  {isDefault && <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs"><CheckCircle className="h-3 w-3 ml-1" />افتراضي</Badge>}
                  <Button type="button" variant="ghost" size="icon" disabled={fields.length === 1} onClick={() => remove(index)} className={cn('h-8 w-8', fields.length === 1 ? 'text-gray-600' : 'text-gray-400 hover:text-red-400')}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Button type="button" variant="outline" onClick={() => append({ name: '', commission: 0 })} className="w-full border-dashed border-white/20 text-gray-400 hover:text-cyan-400">
        <Plus className="h-4 w-4 ml-2" />إضافة طريقة دفع جديدة
      </Button>

      {/* طريقة الدفع الافتراضية */}
      <div className="pt-6 border-t border-white/10">
        <FormField control={control} name="defaultPaymentMethod" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-300">طريقة الدفع الافتراضية</FormLabel>
            <FormControl>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white"><SelectValue placeholder="اختر طريقة الدفع الافتراضية" /></SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {availablePaymentMethods.filter((x) => x.name).map((m, i) => {
                    const Icon = getPaymentIcon(m.name)
                    return (
                      <SelectItem key={i} value={m.name} className="text-white">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-cyan-400" />
                          <span>{m.name}</span>
                          {m.commission > 0 && <span className="text-gray-500 text-xs">({m.commission}%)</span>}
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