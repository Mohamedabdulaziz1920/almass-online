'use client'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { UploadButton } from '@/lib/uploadthing'
import { ISettingInput } from '@/types'
import { 
  TrashIcon, 
  Plus, 
  Type,
  Link2,
  MousePointerClick,
  ImageIcon,
  Eye,
  EyeOff,
  Upload,
  ExternalLink
} from 'lucide-react'
import Image from 'next/image'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

export default function CarouselsFormFields({ form }: { form: UseFormReturn<ISettingInput> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'carousels',
  })

  const { watch, setValue, formState: { errors } } = form
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const publishedCount = fields.filter((_, index) => watch(`carousels.${index}.isPublished`) !== false).length

  return (
    <div className="space-y-6">
      {/* إحصائيات */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/30">
            {fields.length} شريحة
          </Badge>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            <Eye className="h-3 w-3 ml-1" />
            {publishedCount} منشور
          </Badge>
        </div>
      </div>

      {/* قائمة الشرائح */}
      <div className="space-y-4">
        {fields.map((field, index) => {
          const carouselImage = watch(`carousels.${index}.image`)
          const carouselTitle = watch(`carousels.${index}.title`)
          const isPublished = watch(`carousels.${index}.isPublished`) !== false
          const isExpanded = expandedIndex === index

          return (
            <div 
              key={field.id} 
              className={cn(
                'rounded-xl border overflow-hidden transition-all',
                'bg-white/5 border-white/10',
                isPublished ? 'ring-1 ring-emerald-500/20' : 'opacity-75'
              )}
            >
              {/* Header */}
              <div 
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <span className="text-gray-500 text-sm font-mono w-6">#{index + 1}</span>
                
                <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                  {carouselImage ? (
                    <Image src={carouselImage} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{carouselTitle || `شريحة ${index + 1}`}</p>
                </div>

                {isPublished ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                    <Eye className="h-3 w-3 ml-1" />منشور
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30 text-xs">
                    <EyeOff className="h-3 w-3 ml-1" />مخفي
                  </Badge>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={fields.length === 1}
                  onClick={(e) => { e.stopPropagation(); remove(index); }}
                  className={cn('h-8 w-8', fields.length === 1 ? 'text-gray-600' : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10')}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              {isExpanded && (
                <div className="p-4 pt-0 space-y-4 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <FormField
                      control={form.control}
                      name={`carousels.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2">
                            <Type className="h-4 w-4 text-blue-400" />عنوان الشريحة
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="أدخل عنوان جذاب" className="bg-white/5 border-white/10 text-white" />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`carousels.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-purple-400" />الرابط
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="/products" className="bg-white/5 border-white/10 text-white" dir="ltr" />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`carousels.${index}.buttonCaption`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2">
                            <MousePointerClick className="h-4 w-4 text-amber-400" />نص الزر
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="تسوق الآن" className="bg-white/5 border-white/10 text-white" />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`carousels.${index}.isPublished`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">حالة النشر</FormLabel>
                          <div className={cn('p-3 rounded-lg border', field.value !== false ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10')}>
                            <div className="flex items-center justify-between">
                              <span className={cn('text-sm', field.value !== false ? 'text-emerald-400' : 'text-gray-400')}>
                                {field.value !== false ? 'منشور' : 'مخفي'}
                              </span>
                              <FormControl>
                                <Switch checked={field.value !== false} onCheckedChange={field.onChange} className="data-[state=checked]:bg-emerald-500" />
                              </FormControl>
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* الصورة */}
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`carousels.${index}.image`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-pink-400" />صورة الشريحة
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="رابط الصورة" className="bg-white/5 border-white/10 text-white" dir="ltr" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {carouselImage ? (
                      <div className="relative rounded-xl overflow-hidden bg-gray-800 group">
                        <div className="aspect-[21/9] relative">
                          <Image src={carouselImage} alt="Preview" fill className="object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <Button type="button" variant="outline" size="sm" onClick={() => window.open(carouselImage, '_blank')} className="border-white/30 text-white">
                            <ExternalLink className="h-4 w-4 ml-1" />عرض
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => setValue(`carousels.${index}.image`, '')} className="border-red-500/30 text-red-400">
                            <TrashIcon className="h-4 w-4 ml-1" />حذف
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-white/5 rounded-xl border border-dashed border-white/20">
                        <div className="flex flex-col items-center gap-4">
                          <Upload className="h-8 w-8 text-pink-400" />
                          <p className="text-gray-400 text-sm">اسحب الصورة هنا أو انقر للرفع</p>
                          <UploadButton
                            className="ut-button:bg-pink-600 ut-button:hover:bg-pink-700"
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              setValue(`carousels.${index}.image`, res[0].url)
                              toast({ title: '✅ تم رفع الصورة' })
                            }}
                            onUploadError={(error) => toast({ variant: 'destructive', description: error.message })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {fields.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/20">
            <ImageIcon className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">لا توجد شرائح</p>
          </div>
        )}
      </div>

      {/* زر الإضافة */}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ url: '', title: '', image: '', buttonCaption: '', isPublished: true })}
        className="w-full border-dashed border-white/20 text-gray-400 hover:text-pink-400 hover:border-pink-500/50"
      >
        <Plus className="h-4 w-4 ml-2" />
        إضافة شريحة جديدة
      </Button>
    </div>
  )
}