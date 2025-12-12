// app/[locale]/admin/orders/[id]/order-details-form.tsx
'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  User,
  MapPin,
  Phone,
  Mail,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Hash,
  ShoppingBag,
  Receipt,
  Percent,
  DollarSign,
  Tag,
  Box,
  Calendar,
  MessageSquare,
  Send,
  Copy,
  Check,
  XCircle,
  Hourglass,
  PackageCheck,
  Settings,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Ban,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from 'lucide-react'
import { formatDateTime, formatId } from '@/lib/utils'
import {
  deliverOrder,
  updateOrderToPaid,
  updateOrderStatus,
} from '@/lib/actions/order.actions'
import { useToast } from '@/hooks/use-toast'
import ProductPrice from '@/components/shared/product/product-price'

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
    gradient: 'from-amber-500 to-orange-500',
    gradientBg: 'from-amber-500/20 to-orange-500/20',
    icon: Hourglass,
    description: 'الطلب في انتظار المراجعة',
    nextStatus: 'processing',
  },
  processing: {
    label: 'قيد التحضير',
    labelEn: 'Processing',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    gradient: 'from-blue-500 to-cyan-500',
    gradientBg: 'from-blue-500/20 to-cyan-500/20',
    icon: Package,
    description: 'جاري تحضير الطلب للشحن',
    nextStatus: 'shipped',
  },
  shipped: {
    label: 'تم الشحن',
    labelEn: 'Shipped',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    gradient: 'from-violet-500 to-purple-500',
    gradientBg: 'from-violet-500/20 to-purple-500/20',
    icon: Truck,
    description: 'الطلب في الطريق للعميل',
    nextStatus: 'delivered',
  },
  delivered: {
    label: 'تم التوصيل',
    labelEn: 'Delivered',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-500 to-green-500',
    gradientBg: 'from-emerald-500/20 to-green-500/20',
    icon: PackageCheck,
    description: 'تم توصيل الطلب بنجاح',
    nextStatus: 'completed',
  },
  completed: {
    label: 'مكتمل',
    labelEn: 'Completed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-500 to-teal-500',
    gradientBg: 'from-emerald-500/20 to-teal-500/20',
    icon: CheckCircle,
    description: 'الطلب مكتمل بالكامل',
    nextStatus: null,
  },
  cancelled: {
    label: 'ملغي',
    labelEn: 'Cancelled',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    gradient: 'from-red-500 to-rose-500',
    gradientBg: 'from-red-500/20 to-rose-500/20',
    icon: XCircle,
    description: 'تم إلغاء الطلب',
    nextStatus: null,
  },
  rejected: {
    label: 'مرفوض',
    labelEn: 'Rejected',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    gradient: 'from-red-500 to-pink-500',
    gradientBg: 'from-red-500/20 to-pink-500/20',
    icon: Ban,
    description: 'تم رفض الطلب',
    nextStatus: null,
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 أنواع البيانات
// ═══════════════════════════════════════════════════════════════════════════
interface OrderDetailsFormProps {
  order: any
  isAdmin: boolean
  currentStatus: string
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 مكون أزرار تغيير الحالة
// ═══════════════════════════════════════════════════════════════════════════
function StatusActionButtons({ 
  currentStatus, 
  onStatusChange, 
  isPending 
}: { 
  currentStatus: string
  onStatusChange: (status: string) => void
  isPending: boolean 
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null)

  const statusButtons = [
    {
      status: 'pending',
      label: 'جاري الانتظار',
      icon: Hourglass,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-500',
      hoverGradient: 'hover:from-amber-600 hover:to-orange-600',
      shadow: 'shadow-amber-500/25 hover:shadow-amber-500/40',
      description: 'إرجاع الطلب للانتظار',
    },
    {
      status: 'processing',
      label: 'قيد التحضير',
      icon: Package,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'hover:from-blue-600 hover:to-cyan-600',
      shadow: 'shadow-blue-500/25 hover:shadow-blue-500/40',
      description: 'بدء تحضير الطلب',
    },
    {
      status: 'shipped',
      label: 'تم الشحن',
      icon: Truck,
      color: 'violet',
      gradient: 'from-violet-500 to-purple-500',
      hoverGradient: 'hover:from-violet-600 hover:to-purple-600',
      shadow: 'shadow-violet-500/25 hover:shadow-violet-500/40',
      description: 'الطلب في الطريق',
    },
    {
      status: 'completed',
      label: 'مكتمل',
      icon: CheckCircle,
      color: 'emerald',
      gradient: 'from-emerald-500 to-green-500',
      hoverGradient: 'hover:from-emerald-600 hover:to-green-600',
      shadow: 'shadow-emerald-500/25 hover:shadow-emerald-500/40',
      description: 'إكمال الطلب بنجاح',
    },
    {
      status: 'rejected',
      label: 'رفض',
      icon: XCircle,
      color: 'red',
      gradient: 'from-red-500 to-rose-500',
      hoverGradient: 'hover:from-red-600 hover:to-rose-600',
      shadow: 'shadow-red-500/25 hover:shadow-red-500/40',
      description: 'رفض الطلب',
      isDanger: true,
    },
  ]

  const handleStatusClick = (status: string, isDanger?: boolean) => {
    if (isDanger) {
      setShowConfirmDialog(status)
    } else {
      onStatusChange(status)
    }
  }

  const confirmStatusChange = () => {
    if (showConfirmDialog) {
      onStatusChange(showConfirmDialog)
      setShowConfirmDialog(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* ═══════════════ أزرار الحالات الرئيسية ═══════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statusButtons.map((btn) => {
          const Icon = btn.icon
          const isActive = currentStatus === btn.status
          const isDisabled = isPending || isActive

          return (
            <button
              key={btn.status}
              onClick={() => handleStatusClick(btn.status, btn.isDanger)}
              disabled={isDisabled}
              className={`
                group relative flex flex-col items-center gap-2 p-4 rounded-2xl
                transition-all duration-300
                ${isActive 
                  ? `bg-gradient-to-br ${btn.gradient} text-white shadow-lg ${btn.shadow}` 
                  : btn.isDanger
                    ? 'bg-gray-800/50 text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-gray-700/50 hover:border-red-500/30'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600'
                }
                ${isDisabled && !isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${!isDisabled && !isActive ? 'hover:scale-[1.02] active:scale-[0.98]' : ''}
              `}
            >
              {/* مؤشر الحالة النشطة */}
              {isActive && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                  <span className="absolute h-full w-full rounded-full bg-white/30 animate-ping" />
                  <CheckCircle className="relative h-4 w-4 text-white" />
                </div>
              )}

              {/* الأيقونة */}
              <div className={`
                flex h-12 w-12 items-center justify-center rounded-xl
                transition-all duration-300
                ${isActive 
                  ? 'bg-white/20' 
                  : btn.isDanger
                    ? 'bg-red-500/10 group-hover:bg-red-500/20'
                    : 'bg-gray-700/50 group-hover:bg-gray-700'
                }
              `}>
                {isPending && currentStatus !== btn.status ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                )}
              </div>

              {/* التسمية */}
              <span className={`text-sm font-semibold ${isActive ? 'text-white' : ''}`}>
                {btn.label}
              </span>

              {/* الوصف */}
              <span className={`text-xs text-center ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                {btn.description}
              </span>
            </button>
          )
        })}
      </div>

      {/* ═══════════════ مربع تأكيد الرفض ═══════════════ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gray-800 border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* هيدر */}
            <div className="p-6 text-center border-b border-gray-700/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                تأكيد رفض الطلب
              </h3>
              <p className="text-gray-400 text-sm">
                هل أنت متأكد من رفض هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>

            {/* سبب الرفض */}
            <div className="p-6 border-b border-gray-700/50">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                سبب الرفض (اختياري)
              </label>
              <textarea
                placeholder="أدخل سبب رفض الطلب..."
                className="w-full h-24 px-4 py-3 rounded-xl bg-gray-700/50 text-white text-sm placeholder:text-gray-500 border border-gray-600 focus:border-red-500/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none transition-all"
              />
            </div>

            {/* الأزرار */}
            <div className="flex gap-3 p-6">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-700 text-gray-300 font-medium hover:bg-gray-600 hover:text-white transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                إلغاء
              </button>
              <button
                onClick={confirmStatusChange}
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold hover:from-red-600 hover:to-rose-600 shadow-lg shadow-red-500/25 transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                تأكيد الرفض
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 مكون شريط تقدم الحالة
// ═══════════════════════════════════════════════════════════════════════════
function OrderProgressBar({ currentStatus }: { currentStatus: string }) {
  const steps = [
    { status: 'pending', label: 'الانتظار', icon: Hourglass },
    { status: 'processing', label: 'التحضير', icon: Package },
    { status: 'shipped', label: 'الشحن', icon: Truck },
    { status: 'delivered', label: 'التوصيل', icon: PackageCheck },
    { status: 'completed', label: 'مكتمل', icon: CheckCircle },
  ]

  const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'completed']
  const currentIndex = statusOrder.indexOf(currentStatus)
  const isRejected = currentStatus === 'rejected' || currentStatus === 'cancelled'

  if (isRejected) {
    return (
      <div className="flex items-center justify-center p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <XCircle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-red-400">
              {currentStatus === 'rejected' ? 'تم رفض الطلب' : 'تم إلغاء الطلب'}
            </p>
            <p className="text-sm text-gray-400">لا يمكن متابعة هذا الطلب</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* الخط الخلفي */}
      <div className="absolute top-6 right-6 left-6 h-1 bg-gray-700/50 rounded-full" />
      
      {/* الخط المتقدم */}
      <div 
        className="absolute top-6 right-6 h-1 bg-gradient-to-l from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
      />

      {/* الخطوات */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={step.status} className="flex flex-col items-center">
              {/* الدائرة */}
              <div className={`
                relative flex h-12 w-12 items-center justify-center rounded-full
                transition-all duration-500
                ${isCompleted 
                  ? 'bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30' 
                  : 'bg-gray-800 border-2 border-gray-700'
                }
                ${isCurrent ? 'ring-4 ring-emerald-500/20' : ''}
              `}>
                <Icon className={`h-5 w-5 ${isCompleted ? 'text-white' : 'text-gray-500'}`} />
                
                {/* مؤشر الحالة الحالية */}
                {isCurrent && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500" />
                  </span>
                )}
              </div>

              {/* التسمية */}
              <span className={`
                mt-2 text-xs font-medium
                ${isCompleted ? 'text-emerald-400' : 'text-gray-500'}
              `}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 مكون تفاصيل الطلب الكامل
// ═══════════════════════════════════════════════════════════════════════════
export default function OrderDetailsForm({ order, isAdmin, currentStatus }: OrderDetailsFormProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    customer: true,
    shipping: true,
    items: true,
    summary: true,
    timeline: true,
    notes: false,
  })

  const statusConfig = orderStatusConfig[currentStatus as keyof typeof orderStatusConfig] || orderStatusConfig.pending

  // نسخ النص
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ النص بنجاح',
    })
  }

  // تبديل القسم
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // تحديث حالة الطلب
  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      try {
        const res = await updateOrderStatus(order._id, newStatus)
        if (!res.success) {
          toast({
            title: 'خطأ',
            description: res.message || 'حدث خطأ أثناء تحديث الحالة',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'تم بنجاح ✓',
            description: `تم تحديث حالة الطلب إلى "${orderStatusConfig[newStatus as keyof typeof orderStatusConfig]?.label || newStatus}"`,
          })
        }
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'حدث خطأ غير متوقع',
          variant: 'destructive',
        })
      }
    })
  }

  // تحديث حالة الدفع
  const handleMarkAsPaid = () => {
    startTransition(async () => {
      const res = await updateOrderToPaid(order._id)
      if (!res.success) {
        toast({
          title: 'خطأ',
          description: res.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'تم بنجاح',
          description: 'تم تحديث حالة الدفع',
        })
      }
    })
  }

  // تحديث حالة التوصيل
  const handleMarkAsDelivered = () => {
    startTransition(async () => {
      const res = await deliverOrder(order._id)
      if (!res.success) {
        toast({
          title: 'خطأ',
          description: res.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'تم بنجاح',
          description: 'تم تحديث حالة التوصيل',
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🎮 قسم إدارة الحالة (للمدير فقط) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isAdmin && (
        <div className="rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 overflow-hidden">
          {/* هيدر القسم */}
          <button
            onClick={() => toggleSection('status')}
            className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-800/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${statusConfig.gradientBg} border ${statusConfig.border}`}>
                <Settings className={`h-5 w-5 ${statusConfig.color}`} />
              </div>
              <div className="text-right">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  إدارة حالة الطلب
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                    {statusConfig.label}
                  </span>
                </h3>
                <p className="text-xs text-gray-400">تغيير حالة الطلب ومتابعة التقدم</p>
              </div>
            </div>
            {expandedSections.status ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {/* محتوى القسم */}
          {expandedSections.status && (
            <div className="p-4 sm:p-6 pt-0 border-t border-gray-700/30 space-y-6">
              {/* شريط التقدم */}
              <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
                <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  تقدم الطلب
                </h4>
                <OrderProgressBar currentStatus={currentStatus} />
              </div>

              {/* أزرار تغيير الحالة */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-violet-400" />
                  تغيير حالة الطلب
                </h4>
                <StatusActionButtons
                  currentStatus={currentStatus}
                  onStatusChange={handleStatusChange}
                  isPending={isPending}
                />
              </div>

              {/* أزرار الدفع والتوصيل السريعة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-700/30">
                {/* زر تحديث حالة الدفع */}
                {!order.isPaid && (
                  <button
                    onClick={handleMarkAsPaid}
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-400 font-medium border border-emerald-500/20 hover:from-emerald-500/20 hover:to-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <CreditCard className="h-5 w-5" />
                    )}
                    تأكيد الدفع
                  </button>
                )}

                {/* زر تحديث حالة التوصيل */}
                {order.isPaid && !order.isDelivered && (
                  <button
                    onClick={handleMarkAsDelivered}
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-400 font-medium border border-blue-500/20 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Truck className="h-5 w-5" />
                    )}
                    تأكيد التوصيل
                  </button>
                )}

                {/* حالة مكتملة */}
                {order.isPaid && order.isDelivered && (
                  <div className="sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">تم الدفع والتوصيل بنجاح</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 📋 باقي المحتوى - Grid Layout */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📋 العمود الرئيسي (2/3) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="xl:col-span-2 space-y-6">
          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* 👤 معلومات العميل */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 overflow-hidden">
            {/* هيدر القسم */}
            <button
              onClick={() => toggleSection('customer')}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <User className="h-5 w-5 text-violet-400" />
                </div>
                <div className="text-right">
                  <h3 className="text-base font-semibold text-white">معلومات العميل</h3>
                  <p className="text-xs text-gray-400">بيانات المشتري وطريقة التواصل</p>
                </div>
              </div>
              {expandedSections.customer ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {/* محتوى القسم */}
            {expandedSections.customer && (
              <div className="p-4 sm:p-5 pt-0 border-t border-gray-700/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* الاسم */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-700/50">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">الاسم الكامل</p>
                      <p className="text-sm font-medium text-white truncate">
                        {order.user?.name || order.shippingAddress?.fullName || 'غير محدد'}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(order.user?.name || '', 'name')}
                      className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      {copiedField === 'name' ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {/* البريد الإلكتروني */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-700/50">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                      <p className="text-sm font-medium text-white truncate">
                        {order.user?.email || 'غير محدد'}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(order.user?.email || '', 'email')}
                      className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      {copiedField === 'email' ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {/* رقم الهاتف */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-700/50">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">رقم الهاتف</p>
                      <p className="text-sm font-medium text-white truncate" dir="ltr">
                        {order.shippingAddress?.phone || 'غير محدد'}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(order.shippingAddress?.phone || '', 'phone')}
                      className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {/* رابط الملف الشخصي */}
                  {order.user && (
                    <Link
                      href={`/admin/users/${order.user._id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/5 border border-violet-500/20 hover:bg-violet-500/10 transition-colors group"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                        <ExternalLink className="h-4 w-4 text-violet-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-violet-400 group-hover:text-violet-300">
                          عرض ملف العميل
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* 📍 عنوان الشحن */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 overflow-hidden">
            {/* هيدر القسم */}
            <button
              onClick={() => toggleSection('shipping')}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <MapPin className="h-5 w-5 text-cyan-400" />
                </div>
                <div className="text-right">
                  <h3 className="text-base font-semibold text-white">عنوان الشحن</h3>
                  <p className="text-xs text-gray-400">موقع توصيل الطلب</p>
                </div>
              </div>
              {expandedSections.shipping ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {/* محتوى القسم */}
            {expandedSections.shipping && (
              <div className="p-4 sm:p-5 pt-0 border-t border-gray-700/30">
                {order.shippingAddress ? (
                  <div className="space-y-4">
                    {/* العنوان الكامل */}
                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/30">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-cyan-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-white leading-relaxed">
                            {order.shippingAddress.street}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.province}
                            <br />
                            {order.shippingAddress.country} - {order.shippingAddress.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* تفاصيل العنوان */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-gray-800/20 border border-gray-700/20">
                        <p className="text-xs text-gray-500 mb-1">المدينة</p>
                        <p className="text-sm font-medium text-white">
                          {order.shippingAddress.city}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/20 border border-gray-700/20">
                        <p className="text-xs text-gray-500 mb-1">المنطقة</p>
                        <p className="text-sm font-medium text-white">
                          {order.shippingAddress.province}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/20 border border-gray-700/20">
                        <p className="text-xs text-gray-500 mb-1">الدولة</p>
                        <p className="text-sm font-medium text-white">
                          {order.shippingAddress.country}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gray-800/20 border border-gray-700/20">
                        <p className="text-xs text-gray-500 mb-1">الرمز البريدي</p>
                        <p className="text-sm font-medium text-white">
                          {order.shippingAddress.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">لا يوجد عنوان شحن</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* 📦 منتجات الطلب */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 overflow-hidden">
            {/* هيدر القسم */}
            <button
              onClick={() => toggleSection('items')}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <ShoppingBag className="h-5 w-5 text-amber-400" />
                </div>
                <div className="text-right">
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    منتجات الطلب
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                      {order.items?.length || 0}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">قائمة المنتجات المطلوبة</p>
                </div>
              </div>
              {expandedSections.items ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {/* محتوى القسم */}
            {expandedSections.items && (
              <div className="p-4 sm:p-5 pt-0 border-t border-gray-700/30">
                <div className="space-y-3">
                  {order.items?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/50 transition-colors"
                    >
                      {/* صورة المنتج */}
                      <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-gray-700/50 flex-shrink-0">
                        <Image
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* تفاصيل المنتج */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/admin/products/${item.product}`}
                          className="text-sm font-medium text-white hover:text-blue-400 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {item.color && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-700/50 text-xs text-gray-300">
                              <span
                                className="h-3 w-3 rounded-full border border-gray-600"
                                style={{ backgroundColor: item.color }}
                              />
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="px-2 py-0.5 rounded-md bg-gray-700/50 text-xs text-gray-300">
                              {item.size}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          الكمية: <span className="text-white font-medium">{item.quantity}</span>
                        </p>
                      </div>

                      {/* السعر */}
                      <div className="text-left flex-shrink-0">
                        <p className="text-sm font-bold text-emerald-400">
                          <ProductPrice price={item.price * item.quantity} plain />
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📊 العمود الجانبي (1/3) */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* 💰 ملخص الطلب */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 overflow-hidden sticky top-4">
            {/* هيدر */}
            <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-gray-700/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Receipt className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">ملخص الطلب</h3>
                <p className="text-xs text-gray-400">تفاصيل المبالغ</p>
              </div>
            </div>

            {/* المحتوى */}
            <div className="p-4 sm:p-5 space-y-3">
              {/* المجموع الفرعي */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Box className="h-4 w-4" />
                  المجموع الفرعي
                </span>
                <span className="text-sm font-medium text-white">
                  {order.itemsPrice?.toFixed(2)} ر.س
                </span>
              </div>

              {/* الشحن */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  رسوم الشحن
                </span>
                <span className="text-sm font-medium text-white">
                  {order.shippingPrice?.toFixed(2)} ر.س
                </span>
              </div>

              {/* الضريبة */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  الضريبة
                </span>
                <span className="text-sm font-medium text-white">
                  {order.taxPrice?.toFixed(2)} ر.س
                </span>
              </div>

              {/* الخصم */}
              {order.discount > 0 && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-emerald-400 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    الخصم
                  </span>
                  <span className="text-sm font-medium text-emerald-400">
                    -{order.discount?.toFixed(2)} ر.س
                  </span>
                </div>
              )}

              {/* الخط الفاصل */}
              <div className="border-t border-gray-700/50 my-3" />

              {/* الإجمالي */}
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                <span className="text-base font-semibold text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                  الإجمالي
                </span>
                <span className="text-xl font-bold text-emerald-400">
                  {order.totalPrice?.toFixed(2)} ر.س
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* 📅 الجدول الزمني للطلب */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 overflow-hidden">
            {/* هيدر */}
            <button
              onClick={() => toggleSection('timeline')}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-right">
                  <h3 className="text-base font-semibold text-white">سجل الطلب</h3>
                  <p className="text-xs text-gray-400">تتبع مراحل الطلب</p>
                </div>
              </div>
              {expandedSections.timeline ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {/* المحتوى */}
            {expandedSections.timeline && (
              <div className="p-4 sm:p-5 pt-0 border-t border-gray-700/30">
                <div className="relative space-y-4">
                  {/* الخط العمودي */}
                  <div className="absolute right-[18px] top-2 bottom-2 w-0.5 bg-gray-700/50" />

                  {/* تم إنشاء الطلب */}
                  <div className="relative flex items-start gap-4">
                    <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium text-white">تم إنشاء الطلب</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDateTime(order.createdAt).dateTime}
                      </p>
                    </div>
                  </div>

                  {/* حالة الدفع */}
                  <div className="relative flex items-start gap-4">
                    <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                      order.isPaid 
                        ? 'bg-emerald-500/10 border-emerald-500' 
                        : 'bg-gray-800 border-gray-600'
                    }`}>
                      <CreditCard className={`h-4 w-4 ${order.isPaid ? 'text-emerald-400' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-medium ${order.isPaid ? 'text-white' : 'text-gray-500'}`}>
                        {order.isPaid ? 'تم الدفع' : 'في انتظار الدفع'}
                      </p>
                      {order.isPaid && order.paidAt && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(order.paidAt).dateTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* حالة الشحن */}
                  <div className="relative flex items-start gap-4">
                    <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                      order.isPaid && !order.isDelivered
                        ? 'bg-blue-500/10 border-blue-500' 
                        : order.isDelivered
                        ? 'bg-emerald-500/10 border-emerald-500'
                        : 'bg-gray-800 border-gray-600'
                    }`}>
                      <Truck className={`h-4 w-4 ${
                        order.isPaid && !order.isDelivered
                          ? 'text-blue-400' 
                          : order.isDelivered
                          ? 'text-emerald-400'
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-medium ${
                        order.isPaid || order.isDelivered ? 'text-white' : 'text-gray-500'
                      }`}>
                        {order.isDelivered ? 'تم التوصيل' : order.isPaid ? 'قيد الشحن' : 'في انتظار الشحن'}
                      </p>
                      {order.isDelivered && order.deliveredAt && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateTime(order.deliveredAt).dateTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* حالة الطلب الحالية */}
                  <div className="relative flex items-start gap-4">
                    <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 ${statusConfig.bg} ${statusConfig.border}`}>
                      {(() => {
                        const Icon = statusConfig.icon
                        return <Icon className={`h-4 w-4 ${statusConfig.color}`} />
                      })()}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-medium ${statusConfig.color}`}>
                        {statusConfig.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {statusConfig.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* 📝 ملاحظات الطلب */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <div className="rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 overflow-hidden">
            {/* هيدر */}
            <button
              onClick={() => toggleSection('notes')}
              className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <MessageSquare className="h-5 w-5 text-violet-400" />
                </div>
                <div className="text-right">
                  <h3 className="text-base font-semibold text-white">ملاحظات</h3>
                  <p className="text-xs text-gray-400">ملاحظات داخلية</p>
                </div>
              </div>
              {expandedSections.notes ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {/* المحتوى */}
            {expandedSections.notes && (
              <div className="p-4 sm:p-5 pt-0 border-t border-gray-700/30">
                <textarea
                  placeholder="أضف ملاحظات داخلية حول هذا الطلب..."
                  className="w-full h-24 px-4 py-3 rounded-xl bg-gray-800/50 text-white text-sm placeholder:text-gray-500 border border-gray-700/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none transition-all"
                  defaultValue={order.notes || ''}
                />
                <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/10 text-violet-400 text-sm font-medium border border-violet-500/20 hover:bg-violet-500/20 transition-all">
                  <Send className="h-4 w-4" />
                  حفظ الملاحظات
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}