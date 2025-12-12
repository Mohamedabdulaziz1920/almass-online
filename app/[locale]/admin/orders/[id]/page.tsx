// app/[locale]/admin/orders/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import OrderDetailsForm from './order-details-form'
import {
  ChevronLeft,
  Home,
  ShoppingBag,
  Hash,
  Calendar,
  Clock,
  ArrowLeft,
  Printer,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  Truck,
  CreditCard,
  Package,
  XCircle,
  Hourglass,
  PackageCheck,
  RefreshCw,
} from 'lucide-react'
import { formatDateTime, formatId } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'تفاصيل الطلب | لوحة التحكم',
  description: 'عرض وإدارة تفاصيل الطلب',
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 تعريف حالات الطلب
// ═══════════════════════════════════════════════════════════════════════════
const orderStatusConfig = {
  pending: {
    label: 'جاري الانتظار',
    labelEn: 'Pending',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    gradient: 'from-amber-500/20 to-orange-500/20',
    icon: Hourglass,
    description: 'الطلب في انتظار المراجعة',
  },
  processing: {
    label: 'قيد التحضير',
    labelEn: 'Processing',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    icon: Package,
    description: 'جاري تحضير الطلب للشحن',
  },
  shipped: {
    label: 'تم الشحن',
    labelEn: 'Shipped',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    gradient: 'from-violet-500/20 to-purple-500/20',
    icon: Truck,
    description: 'الطلب في الطريق للعميل',
  },
  delivered: {
    label: 'تم التوصيل',
    labelEn: 'Delivered',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-500/20 to-green-500/20',
    icon: PackageCheck,
    description: 'تم توصيل الطلب بنجاح',
  },
  completed: {
    label: 'مكتمل',
    labelEn: 'Completed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    icon: CheckCircle,
    description: 'الطلب مكتمل بالكامل',
  },
  cancelled: {
    label: 'ملغي',
    labelEn: 'Cancelled',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    gradient: 'from-red-500/20 to-rose-500/20',
    icon: XCircle,
    description: 'تم إلغاء الطلب',
  },
  rejected: {
    label: 'مرفوض',
    labelEn: 'Rejected',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    gradient: 'from-red-500/20 to-pink-500/20',
    icon: XCircle,
    description: 'تم رفض الطلب',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 صفحة تفاصيل الطلب
// ═══════════════════════════════════════════════════════════════════════════
const AdminOrderDetailsPage = async (props: {
  params: Promise<{ id: string }>
}) => {
  const params = await props.params
  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()
  const isAdmin = session?.user?.role === 'Admin' || false

  // تحديد حالة الطلب الحالية
  const currentStatus = order.status || 'pending'
  const statusConfig = orderStatusConfig[currentStatus as keyof typeof orderStatusConfig] || orderStatusConfig.pending
  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🍞 شريط التنقل (Breadcrumbs) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/admin/overview"
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">لوحة التحكم</span>
        </Link>
        <ChevronLeft className="h-4 w-4 text-gray-600" />
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>الطلبات</span>
        </Link>
        <ChevronLeft className="h-4 w-4 text-gray-600" />
        <span className="flex items-center gap-1 text-white font-medium">
          <Hash className="h-4 w-4" />
          {formatId(order._id)}
        </span>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🎨 الهيدر الرئيسي */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* معلومات الطلب */}
        <div className="flex items-start gap-4">
          {/* أيقونة الطلب */}
          <div className="relative">
            <div className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${statusConfig.gradient} border ${statusConfig.border} shadow-lg`}>
              <ShoppingBag className={`h-7 w-7 sm:h-8 sm:w-8 ${statusConfig.color}`} />
            </div>
            {/* مؤشر الحالة */}
            <div className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full ${statusConfig.bg} border-2 border-gray-900`}>
              <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.color}`} />
            </div>
          </div>

          {/* تفاصيل الطلب */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                طلب #{formatId(order._id)}
              </h1>
              {/* شارة الحالة */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {statusConfig.label}
              </span>
            </div>

            {/* معلومات إضافية */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDateTime(order.createdAt).dateTime}
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-1.5">
                <Package className="h-4 w-4" />
                {order.items?.length || 0} منتجات
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className={`flex items-center gap-1.5 ${statusConfig.color}`}>
                <StatusIcon className="h-4 w-4" />
                {statusConfig.description}
              </span>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex flex-wrap items-center gap-2">
          {/* زر الرجوع */}
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gray-800/80 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white border border-gray-700/50 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">رجوع</span>
          </Link>

          {/* زر التحديث */}
          <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gray-800/80 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white border border-gray-700/50 transition-all duration-300 group">
            <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          {/* زر الطباعة */}
          <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gray-800/80 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white border border-gray-700/50 transition-all duration-300">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">طباعة</span>
          </button>

          {/* زر التحميل */}
          <button className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gray-800/80 text-gray-300 text-sm font-medium hover:bg-gray-700 hover:text-white border border-gray-700/50 transition-all duration-300">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📊 بطاقات الحالة السريعة */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* حالة الطلب */}
        <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border ${statusConfig.border} transition-all duration-300 hover:scale-[1.02]`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${statusConfig.bg}`}>
              <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-1">حالة الطلب</p>
          <p className={`text-lg font-bold ${statusConfig.color}`}>
            {statusConfig.label}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {statusConfig.description}
          </p>
        </div>

        {/* حالة الدفع */}
        <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border ${order.isPaid ? 'border-emerald-500/30' : 'border-amber-500/30'} transition-all duration-300 hover:scale-[1.02]`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${order.isPaid ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
              <CreditCard className={`h-5 w-5 ${order.isPaid ? 'text-emerald-400' : 'text-amber-400'}`} />
            </div>
            {order.isPaid ? (
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-400" />
            )}
          </div>
          <p className="text-xs text-gray-400 mb-1">حالة الدفع</p>
          <p className={`text-lg font-bold ${order.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
            {order.isPaid ? 'تم الدفع' : 'غير مدفوع'}
          </p>
          {order.isPaid && order.paidAt && (
            <p className="text-xs text-gray-500 mt-1">
              {formatDateTime(order.paidAt).dateTime}
            </p>
          )}
        </div>

        {/* حالة التوصيل */}
        <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border ${order.isDelivered ? 'border-emerald-500/30' : 'border-blue-500/30'} transition-all duration-300 hover:scale-[1.02]`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${order.isDelivered ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
              <Truck className={`h-5 w-5 ${order.isDelivered ? 'text-emerald-400' : 'text-blue-400'}`} />
            </div>
            {order.isDelivered ? (
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            ) : (
              <Clock className="h-5 w-5 text-blue-400" />
            )}
          </div>
          <p className="text-xs text-gray-400 mb-1">حالة التوصيل</p>
          <p className={`text-lg font-bold ${order.isDelivered ? 'text-emerald-400' : 'text-blue-400'}`}>
            {order.isDelivered ? 'تم التوصيل' : 'قيد التوصيل'}
          </p>
          {order.isDelivered && order.deliveredAt && (
            <p className="text-xs text-gray-500 mt-1">
              {formatDateTime(order.deliveredAt).dateTime}
            </p>
          )}
        </div>

        {/* إجمالي الطلب */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-cyan-500/30 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
              <Package className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-1">إجمالي الطلب</p>
          <p className="text-lg font-bold text-cyan-400">
            {order.totalPrice?.toFixed(2)} ر.س
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {order.paymentMethod || 'غير محدد'}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📦 محتوى تفاصيل الطلب */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <OrderDetailsForm 
        order={order} 
        isAdmin={isAdmin} 
        currentStatus={currentStatus}
      />
    </div>
  )
}

export default AdminOrderDetailsPage