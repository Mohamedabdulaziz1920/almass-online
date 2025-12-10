// app/[locale]/(auth)/sign-in/credentials-signin-form.tsx
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { signInWithCredentials } from '@/lib/actions/user.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function CredentialsSignInForm() {
  const [data, action] = useActionState(signInWithCredentials, { success: false, message: '' })
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [showPassword, setShowPassword] = useState(false)

  const SignInButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button 
        disabled={pending} 
        className='w-full h-12 rounded-xl
                   bg-gradient-to-r from-primary to-amber-500
                   hover:from-primary/90 hover:to-amber-500/90
                   text-primary-foreground font-semibold text-base
                   shadow-lg shadow-primary/25
                   hover:shadow-xl hover:shadow-primary/30
                   disabled:opacity-70 disabled:cursor-not-allowed
                   transition-all duration-300
                   hover:scale-[1.02] active:scale-[0.98]
                   group relative overflow-hidden'
      >
        {/* 🔹 تأثير اللمعة */}
        <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                        translate-x-[-100%] group-hover:translate-x-[100%]
                        transition-transform duration-700' />
        
        {pending ? (
          <Loader2 className='w-5 h-5 animate-spin' />
        ) : (
          <span className='relative'>تسجيل الدخول</span>
        )}
      </Button>
    )
  }

  return (
    <form action={action} className='space-y-5'>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      
      {/* 🔹 رسالة الخطأ */}
      {data && !data.success && data.message && (
        <div className='flex items-center gap-3 p-4 rounded-xl
                        bg-red-50 dark:bg-red-950/30
                        border border-red-200 dark:border-red-900/50
                        text-red-600 dark:text-red-400'>
          <AlertCircle className='w-5 h-5 flex-shrink-0' />
          <p className='text-sm font-medium'>{data.message}</p>
        </div>
      )}

      {/* 🔹 حقل البريد الإلكتروني */}
      <div className='space-y-2'>
        <Label htmlFor='email' className='text-sm font-medium text-foreground'>
          البريد الإلكتروني
        </Label>
        <div className='relative'>
          <div className='absolute right-3 top-1/2 -translate-y-1/2 
                          text-muted-foreground pointer-events-none'>
            <Mail className='w-5 h-5' />
          </div>
          <Input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
            placeholder='أدخل بريدك الإلكتروني'
            className='h-12 pr-11 rounded-xl
                       bg-gray-50 dark:bg-gray-800/50
                       border-gray-200 dark:border-gray-700
                       focus:border-primary focus:ring-2 focus:ring-primary/20
                       placeholder:text-muted-foreground/60
                       transition-all duration-200'
          />
        </div>
      </div>

      {/* 🔹 حقل كلمة المرور */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label htmlFor='password' className='text-sm font-medium text-foreground'>
            كلمة المرور
          </Label>
          <Link 
            href='/forgot-password'
            className='text-xs text-primary hover:text-primary/80 
                       hover:underline transition-colors duration-200'
          >
            نسيت كلمة المرور؟
          </Link>
        </div>
        <div className='relative'>
          <div className='absolute right-3 top-1/2 -translate-y-1/2 
                          text-muted-foreground pointer-events-none'>
            <Lock className='w-5 h-5' />
          </div>
          <Input
            id='password'
            name='password'
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete='current-password'
            placeholder='أدخل كلمة المرور'
            className='h-12 pr-11 pl-11 rounded-xl
                       bg-gray-50 dark:bg-gray-800/50
                       border-gray-200 dark:border-gray-700
                       focus:border-primary focus:ring-2 focus:ring-primary/20
                       placeholder:text-muted-foreground/60
                       transition-all duration-200'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute left-3 top-1/2 -translate-y-1/2 
                       text-muted-foreground hover:text-foreground
                       transition-colors duration-200'
          >
            {showPassword ? (
              <EyeOff className='w-5 h-5' />
            ) : (
              <Eye className='w-5 h-5' />
            )}
          </button>
        </div>
      </div>

      {/* 🔹 زر تسجيل الدخول */}
      <SignInButton />
    </form>
  )
}