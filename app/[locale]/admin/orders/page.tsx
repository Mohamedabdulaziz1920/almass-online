// app/[locale]/admin/orders/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getAllOrders } from '@/lib/actions/order.actions'
import OrderList from './order-list'
import {
  ShoppingBag,
  Download,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  CreditCard,
  DollarSign,
  Package,
  RefreshCcw,
  Calendar,
  ArrowUpRight,
  XCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'إدارة الطلبات | لوحة التحكم',
  description: 'إدارة ومتابعة طلبات المتجر الإلكتروني',
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 بطاقات الإحصائيات السريعة للطلبات
// ═══════════════════════════════════════════════════════════════════════════
const quickStats = [
  {
    label: 'إجمالي الطلبات',
    value: '2,847',
    icon: ShoppingBag,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    trend: '+48 هذا الأسبوع',
    trendUp: true,
  },
  {
    label: 'الطلبات المكتملة',
    value: '2,156',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    gradient: 'from-emerald-500/20 to-green-500/20',
    trend: '76% نسبة الإكمال',
    trendUp: true,
  },
  {
    label: 'قيد التوصيل',
    value: '234',
    icon: Truck,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    gradient: 'from-amber-500/20 to-orange-500/20',
    trend: 'في الطريق للعملاء',
    trendUp: true,
  },
  {
    label: 'في الانتظار',
    value: '67',
    icon: Clock,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    gradient: 'from-violet-500/20 to-purple-500/20',
    trend: 'بانتظار المعالجة',
    trendUp: false,
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// 💰 إحصائيات المبيعات
// ═══════════════════════════════════════════════════════════════════════════
const salesStats = [
  {
    label: 'إجمالي المبيعات',
    value: '124,500',
    currency: 'ر.س',
    icon: DollarSign,
    color: 'text-emerald-400',
    change: '+18.2%',
    changeUp: true,
  },
  {
    label: 'الطلبات المدفوعة',
    value: '2,340',
    icon: CreditCard,
    color: 'text-blue-400',
    change: '+12.5%',
    changeUp: true,
  },
  {
    label: 'الطلبات الملغاة',
    value: '23',
    icon: XCircle,
    color: 'text-red-400',
    change: '-5.3%',
    changeUp: false,
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 الصفحة الرئيسية لإدارة الطلبات
// ═══════════════════════════════════════════════════════════════════════════
export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ page: string; status?: string; search?: string }>
}) {
  const session = await auth()
  const searchParams = await props.searchParams
  const { page = '1', status, search } = searchParams

  // التحقق من الصلاحيات
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/admin/orders')
  }

  if (session.user.role !== 'Admin') {
    redirect('/admin/overview')
  }

  // جلب الطلبات
  const orders = await getAllOrders({
    page: Number(page),
  })

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🎨 الهيدر الرئيسي */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* العنوان مع الأيقونة */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/20 shadow-lg shadow-blue-500/10">
              <ShoppingBag className="h-6 w-6 text-blue-400" />
            </div>
            {/* نقطة الإشعار */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-gray-900 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              إدارة الطلبات
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                {orders.totalOrders || '2,847'}
              </span>
            </h1>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              متابعة وإدارة جميع طلبات العملاء
            </p>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* زر التحديث */}
          <button className="group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gray-800/80 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white border border-gray-700/50 transition-all duration-300">
            <RefreshCcw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          {/* زر التصدير */}
          <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gray-800/80 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white border border-gray-700/50 transition-all duration-300 hover:border-gray-600">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">تصدير Excel</span>
          </button>

          {/* زر عرض التقارير */}
          <Link
            href="/admin/reports/orders"
            className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-cyan-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>التقارير</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📊 بطاقات الإحصائيات السريعة */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`
                group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5
                bg-gradient-to-br from-gray-800/60 to-gray-900/60
                border ${stat.border}
                backdrop-blur-xl
                transition-all duration-500 
                hover:scale-[1.02] hover:shadow-lg hover:shadow-${stat.color}/10
                cursor-pointer
              `}
            >
              {/* خلفية متدرجة */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* المحتوى */}
              <div className="relative z-10">
                {/* الأيقونة والترند */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl ${stat.bg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 sm:h-5.5 sm:w-5.5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    stat.trendUp 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {stat.trendUp ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )}
                  </div>
                </div>

                {/* القيمة */}
                <p className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">
                  {stat.value}
                </p>
                
                {/* التسمية */}
                <p className="text-xs sm:text-sm text-gray-400 mb-2 font-medium">
                  {stat.label}
                </p>

                {/* الترند */}
                <p className={`text-xs ${stat.trendUp ? 'text-emerald-400' : 'text-amber-400'} flex items-center gap-1`}>
                  {stat.trend}
                </p>
              </div>

              {/* تأثير التوهج */}
              <div className={`absolute -bottom-20 -right-20 w-40 h-40 ${stat.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
            </div>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 💰 شريط إحصائيات المبيعات */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {salesStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/40 to-gray-900/40 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gray-800/80`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-0.5">{stat.label}</p>
                <p className="text-lg font-bold text-white flex items-center gap-2">
                  {stat.value}
                  {stat.currency && <span className="text-sm text-gray-400">{stat.currency}</span>}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                stat.changeUp 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.change}
              </div>
            </div>
          )
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 قائمة الطلبات */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 overflow-hidden backdrop-blur-xl">
        {/* هيدر القائمة */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-700/50 bg-gray-800/30">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                جميع الطلبات
                <span className="px-2 py-0.5 rounded-md bg-gray-700/50 text-gray-400 text-xs font-normal">
                  آخر تحديث: منذ 5 دقائق
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                عرض وإدارة ومتابعة حالة جميع الطلبات
              </p>
            </div>
          </div>

          {/* أزرار التصفية والبحث */}
          <div className="flex items-center gap-2">
            {/* فلتر الحالة */}
            <select className="px-3 py-2 rounded-xl bg-gray-800/80 text-gray-300 text-sm border border-gray-700/50 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer">
              <option value="">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="processing">قيد المعالجة</option>
              <option value="shipped">تم الشحن</option>
              <option value="delivered">تم التوصيل</option>
              <option value="cancelled">ملغي</option>
            </select>

            {/* زر الفلترة المتقدمة */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/80 text-gray-400 text-sm hover:bg-gray-700 hover:text-white border border-gray-700/50 transition-all duration-300">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">فلترة متقدمة</span>
            </button>
          </div>
        </div>

        {/* محتوى القائمة */}
        <div className="p-4 sm:p-6">
          <OrderList 
            orders={orders.data} 
            totalPages={orders.totalPages!}
            currentPage={page}
          />
        </div>
      </div>
    </div>
  )
}