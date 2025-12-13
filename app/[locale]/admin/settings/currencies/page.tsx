import { getNoCachedSetting } from '@/lib/actions/setting.actions'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CurrenciesFormWrapper from './_components/currencies-form-wrapper'
import Link from 'next/link'
import { CircleDollarSign, ArrowRight, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'العملات | الإعدادات',
}

export default async function CurrenciesPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'Admin') {
    redirect('/admin/settings')
  }

  const setting = await getNoCachedSetting()

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/admin/settings" className="hover:text-white transition-colors">الإعدادات</Link>
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span className="text-amber-400">العملات</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <CircleDollarSign className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                العملات
                <Sparkles className="h-5 w-5 text-amber-400" />
              </h1>
              <p className="text-gray-400 text-sm mt-1">إدارة العملات وأسعار التحويل</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <CurrenciesFormWrapper setting={setting} />
        </div>
      </div>
    </div>
  )
}