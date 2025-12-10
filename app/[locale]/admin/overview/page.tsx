// app/admin/overview/page.tsx
import { Metadata } from 'next'
import { auth } from '@/auth'
import OverviewReport from './overview-report'
import { redirect } from 'next/navigation'
import { 
  ShieldAlert, 

  Home,
  Lock,
  AlertTriangle 
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'لوحة التحكم | نظرة عامة',
  description: 'لوحة تحكم إدارة المتجر الإلكتروني',
}

// ═══════════════════════════════════════════════════════════════
// 🚫 مكون صفحة عدم الصلاحية
// ═══════════════════════════════════════════════════════════════
function AccessDenied() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* البطاقة الرئيسية */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 p-8 text-center backdrop-blur-sm">
          {/* الخلفية المتوهجة */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-red-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />

          {/* الأيقونة */}
          <div className="relative mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-20 blur-xl animate-pulse" />
            <div className="relative flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
              <ShieldAlert className="h-10 w-10 text-red-400" />
            </div>
          </div>

          {/* العنوان */}
          <h1 className="relative text-2xl font-bold text-white mb-3">
            غير مصرح بالوصول
          </h1>

          {/* الوصف */}
          <p className="relative text-gray-400 mb-6 leading-relaxed">
            عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة. 
            هذه الصفحة متاحة فقط للمدراء.
          </p>

          {/* معلومات إضافية */}
          <div className="relative flex items-center justify-center gap-2 text-sm text-amber-400 bg-amber-500/10 rounded-xl py-3 px-4 mb-6 border border-amber-500/20">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>يجب أن تكون مديراً للوصول لهذه الصفحة</span>
          </div>

          {/* الأزرار */}
          <div className="relative flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="h-5 w-5" />
              <span>العودة للرئيسية</span>
            </Link>
            
            <Link
              href="/sign-in"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              <Lock className="h-5 w-5" />
              <span>تسجيل الدخول</span>
            </Link>
          </div>
        </div>

        {/* رابط الدعم */}
        <p className="text-center text-sm text-gray-500 mt-6">
          هل تعتقد أن هذا خطأ؟{' '}
          <Link href="/contact" className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2">
            تواصل مع الدعم
          </Link>
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════════════════════════════
export default async function DashboardPage() {
  const session = await auth()

  // التحقق من صلاحيات المستخدم
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/admin/overview')
  }

  if (session.user.role !== 'Admin') {
    return <AccessDenied />
  }

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">📊</span>
            نظرة عامة
          </h1>
          <p className="text-gray-400 mt-1">
            مرحباً بك في لوحة التحكم، هنا ملخص شامل لأداء متجرك
          </p>
        </div>

        {/* معلومات آخر تحديث */}
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 rounded-xl px-4 py-2 border border-gray-700/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>آخر تحديث: الآن</span>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <OverviewReport />
    </div>
  )
}