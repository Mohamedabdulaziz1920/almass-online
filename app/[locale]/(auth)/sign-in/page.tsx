// app/[locale]/(auth)/sign-in/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { auth } from '@/auth'
import SeparatorWithOr from '@/components/shared/separator-or'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import CredentialsSignInForm from './credentials-signin-form'
import { GoogleSignInForm } from './google-signin-form'
import { Button } from '@/components/ui/button'
import { getSetting } from '@/lib/actions/setting.actions'
import { 
  ShieldCheck, 
  ArrowRight,
  Lock,
  UserPlus
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default async function SignInPage(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const searchParams = await props.searchParams
  const { site } = await getSetting()
  const { callbackUrl = '/' } = searchParams

  const session = await auth()
  if (session) {
    return redirect(callbackUrl)
  }

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
        <div className='absolute -top-40 -right-40 w-80 h-80 
                        bg-primary/20 rounded-full blur-3xl animate-pulse' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 
                        bg-amber-500/20 rounded-full blur-3xl animate-pulse'
             style={{ animationDelay: '1s' }} />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 
                        bg-purple-500/10 rounded-full blur-3xl animate-pulse'
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
              <div className='absolute -inset-2 bg-gradient-to-r from-primary to-amber-500 
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
            مرحباً بعودتك! 👋
          </h1>
          <p className='text-muted-foreground'>
            سجل دخولك للمتابعة إلى حسابك
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 بطاقة تسجيل الدخول
            ═══════════════════════════════════════════════════════════════════════ */}
        <Card className='relative overflow-hidden
                         bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
                         border border-gray-200/50 dark:border-gray-800/50
                         shadow-2xl shadow-black/5 dark:shadow-black/20
                         rounded-3xl'>
          
          {/* 🔹 شريط علوي ملون */}
          <div className='absolute top-0 left-0 right-0 h-1 
                          bg-gradient-to-r from-primary via-amber-500 to-primary' />

          <CardHeader className='pb-4 pt-8 px-6 md:px-8'>
            <div className='flex items-center justify-center gap-3'>
              <div className='p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-amber-500/10
                              border border-primary/20'>
                <Lock className='w-5 h-5 text-primary' />
              </div>
              <h2 className='text-xl font-bold text-foreground'>
                تسجيل الدخول
              </h2>
            </div>
          </CardHeader>

          <CardContent className='px-6 md:px-8 pb-8'>
            {/* 🔹 فورم تسجيل الدخول */}
            <div className='space-y-6'>
              <CredentialsSignInForm />
              
              <SeparatorWithOr />
              
              {/* 🔹 تسجيل الدخول بجوجل */}
              <div>
                <GoogleSignInForm />
              </div>
            </div>

            {/* 🔹 ملاحظة الأمان */}
            <div className='mt-6 flex items-center justify-center gap-2 
                            text-xs text-muted-foreground'>
              <ShieldCheck className='w-4 h-4 text-emerald-500' />
              <span>اتصال آمن ومشفر</span>
            </div>
          </CardContent>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 قسم إنشاء حساب جديد
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className='mt-8'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200 dark:border-gray-800' />
            </div>
            <div className='relative flex justify-center'>
              <span className='px-4 text-sm text-muted-foreground 
                               bg-gray-50 dark:bg-gray-950'>
                جديد في {site.name}؟
              </span>
            </div>
          </div>

          <div className='mt-6'>
            <Link 
              href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
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
                <UserPlus className='w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300' />
                إنشاء حساب جديد في {site.name}
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
            بتسجيل الدخول، أنت توافق على{' '}
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
            🔹 ميزات الموقع
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className='mt-8 grid grid-cols-3 gap-4'>
          {[
            { icon: '🚚', text: 'شحن سريع' },
            { icon: '🔒', text: 'دفع آمن' },
            { icon: '💯', text: 'ضمان الجودة' },
          ].map((feature, index) => (
            <div 
              key={index}
              className='flex flex-col items-center gap-1 p-3 rounded-xl
                         bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm
                         border border-gray-200/50 dark:border-gray-800/50'
            >
              <span className='text-xl'>{feature.icon}</span>
              <span className='text-[10px] text-muted-foreground font-medium'>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}