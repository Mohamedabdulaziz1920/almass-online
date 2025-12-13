'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { SettingInputSchema } from '@/lib/validator'
import { ClientSetting, ISettingInput } from '@/types'
import { updateSetting } from '@/lib/actions/setting.actions'
import useSetting from '@/hooks/use-setting-store'
import LanguageForm from './language-form'
import CurrencyForm from './currency-form'
import PaymentMethodForm from './payment-method-form'
import DeliveryDateForm from './delivery-date-form'
import SiteInfoForm from './site-info-form'
import CommonForm from './common-form'
import CarouselForm from './carousel-form'
import { 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════════════════
const SettingForm = ({ setting }: { setting: ISettingInput }) => {
  const { setSetting } = useSetting()
  const { toast } = useToast()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showStickyBar, setShowStickyBar] = useState(false)

  const form = useForm<ISettingInput>({
    resolver: zodResolver(SettingInputSchema),
    defaultValues: setting,
  })

  const {
    formState: { isSubmitting, isDirty, dirtyFields },
    reset,
  } = form

  // ═══════════════════════════════════════════════════════════════════════════
  // 👀 مراقبة التمرير لإظهار شريط الحفظ
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ═══════════════════════════════════════════════════════════════════════════
  // 📝 معالجة الإرسال
  // ═══════════════════════════════════════════════════════════════════════════
  async function onSubmit(values: ISettingInput) {
    setSaveStatus('saving')
    
    try {
      const res = await updateSetting({ ...values })
      
      if (!res.success) {
        setSaveStatus('error')
        toast({
          variant: 'destructive',
          title: '❌ خطأ في الحفظ',
          description: res.message,
        })
      } else {
        setSaveStatus('saved')
        toast({
          title: '✅ تم الحفظ بنجاح',
          description: 'تم تحديث إعدادات المتجر',
        })
        setSetting(values as ClientSetting)
        reset(values) // إعادة تعيين النموذج بالقيم الجديدة
        
        // إعادة الحالة بعد 3 ثوان
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      setSaveStatus('error')
      toast({
        variant: 'destructive',
        title: '❌ خطأ غير متوقع',
        description: 'حدث خطأ أثناء حفظ الإعدادات',
      })
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 🔄 إعادة تعيين النموذج
  // ═══════════════════════════════════════════════════════════════════════════
  const handleReset = () => {
    reset(setting)
    toast({
      title: '🔄 تم الإلغاء',
      description: 'تم إعادة الإعدادات للقيم الأصلية',
    })
  }

  // حساب عدد الحقول المعدلة
  const changedFieldsCount = Object.keys(dirtyFields).length

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 🔔 شريط التنبيه للتغييرات غير المحفوظة */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {isDirty && (
          <div className="sticky top-20 z-40 animate-in slide-in-from-top duration-300">
            <div className="p-4 bg-amber-500/10 backdrop-blur-xl rounded-xl border border-amber-500/30 shadow-lg">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-amber-300 font-medium">
                      لديك تغييرات غير محفوظة
                    </p>
                    <p className="text-amber-400/70 text-sm">
                      {changedFieldsCount} {changedFieldsCount === 1 ? 'حقل تم تعديله' : 'حقول تم تعديلها'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  >
                    <RotateCcw className="h-4 w-4 ml-1" />
                    إلغاء التغييرات
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 ml-1" />
                        حفظ الآن
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📋 نماذج الإعدادات */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-8">
          <SiteInfoForm id="setting-site-info" form={form} />
          <CommonForm id="setting-common" form={form} />
          <CarouselForm id="setting-carousels" form={form} />
          <LanguageForm id="setting-languages" form={form} />
          <CurrencyForm id="setting-currencies" form={form} />
          <PaymentMethodForm id="setting-payment-methods" form={form} />
          <DeliveryDateForm id="setting-delivery-dates" form={form} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 💾 زر الحفظ الرئيسي */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="pt-8 pb-24">
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* معلومات الحالة */}
              <div className="flex items-center gap-3">
                {saveStatus === 'saved' && (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm">تم الحفظ بنجاح</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm">حدث خطأ في الحفظ</span>
                  </div>
                )}
                {saveStatus === 'idle' && !isDirty && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-sm">جميع الإعدادات محفوظة</span>
                  </div>
                )}
                {saveStatus === 'idle' && isDirty && (
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm">
                      {changedFieldsCount} تغييرات تنتظر الحفظ
                    </span>
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex items-center gap-3">
                {isDirty && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="border-white/10 text-gray-300 hover:bg-white/5"
                  >
                    <RotateCcw className="h-4 w-4 ml-2" />
                    إلغاء التغييرات
                  </Button>
                )}
                
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !isDirty}
                  className={cn(
                    'min-w-[180px] transition-all duration-300',
                    isDirty 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <CheckCircle className="h-5 w-5 ml-2" />
                      تم الحفظ
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 ml-2" />
                      حفظ الإعدادات
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📌 شريط الحفظ الثابت (يظهر عند التمرير) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {showStickyBar && isDirty && (
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-gray-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Save className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-white font-medium text-sm">
                        تغييرات غير محفوظة
                      </p>
                      <p className="text-gray-400 text-xs">
                        {changedFieldsCount} حقل تم تعديله
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="text-gray-400 hover:text-white"
                    >
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                          حفظ...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 ml-1" />
                          حفظ التغييرات
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}

export default SettingForm