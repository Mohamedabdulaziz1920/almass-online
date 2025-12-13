'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { SettingInputSchema } from '@/lib/validator'
import { ISettingInput } from '@/types'
import { updateSetting } from '@/lib/actions/setting.actions'
import useSetting from '@/hooks/use-setting-store'
import { Save, Loader2, ArrowRight, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import LanguagesFormFields from './languages-form-fields'

export default function LanguagesFormWrapper({ setting }: { setting: ISettingInput }) {
  const { setSetting } = useSetting()
  const { toast } = useToast()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const form = useForm<ISettingInput>({
    resolver: zodResolver(SettingInputSchema),
    defaultValues: setting,
  })

  const { formState: { isSubmitting, isDirty } } = form

  async function onSubmit(values: ISettingInput) {
    setSaveStatus('saving')
    try {
      const res = await updateSetting({ ...values })
      if (!res.success) {
        toast({ variant: 'destructive', title: '❌ خطأ', description: res.message })
        setSaveStatus('idle')
      } else {
        setSaveStatus('saved')
        toast({ title: '✅ تم الحفظ', description: 'تم حفظ إعدادات اللغات بنجاح' })
        setSetting(values as any)
        form.reset(values)
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      setSaveStatus('idle')
      toast({ variant: 'destructive', title: '❌ خطأ', description: 'حدث خطأ غير متوقع' })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="p-6">
            <LanguagesFormFields form={form} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 bg-gray-800/40 rounded-xl border border-white/10">
          <Link href="/admin/settings" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowRight className="h-4 w-4" />العودة للإعدادات
          </Link>

          <div className="flex items-center gap-3">
            {saveStatus === 'saved' && <span className="flex items-center gap-2 text-emerald-400 text-sm"><CheckCircle className="h-4 w-4" />تم الحفظ</span>}
            <Button type="submit" disabled={isSubmitting || !isDirty} className={`min-w-[140px] ${isDirty ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
              {isSubmitting ? <><Loader2 className="h-4 w-4 ml-2 animate-spin" />جاري الحفظ...</> : <><Save className="h-4 w-4 ml-2" />حفظ التغييرات</>}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}