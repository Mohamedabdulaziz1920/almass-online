// app/[locale]/admin/categories/edit/[id]/not-found.tsx
import Link from 'next/link'
import { 
  Layers, 
  Home, 
  Plus,
  ArrowRight,
} from 'lucide-react'

export default function CategoryNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* البطاقة الرئيسية */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 p-8 text-center backdrop-blur-sm">
          {/* الخلفية المتوهجة */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

          {/* الأيقونة */}
          <div className="relative mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl animate-pulse" />
            <div className="relative flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-gray-800/80 border border-gray-700/50">
              <Layers className="h-10 w-10 text-gray-500" />
              <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                !
              </div>
            </div>
          </div>

          {/* العنوان */}
          <h1 className="relative text-2xl font-bold text-white mb-3">
            الفئة غير موجودة
          </h1>

          {/* الوصف */}
          <p className="relative text-gray-400 mb-6 leading-relaxed">
            لم نتمكن من العثور على الفئة المطلوبة. 
            ربما تم حذفها أو أن الرابط غير صحيح.
          </p>

          {/* الأزرار */}
          <div className="relative flex flex-col sm:flex-row gap-3">
            <Link
              href="/admin/categories"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              <Layers className="h-5 w-5" />
              <span>قائمة الفئات</span>
            </Link>
            
            <Link
              href="/admin/categories/create"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600 transition-all duration-300"
            >
              <Plus className="h-5 w-5" />
              <span>إنشاء فئة</span>
            </Link>
          </div>
        </div>

        {/* رابط الرئيسية */}
        <div className="text-center mt-6">
          <Link
            href="/admin/overview"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            <Home className="h-4 w-4" />
            العودة للوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  )
}