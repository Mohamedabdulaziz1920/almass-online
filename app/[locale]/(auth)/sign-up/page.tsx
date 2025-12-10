// app/[locale]/(auth)/sign-up/page.tsx
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/auth'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SignUpForm from './signup-form'
import { getSetting } from '@/lib/actions/setting.actions'
import { 
  UserPlus, 
  ShieldCheck, 
  Gift,
  Sparkles,
  ArrowRight,
  LogIn,
  Check
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default async function SignUpPage(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const searchParams = await props.searchParams
  const { callbackUrl } = searchParams
  const { site } = await getSetting()

  const session = await auth()
  if (session) {
    return redirect(callbackUrl || '/')
  }

  // 🔹 مميزات التسجيل
  const benefits = [
    { icon: Gift, text: 'خصم 10% على طلبك الأول' },
    { icon: Sparkles, text: 'عروض حصرية للأعضاء' },
    { icon: ShieldCheck, text: 'تتبع طلباتك بسهولة' },
  ]

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4 md:p-8
                    bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50
                    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
                    relative overflow-hidden'>
      
      {/* ═══════════════════════════════════════════════════════════════════════
          🔹 خلفية زخرفية
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {/* 🔹 الدوائر المتوهجة */}
        <div className='absolute -top-40 -left-40 w-80 h-80 
                        bg-emerald-500/20 rounded-full blur-3xl animate-pulse' />
        <div className='absolute -bottom-40 -right-40 w-80 h-80 
                        bg-primary/20 rounded-full blur-3xl animate-pulse'
             style={{ animationDelay: '1s' }} />
        <div className='absolute top-1/3 right-1/4 w-64 h-64 
                        bg-amber-500/15 rounded-full blur-3xl animate-pulse'
             style={{ animationDelay: '0.5s' }} />
        
        {/* 🔹 نمط النقاط */}
        <div className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05]'
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }} />
      </div>

      <div className='relative z-10 w-full max-w-md'>
        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 اللوجو والعنوان
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className='text-center mb-8'>
          <Link href='/' className='inline-flex items-center justify-center gap-3 mb-6 group'>
            <div className='relative'>
              <div className='absolute -inset-2 bg-gradient-to-r from-emerald-500 to-primary 
                              rounded-full blur-lg opacity-40 group-hover:opacity-60 
                              transition-opacity duration-300' />
              <div className='relative bg-white dark:bg-gray-900 rounded-full p-2 shadow-xl'>
                <Image
                  src={site.logo || '/icons/logo.svg'}
                  alt={`${site.name} logo`}
                  width={48}
                  height={48}
                  className='w-12 h-12'
                />
              </div>
            </div>
          </Link>
          
          <h1 className='text-2xl md:text-3xl font-bold text-foreground mb-2'>
            أنشئ حسابك الآن! 🎉
          </h1>
          <p className='text-muted-foreground'>
            انضم إلى آلاف العملاء السعداء
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 مميزات التسجيل
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className='mb-6 p-4 rounded-2xl
                        bg-gradient-to-r from-emerald-500/10 via-primary/10 to-amber-500/10
                        border border-emerald-500/20'>
          <div className='flex flex-wrap justify-center gap-4'>
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className='flex items-center gap-2 text-sm'
              >
                <div className='p-1 rounded-full bg-emerald-500/20'>
                  <Check className='w-3 h-3 text-emerald-600 dark:text-emerald-400' />
                </div>
                <span className='text-foreground font-medium'>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 بطاقة إنشاء الحساب
            ═══════════════════════════════════════════════════════════════════════ */}
        <Card className='relative overflow-hidden
                         bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
                         border border-gray-200/50 dark:border-gray-800/50
                         shadow-2xl shadow-black/5 dark:shadow-black/20
                         rounded-3xl'>
          
          {/* 🔹 شريط علوي ملون */}
          <div className='absolute top-0 left-0 right-0 h-1 
                          bg-gradient-to-r from-emerald-500 via-primary to-amber-500' />

          <CardHeader className='pb-4 pt-8 px-6 md:px-8'>
            <div className='flex items-center justify-center gap-3'>
              <div className='p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-primary/10
                              border border-emerald-500/20'>
                <UserPlus className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
              </div>
              <h2 className='text-xl font-bold text-foreground'>
                إنشاء حساب جديد
              </h2>
            </div>
          </CardHeader>

          <CardContent className='px-6 md:px-8 pb-8'>
            {/* 🔹 فورم إنشاء الحساب */}
            <SignUpForm />

            {/* 🔹 ملاحظة الأمان */}
            <div className='mt-6 flex items-center justify-center gap-2 
                            text-xs text-muted-foreground'>
              <ShieldCheck className='w-4 h-4 text-emerald-500' />
              <span>بياناتك آمنة ومحمية 100%</span>
            </div>
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 قسم تسجيل الدخول
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className='mt-8'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200 dark:border-gray-800' />
            </div>
            <div className='relative flex justify-center'>
              <span className='px-4 text-sm text-muted-foreground 
                               bg-gray-50 dark:bg-gray-950'>
                لديك حساب بالفعل؟
              </span>
            </div>
          </div>

          <div className='mt-6'>
            <Link 
              href={`/sign-in${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
              className='group block'
            >
              <Button 
                variant='outline' 
                className='w-full h-12 rounded-xl
                           bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm
                           border-2 border-dashed border-gray-300 dark:border-gray-700
                           hover:border-primary hover:bg-primary/5
                           text-foreground hover:text-primary
                           font-medium
                           transition-all duration-300
                           group-hover:shadow-lg group-hover:shadow-primary/10'
              >
                <LogIn className='w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300' />
                تسجيل الدخول
                <ArrowRight className='w-4 h-4 mr-auto opacity-0 -translate-x-2 
                                       group-hover:opacity-100 group-hover:translate-x-0
                                       transition-all duration-300
                                       rtl:rotate-180 rtl:ml-auto rtl:mr-0' />
              </Button>
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 روابط إضافية
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className='mt-8 text-center'>
          <p className='text-xs text-muted-foreground'>
            بإنشاء حساب، أنت توافق على{' '}
            <Link href='/page/conditions-of-use' className='text-primary hover:underline'>
              شروط الاستخدام
            </Link>
            {' '}و{' '}
            <Link href='/page/privacy-policy' className='text-primary hover:underline'>
              سياسة الخصوصية
            </Link>
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 إحصائيات سريعة
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className='mt-8 grid grid-cols-3 gap-4'>
          {[
            { number: '10K+', label: 'عميل سعيد' },
            { number: '500+', label: 'منتج متوفر' },
            { number: '4.9', label: 'تقييم العملاء' },
          ].map((stat, index) => (
            <div 
              key={index}
              className='flex flex-col items-center gap-1 p-3 rounded-xl
                         bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm
                         border border-gray-200/50 dark:border-gray-800/50'
            >
              <span className='text-lg font-bold text-primary'>{stat.number}</span>
              <span className='text-[10px] text-muted-foreground font-medium'>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}