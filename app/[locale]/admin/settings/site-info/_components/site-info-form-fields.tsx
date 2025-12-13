'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import { UploadButton } from '@/lib/uploadthing'
import { ISettingInput } from '@/types'
import { 
  TrashIcon, 
  Globe, 
  Link2, 
  ImageIcon, 
  FileText, 
  Quote, 
  Hash, 
  Phone, 
  Mail, 
  MapPin, 
  Copyright,
  Upload
} from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import Image from 'next/image'

export default function SiteInfoFormFields({
  form,
}: {
  form: UseFormReturn<ISettingInput>
}) {
  const { watch, control, setValue } = form
  const siteLogo = watch('site.logo')

  return (
    <div className="space-y-6">
      {/* اسم الموقع والرابط */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          control={control}
          name="site.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                اسم الموقع
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="أدخل اسم الموقع" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="site.url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-purple-400" />
                رابط الموقع
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com" 
                  className="bg-white/5 border-white/10 text-white"
                  dir="ltr"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      </div>

      {/* الشعار والوصف */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-3">
          <FormField
            control={control}
            name="site.logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-emerald-400" />
                  شعار الموقع
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="أدخل رابط الشعار" 
                    className="bg-white/5 border-white/10 text-white"
                    dir="ltr"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {siteLogo ? (
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <Image 
                src={siteLogo} 
                alt="logo" 
                width={64}
                height={64}
                className="rounded-lg bg-white/10 p-2 object-contain"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue('site.logo', '')}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <TrashIcon className="w-4 h-4 ml-1" />
                حذف
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-white/5 rounded-xl border border-dashed border-white/20">
              <UploadButton
                className="ut-button:bg-emerald-600 ut-button:hover:bg-emerald-700"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setValue('site.logo', res[0].url)
                  toast({ title: '✅ تم رفع الشعار بنجاح' })
                }}
                onUploadError={(error: Error) => {
                  toast({ variant: 'destructive', description: error.message })
                }}
              />
            </div>
          )}
        </div>

        <FormField
          control={control}
          name="site.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" />
                وصف الموقع
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أدخل وصف الموقع..."
                  className="bg-white/5 border-white/10 text-white min-h-[140px]"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      </div>

      {/* الشعار والكلمات المفتاحية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          control={control}
          name="site.slogan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 flex items-center gap-2">
                <Quote className="h-4 w-4 text-pink-400" />
                شعار الموقع (Slogan)
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="أدخل شعار الموقع" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="site.keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 flex items-center gap-2">
                <Hash className="h-4 w-4 text-cyan-400" />
                الكلمات المفتاحية
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="كلمة1, كلمة2, كلمة3" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      </div>

      {/* معلومات الاتصال */}
      <div className="pt-4 border-t border-white/10">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Phone className="h-4 w-4 text-emerald-400" />
          معلومات الاتصال
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={control}
            name="site.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">رقم الهاتف</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+966 5XX XXX XXXX" 
                    className="bg-white/5 border-white/10 text-white"
                    dir="ltr"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="site.email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="info@example.com" 
                    className="bg-white/5 border-white/10 text-white"
                    dir="ltr"
                    type="email"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* العنوان وحقوق النشر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          control={control}
          name="site.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-400" />
                العنوان
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="أدخل العنوان" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="site.copyright"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300 flex items-center gap-2">
                <Copyright className="h-4 w-4 text-violet-400" />
                حقوق النشر
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="© 2024 اسم الشركة" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}