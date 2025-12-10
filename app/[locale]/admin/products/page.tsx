// app/[locale]/admin/products/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ProductList from './product-list'
import {
  Package,
  Plus,
  Download,
  Upload,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'إدارة المنتجات | لوحة التحكم',
  description: 'إدارة وتنظيم منتجات المتجر الإلكتروني',
}

// ═══════════════════════════════════════════════════════════════
// 📊 بطاقات الإحصائيات السريعة
// ═══════════════════════════════════════════════════════════════
const quickStats = [
  {
    label: 'إجمالي المنتجات',
    value: '1,234',
    icon: Package,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    trend: '+12 هذا الأسبوع',
    trendUp: true,
  },
  {
    label: 'المنتجات النشطة',
    value: '1,180',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    trend: '96% من الإجمالي',
    trendUp: true,
  },
  {
    label: 'نفاد المخزون',
    value: '23',
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    trend: 'يحتاج إعادة تخزين',
    trendUp: false,
  },
  {
    label: 'قيد المراجعة',
    value: '8',
    icon: Clock,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    trend: 'في انتظار الموافقة',
    trendUp: false,
  },
]

// ═══════════════════════════════════════════════════════════════
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════════════════════════════
export default async function AdminProductsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/admin/products')
  }

  if (session.user.role !== 'Admin') {
    redirect('/admin/overview')
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════ الهيدر ═══════════════ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* العنوان */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
            <Package className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              إدارة المنتجات
              <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20">
                1,234
              </span>
            </h1>
            <p className="text-sm text-gray-400">
              إضافة وتعديل وحذف منتجات المتجر
            </p>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* زر التصدير */}
          <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white border border-gray-700/50 transition-all">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">تصدير</span>
          </button>

          {/* زر الاستيراد */}
          <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white border border-gray-700/50 transition-all">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">استيراد</span>
          </button>

          {/* زر إضافة منتج */}
          <Link
            href="/admin/products/create"
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>إضافة منتج</span>
          </Link>
        </div>
      </div>

      {/* ═══════════════ بطاقات الإحصائيات السريعة ═══════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`
                relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5
                bg-gradient-to-br from-gray-800/50 to-gray-900/50
                border ${stat.border}
                transition-all duration-300 hover:scale-[1.02]
              `}
            >
              {/* الأيقونة */}
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                </div>
                {stat.trendUp ? (
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                )}
              </div>

              {/* القيمة */}
              <p className="text-xl sm:text-2xl font-bold text-white mb-1">
                {stat.value}
              </p>
              
              {/* التسمية */}
              <p className="text-xs sm:text-sm text-gray-400 mb-2">
                {stat.label}
              </p>

              {/* الترند */}
              <p className={`text-xs ${stat.trendUp ? 'text-emerald-400' : 'text-amber-400'}`}>
                {stat.trend}
              </p>
            </div>
          )
        })}
      </div>

      {/* ═══════════════ قائمة المنتجات ═══════════════ */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 overflow-hidden">
        {/* هيدر القائمة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
              <BarChart3 className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">جميع المنتجات</h2>
              <p className="text-xs text-gray-400">
                عرض وإدارة جميع منتجات المتجر
              </p>
            </div>
          </div>

          {/* أزرار الفلترة */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 text-gray-400 text-sm hover:bg-gray-800 hover:text-white border border-gray-700/50 transition-all">
              <Filter className="h-4 w-4" />
              <span>فلترة</span>
            </button>
          </div>
        </div>

        {/* محتوى القائمة */}
        <div className="p-4 sm:p-6">
          <ProductList />
        </div>
      </div>
    </div>
  )
}