// app/[locale]/admin/products/[id]/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getProductById } from '@/lib/actions/product.actions'
import ProductForm from '../product-form'
import { formatDateTime, formatId } from '@/lib/utils'
import {
  Package,
  ChevronLeft,
  Home,
  Edit3,
  Eye,
  ExternalLink,
  Calendar,
  Star,
  ShoppingCart,
  Boxes,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  ImageIcon,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'تعديل المنتج | لوحة التحكم',
  description: 'تعديل معلومات المنتج',
}

// ═══════════════════════════════════════════════════════════════
// 📋 تعريف الأنواع
// ═══════════════════════════════════════════════════════════════
type UpdateProductProps = {
  params: Promise<{
    id: string
  }>
}

// ═══════════════════════════════════════════════════════════════
// 🧭 مكون شريط التنقل (Breadcrumb)
// ═══════════════════════════════════════════════════════════════
function Breadcrumb({ productName }: { productName: string }) {
  const items = [
    { label: 'لوحة التحكم', href: '/admin/overview', icon: Home },
    { label: 'المنتجات', href: '/admin/products', icon: Package },
    { label: productName, href: '#', icon: Edit3, active: true },
  ]

  return (
    <nav className="flex items-center gap-1 text-sm flex-wrap">
      {items.map((item, index) => {
        const Icon = item.icon
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
            
            {isLast ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20 max-w-[200px]">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </span>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════════
// 📊 مكون بطاقة الإحصائية
// ═══════════════════════════════════════════════════════════════
function StatCard({
  icon: Icon,
  label,
  value,
  color,
  subValue,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color: 'emerald' | 'blue' | 'amber' | 'violet' | 'red' | 'gray'
  subValue?: string
}) {
  const colors = {
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400',
      value: 'text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: 'text-blue-400',
      value: 'text-blue-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
      value: 'text-amber-400',
    },
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      icon: 'text-violet-400',
      value: 'text-violet-400',
    },
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      icon: 'text-red-400',
      value: 'text-red-400',
    },
    gray: {
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/20',
      icon: 'text-gray-400',
      value: 'text-gray-400',
    },
  }

  return (
    <div className={`rounded-xl ${colors[color].bg} border ${colors[color].border} p-3 sm:p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${colors[color].icon}`} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className={`text-lg sm:text-xl font-bold ${colors[color].value}`}>
        {value}
      </p>
      {subValue && (
        <p className="text-xs text-gray-500 mt-1">{subValue}</p>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════════════════════════════
const UpdateProduct = async (props: UpdateProductProps) => {
  const params = await props.params
  const { id } = params

  // التحقق من الصلاحيات
  const session = await auth()

  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=/admin/products/${id}`)
  }

  if (session.user.role !== 'Admin') {
    redirect('/admin/overview')
  }

  // جلب بيانات المنتج
  const product = await getProductById(id)
  
  if (!product) {
    notFound()
  }

  // تحديد لون المخزون
  const getStockColor = (count: number) => {
    if (count === 0) return 'red'
    if (count < 10) return 'amber'
    return 'emerald'
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════ الهيدر ═══════════════ */}
      <div className="flex flex-col gap-4">
        {/* شريط التنقل والإجراءات */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb productName={product.name} />
          
          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-2">
            {/* معاينة المنتج */}
            <Link
              href={`/product/${product.slug}`}
              target="_blank"
              className="flex items-center gap-2 h-9 px-3 sm:px-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all text-sm font-medium"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">معاينة</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            {/* رجوع للقائمة */}
            <Link
              href="/admin/products"
              className="flex items-center gap-2 h-9 px-3 sm:px-4 rounded-xl bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-800 transition-all text-sm font-medium"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">كل المنتجات</span>
            </Link>
          </div>
        </div>

        {/* بطاقة معلومات المنتج السريعة */}
        <div className="rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* صورة المنتج */}
            <div className="relative shrink-0 h-24 w-24 sm:h-28 sm:w-28 rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50 mx-auto sm:mx-0">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-gray-600" />
                </div>
              )}
              
              {/* شارة الحالة */}
              <div className="absolute top-2 right-2">
                {product.isPublished ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 shadow-lg">
                    <XCircle className="h-4 w-4 text-white" />
                  </span>
                )}
              </div>
            </div>

            {/* معلومات المنتج */}
            <div className="flex-1 text-center sm:text-right">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {product.name}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {/* الفئة */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 text-xs font-medium border border-violet-500/20">
                      <Tag className="h-3 w-3" />
                      {product.category}
                    </span>
                    {/* العلامة التجارية */}
                    {product.brand && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-700/50 text-gray-300 text-xs font-medium">
                        {product.brand}
                      </span>
                    )}
                  </div>
                </div>

                {/* السعر */}
                <div className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                    {product.price} <span className="text-sm text-gray-500">ر.س</span>
                  </p>
                  {product.listPrice > product.price && (
                    <p className="text-sm text-gray-500 line-through">
                      {product.listPrice} ر.س
                    </p>
                  )}
                </div>
              </div>

              {/* معرف المنتج وتاريخ الإنشاء */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="text-gray-600">ID:</span>
                  <code className="font-mono text-gray-400">{formatId(product._id)}</code>
                </span>
                <span className="text-gray-700">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  آخر تحديث: {formatDateTime(product.updatedAt).dateOnly}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ بطاقات الإحصائيات ═══════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* المخزون */}
        <StatCard
          icon={Boxes}
          label="المخزون"
          value={`${product.countInStock} قطعة`}
          color={getStockColor(product.countInStock)}
          subValue={product.countInStock === 0 ? 'نفذت الكمية!' : undefined}
        />

        {/* المبيعات */}
        <StatCard
          icon={ShoppingCart}
          label="المبيعات"
          value={product.numSales || 0}
          color="blue"
          subValue="إجمالي الطلبات"
        />

        {/* التقييم */}
        <StatCard
          icon={Star}
          label="التقييم"
          value={product.avgRating?.toFixed(1) || '0.0'}
          color="amber"
          subValue={`${product.numReviews || 0} تقييم`}
        />

        {/* الحالة */}
        <StatCard
          icon={product.isPublished ? TrendingUp : AlertTriangle}
          label="الحالة"
          value={product.isPublished ? 'منشور' : 'مسودة'}
          color={product.isPublished ? 'emerald' : 'gray'}
          subValue={product.isPublished ? 'مرئي للعملاء' : 'غير مرئي'}
        />
      </div>

      {/* ═══════════════ تاريخ الإنشاء والتحديث ═══════════════ */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 p-3 rounded-xl bg-gray-800/20 border border-gray-700/30">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-500">تاريخ الإنشاء:</span>
          <span className="text-gray-300 font-medium">
            {formatDateTime(product.createdAt).dateTime}
          </span>
        </div>
        <span className="hidden sm:block text-gray-700">|</span>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-gray-500">آخر تحديث:</span>
          <span className="text-gray-300 font-medium">
            {formatDateTime(product.updatedAt).dateTime}
          </span>
        </div>
      </div>

      {/* ═══════════════ نموذج التعديل ═══════════════ */}
      <ProductForm type="Update" product={product} productId={product._id} />
    </div>
  )
}

export default UpdateProduct