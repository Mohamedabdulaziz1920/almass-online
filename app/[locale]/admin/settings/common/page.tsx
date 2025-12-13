import { getNoCachedSetting } from '@/lib/actions/setting.actions'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CommonFormWrapper from './_components/common-form-wrapper'
import Link from 'next/link'
import { Palette, ArrowRight, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'الإعدادات العامة | الإعدادات',
}

export default async function CommonSettingsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'Admin') {
    redirect('/admin/settings')
  }

  const setting = await getNoCachedSetting()

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/admin/settings" className="hover:text-white transition-colors">
              الإعدادات
            </Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-purple-400">الإعدادات العامة</span>
          </div>
        </div>

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
              <Palette className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                الإعدادات العامة
                <Sparkles className="h-5 w-5 text-purple-400" />
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                المظهر، الألوان، وإعدادات النظام
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <CommonFormWrapper setting={setting} />
        </div>
      </div>
    </div>
  )
}