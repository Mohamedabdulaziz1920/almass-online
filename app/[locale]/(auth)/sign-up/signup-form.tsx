// app/[locale]/(auth)/sign-up/signup-form.tsx
'use client'

import { redirect, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import useSettingStore from '@/hooks/use-setting-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { IUserSignUp } from '@/types'
import { registerUser, signInWithCredentials } from '@/lib/actions/user.actions'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserSignUpSchema } from '@/lib/validator'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { 
  User,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

const signUpDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'john doe',
        email: 'john@me.com',
        password: '123456',
        confirmPassword: '123456',
      }
    : {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    setting: { site },
  } = useSettingStore()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const form = useForm<IUserSignUp>({
    resolver: zodResolver(UserSignUpSchema),
    defaultValues: signUpDefaultValues,
  })

  const { control, handleSubmit, watch, formState: { errors } } = form
  
  // 🔹 مراقبة كلمة المرور لحساب القوة
  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  // 🔹 حساب قوة كلمة المرور
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (pass.length >= 6) strength++
    if (pass.length >= 8) strength++
    if (/[A-Z]/.test(pass)) strength++
    if (/[0-9]/.test(pass)) strength++
    if (/[^A-Za-z0-9]/.test(pass)) strength++

    if (strength <= 1) return { strength: 1, label: 'ضعيفة', color: 'bg-red-500' }
    if (strength <= 2) return { strength: 2, label: 'متوسطة', color: 'bg-amber-500' }
    if (strength <= 3) return { strength: 3, label: 'جيدة', color: 'bg-blue-500' }
    return { strength: 4, label: 'قوية', color: 'bg-emerald-500' }
  }

  const passwordStrength = getPasswordStrength(password)
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  const onSubmit = async (data: IUserSignUp) => {
    setIsLoading(true)
    try {
      const res = await registerUser(data)
      if (!res.success) {
        toast({
          title: 'خطأ في التسجيل',
          description: res.error,
          variant: 'destructive',
        })
        setIsLoading(false)
        return
      }
      
      toast({
        title: 'تم إنشاء الحساب بنجاح! 🎉',
        description: 'جارِ تسجيل الدخول...',
      })
      
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      redirect(callbackUrl)
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إنشاء الحساب',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        
        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 حقل الاسم
            ═══════════════════════════════════════════════════════════════════════ */}
        <FormField
          control={control}
          name='name'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className='text-sm font-medium text-foreground flex items-center gap-2'>
                <User className='w-4 h-4 text-muted-foreground' />
                الاسم الكامل
              </FormLabel>
              <FormControl>
                <div className='relative group'>
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 
                                  text-muted-foreground/50 group-focus-within:text-emerald-500
                                  transition-colors duration-200 pointer-events-none'>
                    <User className='w-5 h-5' />
                  </div>
                  
                  <Input 
                    type='text'
                    placeholder='أدخل اسمك الكامل'
                    autoComplete='name'
                    disabled={isLoading}
                    className={cn(
                      'h-12 pr-11 rounded-xl',
                      'bg-gray-50 dark:bg-gray-800/50',
                      'border-2 border-gray-200 dark:border-gray-700',
                      'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                      'placeholder:text-muted-foreground/50',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'transition-all duration-200',
                      errors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    )}
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className='flex items-center gap-2 text-red-500 text-sm'>
                {errors.name && <AlertCircle className='w-4 h-4' />}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 حقل البريد الإلكتروني
            ═══════════════════════════════════════════════════════════════════════ */}
        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className='text-sm font-medium text-foreground flex items-center gap-2'>
                <Mail className='w-4 h-4 text-muted-foreground' />
                البريد الإلكتروني
              </FormLabel>
              <FormControl>
                <div className='relative group'>
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 
                                  text-muted-foreground/50 group-focus-within:text-emerald-500
                                  transition-colors duration-200 pointer-events-none'>
                    <Mail className='w-5 h-5' />
                  </div>
                  
                  <Input 
                    type='email'
                    placeholder='أدخل بريدك الإلكتروني'
                    autoComplete='email'
                    disabled={isLoading}
                    className={cn(
                      'h-12 pr-11 rounded-xl',
                      'bg-gray-50 dark:bg-gray-800/50',
                      'border-2 border-gray-200 dark:border-gray-700',
                      'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                      'placeholder:text-muted-foreground/50',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'transition-all duration-200',
                      errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    )}
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className='flex items-center gap-2 text-red-500 text-sm'>
                {errors.email && <AlertCircle className='w-4 h-4' />}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 حقل كلمة المرور
            ═══════════════════════════════════════════════════════════════════════ */}
        <FormField
          control={control}
          name='password'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className='text-sm font-medium text-foreground flex items-center gap-2'>
                <Lock className='w-4 h-4 text-muted-foreground' />
                كلمة المرور
              </FormLabel>
              <FormControl>
                <div className='relative group'>
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 
                                  text-muted-foreground/50 group-focus-within:text-emerald-500
                                  transition-colors duration-200 pointer-events-none'>
                    <Lock className='w-5 h-5' />
                  </div>
                  
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder='أدخل كلمة المرور (6 أحرف على الأقل)'
                    autoComplete='new-password'
                    disabled={isLoading}
                    className={cn(
                      'h-12 pr-11 pl-11 rounded-xl',
                      'bg-gray-50 dark:bg-gray-800/50',
                      'border-2 border-gray-200 dark:border-gray-700',
                      'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                      'placeholder:text-muted-foreground/50',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'transition-all duration-200',
                      errors.password && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    )}
                    {...field}
                  />
                  
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className='absolute left-3 top-1/2 -translate-y-1/2 
                               text-muted-foreground/50 hover:text-foreground
                               disabled:cursor-not-allowed
                               transition-colors duration-200
                               p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800'
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </FormControl>
              
              {/* 🔹 مؤشر قوة كلمة المرور */}
              {password && (
                <div className='space-y-2'>
                  <div className='flex gap-1'>
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          'h-1.5 flex-1 rounded-full transition-all duration-300',
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : 'bg-gray-200 dark:bg-gray-700'
                        )}
                      />
                    ))}
                  </div>
                  <p className={cn(
                    'text-xs font-medium transition-colors duration-200',
                    passwordStrength.strength <= 1 && 'text-red-500',
                    passwordStrength.strength === 2 && 'text-amber-500',
                    passwordStrength.strength === 3 && 'text-blue-500',
                    passwordStrength.strength >= 4 && 'text-emerald-500',
                  )}>
                    قوة كلمة المرور: {passwordStrength.label}
                  </p>
                </div>
              )}
              
              <FormMessage className='flex items-center gap-2 text-red-500 text-sm'>
                {errors.password && <AlertCircle className='w-4 h-4' />}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 حقل تأكيد كلمة المرور
            ═══════════════════════════════════════════════════════════════════════ */}
        <FormField
          control={control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem className='space-y-2'>
              <FormLabel className='text-sm font-medium text-foreground flex items-center gap-2'>
                <ShieldCheck className='w-4 h-4 text-muted-foreground' />
                تأكيد كلمة المرور
              </FormLabel>
              <FormControl>
                <div className='relative group'>
                  <div className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none',
                    passwordsMatch 
                      ? 'text-emerald-500' 
                      : 'text-muted-foreground/50 group-focus-within:text-emerald-500'
                  )}>
                    {passwordsMatch ? (
                      <CheckCircle2 className='w-5 h-5' />
                    ) : (
                      <Lock className='w-5 h-5' />
                    )}
                  </div>
                  
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='أعد إدخال كلمة المرور'
                    autoComplete='new-password'
                    disabled={isLoading}
                    className={cn(
                      'h-12 pr-11 pl-11 rounded-xl',
                      'bg-gray-50 dark:bg-gray-800/50',
                      'border-2 border-gray-200 dark:border-gray-700',
                      'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
                      'placeholder:text-muted-foreground/50',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'transition-all duration-200',
                      errors.confirmPassword && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                      passwordsMatch && 'border-emerald-500'
                    )}
                    {...field}
                  />
                  
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className='absolute left-3 top-1/2 -translate-y-1/2 
                               text-muted-foreground/50 hover:text-foreground
                               disabled:cursor-not-allowed
                               transition-colors duration-200
                               p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800'
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </FormControl>
              
              {/* 🔹 رسالة تطابق كلمات المرور */}
              {confirmPassword && (
                <p className={cn(
                  'text-xs font-medium flex items-center gap-1',
                  passwordsMatch ? 'text-emerald-500' : 'text-red-500'
                )}>
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className='w-3 h-3' />
                      كلمات المرور متطابقة
                    </>
                  ) : (
                    <>
                      <AlertCircle className='w-3 h-3' />
                      كلمات المرور غير متطابقة
                    </>
                  )}
                </p>
              )}
              
              <FormMessage className='flex items-center gap-2 text-red-500 text-sm'>
                {errors.confirmPassword && <AlertCircle className='w-4 h-4' />}
              </FormMessage>
            </FormItem>
          )}
        />

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 زر إنشاء الحساب
            ═══════════════════════════════════════════════════════════════════════ */}
        <Button 
          type='submit' 
          disabled={isLoading}
          className='w-full h-12 rounded-xl
                     bg-gradient-to-r from-emerald-500 to-teal-500
                     hover:from-emerald-600 hover:to-teal-600
                     text-white font-semibold text-base
                     shadow-lg shadow-emerald-500/25
                     hover:shadow-xl hover:shadow-emerald-500/30
                     disabled:opacity-70 disabled:cursor-not-allowed
                     transition-all duration-300
                     hover:scale-[1.02] active:scale-[0.98]
                     group relative overflow-hidden'
        >
          {/* 🔹 تأثير اللمعة */}
          <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                          translate-x-[-100%] group-hover:translate-x-[100%]
                          transition-transform duration-700' />
          
          {isLoading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='w-5 h-5 animate-spin' />
              <span>جارِ إنشاء الحساب...</span>
            </div>
          ) : (
            <div className='relative flex items-center justify-center gap-2'>
              <UserPlus className='w-5 h-5' />
              <span>إنشاء حساب جديد</span>
            </div>
          )}
        </Button>

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 نص الموافقة على الشروط
            ═══════════════════════════════════════════════════════════════════════ */}
        <p className='text-xs text-center text-muted-foreground leading-relaxed'>
          بإنشاء حساب، أنت توافق على{' '}
          <Link 
            href='/page/conditions-of-use'
            className='text-emerald-600 dark:text-emerald-400 hover:underline 
                       transition-colors duration-200 font-medium'
          >
            شروط الاستخدام
          </Link>
          {' '}و{' '}
          <Link 
            href='/page/privacy-policy'
            className='text-emerald-600 dark:text-emerald-400 hover:underline 
                       transition-colors duration-200 font-medium'
          >
            سياسة الخصوصية
          </Link>
          {' '}الخاصة بـ {site.name}.
        </p>
      </form>
    </Form>
  )
}