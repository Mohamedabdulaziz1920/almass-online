// app/[locale]/admin/categories/category-form.tsx
'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { Switch } from '@/components/ui/switch' // تأكد من تثبيت المكون: npx shadcn-ui@latest add switch
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import {
  Layers,
  Type,
  Link2,
  ImageIcon,
  Save,
  ArrowRight,
  Loader2,
  Trash2,
  Upload,
  X,
  Wand2,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle,
  Info,
  FolderOpen,
  Star, // تم إضافة Star هنا لإصلاح خطأ عدم التعريف
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createCategory, updateCategory } from '@/lib/actions/category.actions'
import { UploadButton } from '@/lib/uploadthing'
import { CategoryInputSchema } from '@/lib/validator'
import { toSlug, cn } from '@/lib/utils'

// ═══════════════════════════════════════════════════════════════
// 📋 تعريف الأنواع
// ═══════════════════════════════════════════════════════════════
type Inputs = z.infer<typeof CategoryInputSchema>

export enum CategoryFormType {
  Create = 'Create',
  Update = 'Update',
}

// تم تصحيح القيم الافتراضية لإصلاح خطأ Property is missing
const categoryDefaultValues: Inputs = {
  name: '',
  slug: '',
  image: '',
  isFeatured: false,
  banner: '',
}

type Props = {
  type: CategoryFormType
  initialData?: Inputs
  categoryId?: string
}

// ═══════════════════════════════════════════════════════════════
// 🏷️ مكون عنوان القسم
// ═══════════════════════════════════════════════════════════════
function SectionHeader({
  icon: Icon,
  title,
  description,
  color = 'violet',
}: {
  icon: React.ElementType
  title: string
  description?: string
  color?: 'violet' | 'blue' | 'emerald' | 'orange' | 'pink'
}) {
  const colors = {
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      text: 'text-violet-400',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
    },
    orange: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-400',
    },
    pink: {
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20',
      text: 'text-pink-400',
    },
  }

  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl',
          colors[color].bg,
          'border',
          colors[color].border
        )}
      >
        <Icon className={cn('h-5 w-5', colors[color].text)} />
      </div>
      <div>
        <h3 className="font-bold text-white">{title}</h3>
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════
const CategoryForm = ({ type, initialData, categoryId }: Props) => {
  const router = useRouter()
  const t = useTranslations('CategoryForm')
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<Inputs>({
    resolver: zodResolver(CategoryInputSchema),
    defaultValues: initialData ?? categoryDefaultValues,
  })

  const image = form.watch('image')
  const banner = form.watch('banner') // Watch banner as well
  const isSubmitting = form.formState.isSubmitting || isPending

  // حذف الصورة
  const removeImage = () => {
    form.setValue('image', '')
  }

  // إرسال النموذج
  async function onSubmit(values: Inputs) {
    setIsPending(true)
    try {
      if (type === CategoryFormType.Create) {
        const res = await createCategory(values)
        if (!res.success) {
          toast({
            variant: 'destructive',
            description: res.message,
          })
        } else {
          toast({ description: res.message })
          router.push(`/admin/categories`)
        }
      }

      if (type === 'Update') {
  if (!categoryId) return // حماية إضافية للتأكد من وجود المعرف

  // 1. قمنا بتعريف المتغير res
  // 2. استخدمنا categoryId بدلاً من category._id
  // 3. دمجنا القيم في كائن واحد كما طلبنا سابقاً
  const res = await updateCategory({ ...values, _id: categoryId })

        if (!res.success) {
          toast({
            variant: 'destructive',
            description: res.message,
          })
        } else {
          toast({ description: 'تم تحديث الفئة بنجاح' })
          router.push(`/admin/categories`)
        }
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════ الهيدر ═══════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
            <Layers className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {type === CategoryFormType.Create ? 'إنشاء فئة جديدة' : 'تعديل الفئة'}
            </h1>
            <p className="text-sm text-gray-400">
              {type === CategoryFormType.Create
                ? 'أضف فئة جديدة لتنظيم منتجاتك'
                : 'قم بتحديث معلومات الفئة'}
            </p>
          </div>
        </div>

        {/* أزرار */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/categories"
            className={cn(
              'flex items-center gap-2 h-10 px-4 rounded-xl',
              'bg-gray-800/50 border border-gray-700/50',
              'text-gray-300 hover:text-white hover:bg-gray-800',
              'transition-all text-sm font-medium'
            )}
          >
            <ArrowRight className="h-4 w-4" />
            <span className="hidden sm:inline">رجوع</span>
          </Link>
          
          {type === CategoryFormType.Update && categoryId && (
            <Link
              href={`/category/${form.getValues('slug')}`}
              target="_blank"
              className={cn(
                'flex items-center gap-2 h-10 px-4 rounded-xl',
                'bg-blue-500/10 border border-blue-500/20',
                'text-blue-400 hover:bg-blue-500/20',
                'transition-all text-sm font-medium'
              )}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">معاينة</span>
            </Link>
          )}
        </div>
      </div>

      {/* ═══════════════ النموذج ═══════════════ */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ═══ العمود الرئيسي ═══ */}
            <div className="lg:col-span-2 space-y-6">
              {/* قسم المعلومات الأساسية */}
              <div className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-5 sm:p-6">
                <SectionHeader
                  icon={Type}
                  title="المعلومات الأساسية"
                  description="أدخل اسم الفئة والمعرف الفريد"
                  color="violet"
                />

                <div className="space-y-5">
                  {/* اسم الفئة */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <Type className="h-4 w-4 text-violet-400" />
                          {t('name')}
                          <span className="text-red-400 text-xs">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('namePlaceholder')}
                            className={cn(
                              'h-11 rounded-xl',
                              'bg-gray-800/50 border-gray-700/50',
                              'text-white placeholder-gray-500',
                              'focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Slug */}
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <Link2 className="h-4 w-4 text-violet-400" />
                          {t('slug')}
                          <span className="text-red-400 text-xs">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder={t('slugPlaceholder')}
                              className={cn(
                                'h-11 rounded-xl pl-24',
                                'bg-gray-800/50 border-gray-700/50',
                                'text-white placeholder-gray-500',
                                'focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20'
                              )}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                form.setValue('slug', toSlug(form.getValues('name')))
                              }}
                              className={cn(
                                'absolute left-1 top-1/2 -translate-y-1/2',
                                'flex items-center gap-1 px-3 py-1.5 rounded-lg',
                                'bg-violet-500/20 text-violet-400 text-xs font-medium',
                                'hover:bg-violet-500/30 transition-colors'
                              )}
                            >
                              <Wand2 className="h-3 w-3" />
                              {t('generate')}
                            </button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-gray-500 flex items-center gap-1 mt-2">
                          <Info className="h-3 w-3" />
                          المعرف يُستخدم في رابط الفئة
                        </FormDescription>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* حقل مميز */}
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem>
                    <div
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl',
                        'border transition-colors cursor-pointer',
                        field.value
                          ? 'bg-yellow-500/10 border-yellow-500/30'
                          : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
                      )}
                      onClick={() => field.onChange(!field.value)}
                    >
                      <div className="flex items-center gap-3">
                        {field.value ? (
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        ) : (
                          <Star className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                          <p className={cn(
                            'font-medium',
                            field.value ? 'text-yellow-400' : 'text-gray-300'
                          )}>
                            {field.value ? 'فئة مميزة' : 'فئة عادية'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {field.value
                              ? 'ستظهر الفئة في القسم المميز'
                              : 'فئة عادية في القائمة'}
                          </p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              {/* حقل البانر */}
              <FormField
                control={form.control}
                name="banner"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-gray-300 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-pink-400" />
                      بانر الفئة (اختياري)
                    </FormLabel>
                    <Card className="bg-gray-900/50 border-gray-700/50 border-dashed">
                      <CardContent className="p-4">
                        {banner && (
                          <div className="relative group mb-4">
                            <div className="relative h-24 rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50">
                              <Image
                                src={banner || ''} // 👈 تم الإصلاح: تجنب undefined
                                alt="بانر الفئة"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => form.setValue('banner', '')}
                                className={cn(
                                  'absolute top-2 right-2',
                                  'flex h-7 w-7 items-center justify-center rounded-lg',
                                  'bg-red-500/80 text-white',
                                  'opacity-0 group-hover:opacity-100',
                                  'transition-opacity hover:bg-red-600'
                                )}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <FormControl>
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res: { url: string }[]) => {
                              if (res && res[0]?.url) {
                                form.setValue('banner', res[0].url)
                                toast({ description: 'تم رفع البانر بنجاح' })
                              }
                            }}
                            onUploadError={(error: Error) => {
                              toast({
                                variant: 'destructive',
                                description: `خطأ: ${error.message}`,
                              })
                            }}
                          />
                        </FormControl>
                      </CardContent>
                    </Card>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* نصائح */}
              <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-400 mb-1">
                      نصائح لفئة ناجحة
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• اختر اسماً واضحاً ومفهوماً</li>
                      <li>• استخدم صورة عالية الجودة تمثل الفئة</li>
                      <li>• اجعل الـ Slug قصيراً وسهل القراءة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ العمود الجانبي ═══ */}
            <div className="space-y-6">
              {/* قسم الصورة */}
              <div className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-5 sm:p-6">
                <SectionHeader
                  icon={ImageIcon}
                  title="صورة الفئة"
                  description="أضف صورة تمثل الفئة"
                  color="orange"
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <Card className="bg-gray-900/50 border-gray-700/50 border-dashed">
                        <CardContent className="p-4">
                          {/* عرض الصورة */}
                          {image ? (
                            <div className="relative group mb-4">
                              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50">
                                <Image
                                  src={image || ''} // 👈 تم الإصلاح
                                  alt="صورة الفئة"
                                  fill
                                  className="object-cover"
                                />
                                
                                {/* زر الحذف */}
                                <button
                                  type="button"
                                  onClick={removeImage}
                                  className={cn(
                                    'absolute top-2 right-2',
                                    'flex h-8 w-8 items-center justify-center rounded-lg',
                                    'bg-red-500/80 text-white',
                                    'opacity-0 group-hover:opacity-100',
                                    'transition-opacity hover:bg-red-600'
                                  )}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <p className="text-xs text-gray-500 mt-2 text-center">
                                انقر على × لحذف الصورة
                              </p>
                            </div>
                          ) : (
                            /* منطقة الرفع */
                            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-700/50 rounded-xl hover:border-orange-500/50 transition-colors">
                              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 mb-3">
                                <Upload className="h-7 w-7 text-orange-400" />
                              </div>
                              <p className="text-sm text-gray-400 mb-1 text-center">
                                اسحب الصورة هنا
                              </p>
                              <p className="text-xs text-gray-500 mb-4">
                                أو انقر للاختيار
                              </p>
                            </div>
                          )}

                          {/* زر الرفع */}
                          <FormControl>
                            <div className="flex justify-center">
                              <UploadButton
                                endpoint="imageUploader"
                                onUploadBegin={() => setIsUploading(true)}
                                onClientUploadComplete={(res: { url: string }[]) => {
                                  setIsUploading(false)
                                  if (res && res[0]?.url) {
                                    form.setValue('image', res[0].url)
                                    toast({
                                      description: 'تم رفع الصورة بنجاح',
                                    })
                                  }
                                }}
                                onUploadError={(error: Error) => {
                                  setIsUploading(false)
                                  toast({
                                    variant: 'destructive',
                                    description: `خطأ: ${error.message}`,
                                  })
                                }}
                                appearance={{
                                  button: cn(
                                    'px-4 py-2 rounded-xl',
                                    'bg-orange-500 hover:bg-orange-600',
                                    'text-white font-medium text-sm',
                                    'transition-colors'
                                  ),
                                }}
                              />
                            </div>
                          </FormControl>

                          {isUploading && (
                            <div className="flex items-center justify-center gap-2 mt-3 text-orange-400 text-sm">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              جاري الرفع...
                            </div>
                          )}

                          <p className="text-xs text-gray-500 mt-3 text-center">
                            PNG, JPG, WEBP (الحد الأقصى 4MB)
                          </p>
                        </CardContent>
                      </Card>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* أزرار الحفظ */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'w-full h-12 rounded-xl',
                    'bg-gradient-to-r from-violet-500 to-purple-600',
                    'hover:from-violet-600 hover:to-purple-700',
                    'text-white font-semibold',
                    'shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
                    'transition-all hover:scale-[1.02] active:scale-[0.98]',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                  )}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t('saving')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      {type === CategoryFormType.Create ? t('Create') : t('update')}
                    </div>
                  )}
                </Button>

                {type === CategoryFormType.Create && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    className={cn(
                      'w-full h-10 rounded-xl',
                      'bg-gray-800/50 border-gray-700/50',
                      'text-gray-300 hover:text-white hover:bg-gray-800'
                    )}
                  >
                    <X className="h-4 w-4 ml-2" />
                    مسح النموذج
                  </Button>
                )}
              </div>

              {/* معلومات إضافية */}
              <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FolderOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-400">معلومات</span>
                </div>
                <ul className="text-xs text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    الفئات تساعد في تنظيم المنتجات
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    يمكن للعملاء تصفح المنتجات بالفئة
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-amber-400" />
                    الصورة اختيارية ولكن موصى بها
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CategoryForm