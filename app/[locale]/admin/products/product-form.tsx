// app/[locale]/admin/products/product-form.tsx
'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import {
  Package,
  Type,
  Link2,
  Tag,
  Briefcase,
  DollarSign,
  Boxes,
  ImageIcon,
  FileText,
  Eye,
  Save,
  ArrowRight,
  Loader2,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  Upload,
  X,
  Wand2,
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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import { UploadButton } from '@/lib/uploadthing'
import { ProductInputSchema, ProductUpdateSchema } from '@/lib/validator'
import { toSlug, cn } from '@/lib/utils'
import { IProductInput } from '@/types'

// ═══════════════════════════════════════════════════════════════
// 📋 القيم الافتراضية
// ═══════════════════════════════════════════════════════════════
const productDefaultValues: IProductInput =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'Sample Product',
        slug: 'sample-product',
        category: 'Sample Category',
        images: ['/images/p11-1.jpg'],
        brand: 'Sample Brand',
        description: 'This is a sample description of the product.',
        price: 99.99,
        listPrice: 0,
        countInStock: 15,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }
    : {
        name: '',
        slug: '',
        category: '',
        images: [],
        brand: '',
        description: '',
        price: 0,
        listPrice: 0,
        countInStock: 0,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
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
const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update'
  product?: IProduct
  productId?: string
}) => {
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<IProductInput>({
    resolver:
      type === 'Update'
        ? zodResolver(ProductUpdateSchema)
        : zodResolver(ProductInputSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  })

  const images = form.watch('images')
  const isSubmitting = form.formState.isSubmitting

  // حذف صورة
  const removeImage = (imageToRemove: string) => {
    const currentImages = form.getValues('images')
    form.setValue(
      'images',
      currentImages.filter((img) => img !== imageToRemove)
    )
  }

  // إرسال النموذج
  async function onSubmit(values: IProductInput) {
    if (type === 'Create') {
      const res = await createProduct(values)
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push(`/admin/products`)
      }
    }
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`)
        return
      }
      const res = await updateProduct({ ...values, _id: productId })
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        toast({
          description: 'تم تحديث المنتج بنجاح',
        })
        router.push(`/admin/products`)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════ الهيدر ═══════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
            <Package className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {type === 'Create' ? 'إضافة منتج جديد' : 'تعديل المنتج'}
            </h1>
            <p className="text-sm text-gray-400">
              {type === 'Create'
                ? 'أضف منتج جديد إلى متجرك'
                : 'قم بتحديث معلومات المنتج'}
            </p>
          </div>
        </div>

        {/* أزرار */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
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
          
          {type === 'Update' && productId && (
            <Link
              href={`/product/${form.getValues('slug')}`}
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
                  description="أدخل اسم المنتج والمعرف الفريد"
                  color="violet"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* اسم المنتج */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <Type className="h-4 w-4 text-violet-400" />
                          اسم المنتج
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل اسم المنتج"
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
                          المعرف (Slug)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="product-slug"
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
                              توليد
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* قسم التصنيف والعلامة التجارية */}
              <div className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-5 sm:p-6">
                <SectionHeader
                  icon={Tag}
                  title="التصنيف والعلامة التجارية"
                  description="حدد فئة المنتج والعلامة التجارية"
                  color="blue"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* التصنيف */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <Tag className="h-4 w-4 text-blue-400" />
                          التصنيف
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: الإلكترونيات"
                            className={cn(
                              'h-11 rounded-xl',
                              'bg-gray-800/50 border-gray-700/50',
                              'text-white placeholder-gray-500',
                              'focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* العلامة التجارية */}
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-400" />
                          العلامة التجارية
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: Apple"
                            className={cn(
                              'h-11 rounded-xl',
                              'bg-gray-800/50 border-gray-700/50',
                              'text-white placeholder-gray-500',
                              'focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* قسم الأسعار والمخزون */}
              <div className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-5 sm:p-6">
                <SectionHeader
                  icon={DollarSign}
                  title="الأسعار والمخزون"
                  description="حدد سعر المنتج وكمية المخزون"
                  color="emerald"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* السعر قبل الخصم */}
                  <FormField
                    control={form.control}
                    name="listPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          السعر قبل الخصم
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className={cn(
                                'h-11 rounded-xl pl-12',
                                'bg-gray-800/50 border-gray-700/50',
                                'text-white placeholder-gray-500',
                                'focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20'
                              )}
                              {...field}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                              ر.س
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* السعر الحالي */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-emerald-400" />
                          السعر الحالي
                          <span className="text-emerald-400 text-xs">(مطلوب)</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className={cn(
                                'h-11 rounded-xl pl-12',
                                'bg-gray-800/50 border-gray-700/50',
                                'text-white placeholder-gray-500',
                                'focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20',
                                'border-emerald-500/30'
                              )}
                              {...field}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-sm font-medium">
                              ر.س
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* المخزون */}
                  <FormField
                    control={form.control}
                    name="countInStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <Boxes className="h-4 w-4 text-orange-400" />
                          الكمية في المخزون
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className={cn(
                              'h-11 rounded-xl',
                              'bg-gray-800/50 border-gray-700/50',
                              'text-white placeholder-gray-500',
                              'focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* قسم الوصف */}
              <div className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-5 sm:p-6">
                <SectionHeader
                  icon={FileText}
                  title="وصف المنتج"
                  description="أضف وصفاً تفصيلياً للمنتج"
                  color="pink"
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="اكتب وصفاً تفصيلياً للمنتج..."
                          rows={6}
                          className={cn(
                            'rounded-xl resize-none',
                            'bg-gray-800/50 border-gray-700/50',
                            'text-white placeholder-gray-500',
                            'focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20'
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500 flex items-center gap-1 mt-2">
                        <Info className="h-3 w-3" />
                        يمكنك استخدام Markdown لتنسيق النص
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ═══ العمود الجانبي ═══ */}
            <div className="space-y-6">
              {/* قسم الصور */}
              <div className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-5 sm:p-6">
                <SectionHeader
                  icon={ImageIcon}
                  title="صور المنتج"
                  description="أضف صور عالية الجودة"
                  color="orange"
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                      <Card className="bg-gray-900/50 border-gray-700/50 border-dashed">
                        <CardContent className="p-4">
                          {/* عرض الصور */}
                          {images.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {images.map((image: string, index: number) => (
                                <div
                                  key={image}
                                  className="relative group aspect-square rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50"
                                >
                                  <Image
                                    src={image}
                                    alt={`صورة ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                  
                                  {/* شارة الصورة الرئيسية */}
                                  {index === 0 && (
                                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-yellow-500/90 text-black text-xs font-medium">
                                      رئيسية
                                    </span>
                                  )}
                                  
                                  {/* زر الحذف */}
                                  <button
                                    type="button"
                                    onClick={() => removeImage(image)}
                                    className={cn(
                                      'absolute top-2 left-2',
                                      'flex h-7 w-7 items-center justify-center rounded-lg',
                                      'bg-red-500/80 text-white',
                                      'opacity-0 group-hover:opacity-100',
                                      'transition-opacity hover:bg-red-600'
                                    )}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* زر الرفع */}
                          <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-700/50 rounded-xl hover:border-orange-500/50 transition-colors">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 mb-3">
                              <Upload className="h-6 w-6 text-orange-400" />
                            </div>
                            <p className="text-sm text-gray-400 mb-3 text-center">
                              اسحب الصور هنا أو انقر للرفع
                            </p>
                            <FormControl>
                              <UploadButton
                                endpoint="imageUploader"
                                onUploadBegin={() => setIsUploading(true)}
                                onClientUploadComplete={(res: { url: string }[]) => {
                                  setIsUploading(false)
                                  if (res?.[0]?.url) {
                                    form.setValue('images', [...images, res[0].url])
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
                            </FormControl>
                            {isUploading && (
                              <div className="flex items-center gap-2 mt-3 text-orange-400 text-sm">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                جاري الرفع...
                              </div>
                            )}
                          </div>

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

              {/* قسم حالة النشر */}
              <div className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-5 sm:p-6">
                <SectionHeader
                  icon={Eye}
                  title="حالة النشر"
                  description="تحكم في ظهور المنتج"
                  color="emerald"
                />

                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem>
                      <div
                        className={cn(
                          'flex items-center justify-between p-4 rounded-xl',
                          'border transition-colors cursor-pointer',
                          field.value
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
                        )}
                        onClick={() => field.onChange(!field.value)}
                      >
                        <div className="flex items-center gap-3">
                          {field.value ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <div>
                            <p className={cn(
                              'font-medium',
                              field.value ? 'text-emerald-400' : 'text-gray-300'
                            )}>
                              {field.value ? 'منشور' : 'مسودة'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {field.value
                                ? 'المنتج ظاهر للعملاء'
                                : 'المنتج مخفي عن العملاء'}
                            </p>
                          </div>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className={cn(
                              'h-5 w-5 rounded border-2',
                              field.value
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-gray-600'
                            )}
                          />
                        </FormControl>
                      </div>
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
                      جاري الحفظ...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      {type === 'Create' ? 'إضافة المنتج' : 'حفظ التغييرات'}
                    </div>
                  )}
                </Button>

                {type === 'Create' && (
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

              {/* نصائح */}
              <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-400 mb-1">
                      نصائح لمنتج ناجح
                    </p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• استخدم صور عالية الجودة</li>
                      <li>• اكتب وصفاً تفصيلياً ودقيقاً</li>
                      <li>• حدد سعراً تنافسياً</li>
                      <li>• اختر التصنيف المناسب</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ProductForm