// app/[locale]/admin/orders/order-list.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Eye, 
  Trash2, 
  MoreHorizontal,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  CreditCard,
  User,
  Calendar,
  Hash,
  ChevronLeft,
  ChevronRight,
  Search,
  Package,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { deleteOrder } from '@/lib/actions/order.actions'
import { formatDateTime, formatId } from '@/lib/utils'
import { IOrderList } from '@/types'
import ProductPrice from '@/components/shared/product/product-price'
import DeleteDialog from '@/components/shared/delete-dialog'

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 تعريف حالات الطلب
// ═══════════════════════════════════════════════════════════════════════════
const orderStatusConfig = {
  pending: {
    label: 'قيد الانتظار',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: Clock,
  },
  processing: {
    label: 'قيد المعالجة',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: Package,
  },
  shipped: {
    label: 'تم الشحن',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    icon: Truck,
  },
  delivered: {
    label: 'تم التوصيل',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'ملغي',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: XCircle,
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// 📋 مكون بطاقة الطلب للموبايل
// ═══════════════════════════════════════════════════════════════════════════
function OrderCard({ order }: { order: IOrderList }) {
  const [showActions, setShowActions] = useState(false)
  
  const getPaymentStatus = () => {
    if (order.isPaid && order.paidAt) {
      return {
        label: 'مدفوع',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        icon: CheckCircle,
      }
    }
    return {
      label: 'غير مدفوع',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      icon: AlertCircle,
    }
  }

  const getDeliveryStatus = () => {
    if (order.isDelivered && order.deliveredAt) {
      return {
        label: 'تم التوصيل',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        icon: CheckCircle,
      }
    }
    return {
      label: 'لم يتم التوصيل',
      color: 'text-gray-400',
      bg: 'bg-gray-500/10',
      icon: Truck,
    }
  }

  const paymentStatus = getPaymentStatus()
  const deliveryStatus = getDeliveryStatus()

  return (
    <div className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300">
      {/* الهيدر */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Hash className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{formatId(order._id)}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDateTime(order.createdAt!).dateTime}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowActions(!showActions)}
          className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* معلومات الطلب */}
      <div className="p-4 space-y-3">
        {/* العميل */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">العميل</p>
            <p className="text-sm font-medium text-white">
              {order.user ? order.user.name : 'مستخدم محذوف'}
            </p>
          </div>
        </div>

        {/* المبلغ */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <CreditCard className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">المبلغ الإجمالي</p>
            <p className="text-sm font-bold text-emerald-400">
              <ProductPrice price={order.totalPrice} plain />
            </p>
          </div>
        </div>

        {/* حالة الدفع والتوصيل */}
        <div className="flex items-center gap-2 pt-2">
          {/* حالة الدفع */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${paymentStatus.bg} border ${paymentStatus.color.replace('text', 'border')}/30`}>
            <paymentStatus.icon className={`h-3.5 w-3.5 ${paymentStatus.color}`} />
            <span className={`text-xs font-medium ${paymentStatus.color}`}>
              {paymentStatus.label}
            </span>
          </div>

          {/* حالة التوصيل */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${deliveryStatus.bg} border ${deliveryStatus.color.replace('text', 'border')}/30`}>
            <deliveryStatus.icon className={`h-3.5 w-3.5 ${deliveryStatus.color}`} />
            <span className={`text-xs font-medium ${deliveryStatus.color}`}>
              {deliveryStatus.label}
            </span>
          </div>
        </div>
      </div>

      {/* الإجراءات */}
      <div className="flex items-center gap-2 p-4 pt-0">
        <Link
          href={`/admin/orders/${order._id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 hover:bg-blue-500/20 transition-all"
        >
          <Eye className="h-4 w-4" />
          عرض التفاصيل
        </Link>
        <DeleteDialog 
          id={order._id} 
          action={deleteOrder}
        />
      </div>

      {/* قائمة الإجراءات المنسدلة */}
      {showActions && (
        <div className="absolute top-16 left-4 z-50 w-48 bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <Link
            href={`/admin/orders/${order._id}`}
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
          >
            <Eye className="h-4 w-4" />
            عرض التفاصيل
          </Link>
          <button className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            <Trash2 className="h-4 w-4" />
            حذف الطلب
          </button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 مكون قائمة الطلبات الرئيسي
// ═══════════════════════════════════════════════════════════════════════════
interface OrderListProps {
  orders: IOrderList[]
  totalPages: number
  currentPage: string
}

export default function OrderList({ orders, totalPages, currentPage }: OrderListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const getPaymentBadge = (order: IOrderList) => {
    if (order.isPaid && order.paidAt) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">
            {formatDateTime(order.paidAt).dateTime}
          </span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-xs font-medium text-amber-400">غير مدفوع</span>
      </div>
    )
  }

  const getDeliveryBadge = (order: IOrderList) => {
    if (order.isDelivered && order.deliveredAt) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">
            {formatDateTime(order.deliveredAt).dateTime}
          </span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-500/10 border border-gray-500/20">
        <Truck className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-xs font-medium text-gray-400">لم يتم التوصيل</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* ═══════════════ شريط البحث ═══════════════ */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="البحث برقم الطلب أو اسم العميل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-gray-800/50 text-white text-sm placeholder:text-gray-500 border border-gray-700/50 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              تم تحديد {selectedOrders.length} طلب
            </span>
            <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20 transition-colors">
              حذف المحدد
            </button>
          </div>
        )}
      </div>

      {/* ═══════════════ عرض الموبايل (البطاقات) ═══════════════ */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* ═══════════════ عرض الديسكتوب (الجدول) ═══════════════ */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-700/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* رأس الجدول */}
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-700/50">
                <th className="px-4 py-4 text-right">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/20"
                  />
                </th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  رقم الطلب
                </th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  حالة الدفع
                </th>
                <th className="px-4 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  حالة التوصيل
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>

            {/* محتوى الجدول */}
            <tbody className="divide-y divide-gray-700/30">
              {orders.map((order, index) => (
                <tr 
                  key={order._id}
                  className="group bg-gray-800/20 hover:bg-gray-800/40 transition-colors"
                >
                  {/* Checkbox */}
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order._id])
                        } else {
                          setSelectedOrders(selectedOrders.filter(id => id !== order._id))
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500/20"
                    />
                  </td>

                  {/* رقم الطلب */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                        <Hash className="h-3.5 w-3.5 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {formatId(order._id)}
                      </span>
                    </div>
                  </td>

                  {/* التاريخ */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDateTime(order.createdAt!).dateTime}
                    </div>
                  </td>

                  {/* العميل */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20">
                        <User className="h-4 w-4 text-violet-400" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        {order.user ? order.user.name : 'مستخدم محذوف'}
                      </span>
                    </div>
                  </td>

                  {/* المبلغ */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-bold text-emerald-400">
                      <ProductPrice price={order.totalPrice} plain />
                    </span>
                  </td>

                  {/* حالة الدفع */}
                  <td className="px-4 py-4">
                    {getPaymentBadge(order)}
                  </td>

                  {/* حالة التوصيل */}
                  <td className="px-4 py-4">
                    {getDeliveryBadge(order)}
                  </td>

                  {/* الإجراءات */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        التفاصيل
                      </Link>
                      <DeleteDialog id={order._id} action={deleteOrder} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════ حالة عدم وجود طلبات ═══════════════ */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-800/50 mb-4">
            <Package className="h-10 w-10 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            لا توجد طلبات
          </h3>
          <p className="text-sm text-gray-400 max-w-sm">
            لم يتم العثور على أي طلبات. ستظهر الطلبات هنا عندما يقوم العملاء بالشراء.
          </p>
        </div>
      )}

      {/* ═══════════════ التنقل بين الصفحات ═══════════════ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <p className="text-sm text-gray-400">
            الصفحة {currentPage} من {totalPages}
          </p>
          
          <div className="flex items-center gap-2">
            <Link
              href={`?page=${Math.max(1, parseInt(currentPage) - 1)}`}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                parseInt(currentPage) === 1
                  ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Link>

            {/* أرقام الصفحات */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <Link
                    key={pageNum}
                    href={`?page=${pageNum}`}
                    className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                      parseInt(currentPage) === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </Link>
                )
              })}
            </div>

            <Link
              href={`?page=${Math.min(totalPages, parseInt(currentPage) + 1)}`}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                parseInt(currentPage) === totalPages
                  ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              التالي
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}