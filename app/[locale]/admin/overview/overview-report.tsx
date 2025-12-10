// app/[locale]/admin/overview/overview-report.tsx
'use client'

import React, { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { DateRange } from 'react-day-picker'
import {
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Eye,
  ShoppingBag,
  DollarSign,
  Package,
  RefreshCcw,
  ChevronLeft,
  ExternalLink,
  Sparkles,
  Activity,
  PieChart,
  BarChart3,
  Clock,
  User,
} from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { calculatePastDate, formatDateTime, formatNumber, cn } from '@/lib/utils'
import { getOrderSummary } from '@/lib/actions/order.actions'
import { IOrderList } from '@/types'

import SalesCategoryPieChart from './sales-category-pie-chart'
import SalesAreaChart from './sales-area-chart'
import TableChart from './table-chart'
import { CalendarDateRangePicker } from './date-range-picker'
import ProductPrice from '@/components/shared/product/product-price'

// ═══════════════════════════════════════════════════════════════
// 📊 تعريف بطاقات الإحصائيات
// ═══════════════════════════════════════════════════════════════
const statsCards = [
  {
    key: 'revenue',
    titleKey: 'Total Revenue',
    icon: DollarSign,
    gradient: 'from-emerald-500 to-green-600',
    bgGradient: 'from-emerald-500/10 to-green-600/10',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    trend: '+12.5%',
    trendUp: true,
    linkHref: '/admin/orders',
    linkTextKey: 'View revenue',
  },
  {
    key: 'sales',
    titleKey: 'Sales',
    icon: ShoppingBag,
    gradient: 'from-blue-500 to-indigo-600',
    bgGradient: 'from-blue-500/10 to-indigo-600/10',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    trend: '+8.2%',
    trendUp: true,
    linkHref: '/admin/orders',
    linkTextKey: 'View orders',
  },
  {
    key: 'customers',
    titleKey: 'Customers',
    icon: Users,
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-500/10 to-purple-600/10',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
    borderColor: 'border-violet-500/20',
    trend: '+23.1%',
    trendUp: true,
    linkHref: '/admin/users',
    linkTextKey: 'View customers',
  },
  {
    key: 'products',
    titleKey: 'Products',
    icon: Package,
    gradient: 'from-orange-500 to-amber-600',
    bgGradient: 'from-orange-500/10 to-amber-600/10',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400',
    borderColor: 'border-orange-500/20',
    trend: '+5.4%',
    trendUp: true,
    linkHref: '/admin/products',
    linkTextKey: 'View products',
  },
]

// ═══════════════════════════════════════════════════════════════
// 📋 تعريف نوع البيانات
// ═══════════════════════════════════════════════════════════════
interface OrderSummaryData {
  totalSales: number
  ordersCount: number
  usersCount: number
  productsCount: number
  salesChartData: Array<{ date: string; totalSales: number }>
  monthlySales: Array<{ label: string; value: number }>
  topSalesProducts: Array<{ label: string; value: number }>
  topSalesCategories: Array<{ name: string; value: number }>
  latestOrders: IOrderList[]
}

// ═══════════════════════════════════════════════════════════════
// 🎭 مكون حالة التحميل
// ═══════════════════════════════════════════════════════════════
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24 bg-gray-700" />
              <Skeleton className="h-10 w-10 rounded-xl bg-gray-700" />
            </div>
            <Skeleton className="h-8 w-32 bg-gray-700 mb-2" />
            <Skeleton className="h-3 w-20 bg-gray-700" />
          </div>
        ))}
      </div>

      {/* الرسم البياني الرئيسي */}
      <div className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6">
        <Skeleton className="h-6 w-40 bg-gray-700 mb-4" />
        <Skeleton className="h-[350px] w-full bg-gray-700 rounded-xl" />
      </div>

      {/* صفين من البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6"
          >
            <Skeleton className="h-6 w-32 bg-gray-700 mb-2" />
            <Skeleton className="h-4 w-24 bg-gray-700 mb-4" />
            <Skeleton className="h-48 w-full bg-gray-700 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-gray-800/50 border border-gray-700/50 p-6"
          >
            <Skeleton className="h-6 w-32 bg-gray-700 mb-4" />
            <Skeleton className="h-48 w-full bg-gray-700 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 📊 مكون بطاقة الإحصائية
// ═══════════════════════════════════════════════════════════════
interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  gradient: string
  bgGradient: string
  iconBg: string
  iconColor: string
  borderColor: string
  trend: string
  trendUp: boolean
  linkHref: string
  linkText: string
  isPrice?: boolean
}

function StatCard({
  title,
  value,
  icon: Icon,
  bgGradient,
  iconBg,
  iconColor,
  borderColor,
  trend,
  trendUp,
  linkHref,
  linkText,
  isPrice,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'bg-gradient-to-br',
        bgGradient,
        'border',
        borderColor,
        'p-5 sm:p-6',
        'transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20'
      )}
    >
      {/* الهيدر */}
      <div className="relative flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-400">{title}</span>
        <div
          className={cn(
            'flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl',
            iconBg,
            'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3'
          )}
        >
          <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6', iconColor)} />
        </div>
      </div>

      {/* القيمة */}
      <div className="relative mb-3">
        {isPrice ? (
          <div className="text-2xl sm:text-3xl font-bold text-white">
            <ProductPrice price={value as number} plain />
          </div>
        ) : (
          <p className="text-2xl sm:text-3xl font-bold text-white">
            {formatNumber(value as number)}
          </p>
        )}
      </div>

      {/* الترند والرابط */}
      <div className="relative flex items-center justify-between">
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
            trendUp
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          )}
        >
          {trendUp ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{trend}</span>
        </div>

        <Link
          href={linkHref}
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            iconColor,
            'hover:underline underline-offset-2 transition-colors'
          )}
        >
          <span>{linkText}</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎨 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════
export default function OverviewReport() {
  const t = useTranslations('Admin')
  const [date, setDate] = useState<DateRange | undefined>({
    from: calculatePastDate(30),
    to: new Date(),
  })

  const [data, setData] = useState<OrderSummaryData | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (date) {
      startTransition(async () => {
        const result = await getOrderSummary(date)
        setData(result as OrderSummaryData)
      })
    }
  }, [date])

  // حالة التحميل
  if (!data) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════ الهيدر مع منتقي التاريخ ═══════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/20">
            <Activity className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t('Dashboard')}</h2>
            <p className="text-xs text-gray-400">ملخص الأداء والإحصائيات</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* مؤشر التحديث */}
          {isPending && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RefreshCcw className="h-4 w-4 animate-spin" />
              <span>جاري التحديث...</span>
            </div>
          )}
          
          {/* منتقي التاريخ */}
          <CalendarDateRangePicker defaultDate={date} setDate={setDate} />
        </div>
      </div>

      {/* ═══════════════ بطاقات الإحصائيات ═══════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('Total Revenue')}
          value={data.totalSales}
          icon={DollarSign}
          gradient={statsCards[0].gradient}
          bgGradient={statsCards[0].bgGradient}
          iconBg={statsCards[0].iconBg}
          iconColor={statsCards[0].iconColor}
          borderColor={statsCards[0].borderColor}
          trend={statsCards[0].trend}
          trendUp={statsCards[0].trendUp}
          linkHref={statsCards[0].linkHref}
          linkText={t(statsCards[0].linkTextKey)}
          isPrice
        />
        <StatCard
          title={t('Sales')}
          value={data.ordersCount}
          icon={ShoppingBag}
          gradient={statsCards[1].gradient}
          bgGradient={statsCards[1].bgGradient}
          iconBg={statsCards[1].iconBg}
          iconColor={statsCards[1].iconColor}
          borderColor={statsCards[1].borderColor}
          trend={statsCards[1].trend}
          trendUp={statsCards[1].trendUp}
          linkHref={statsCards[1].linkHref}
          linkText={t(statsCards[1].linkTextKey)}
        />
        <StatCard
          title={t('Customers')}
          value={data.usersCount}
          icon={Users}
          gradient={statsCards[2].gradient}
          bgGradient={statsCards[2].bgGradient}
          iconBg={statsCards[2].iconBg}
          iconColor={statsCards[2].iconColor}
          borderColor={statsCards[2].borderColor}
          trend={statsCards[2].trend}
          trendUp={statsCards[2].trendUp}
          linkHref={statsCards[2].linkHref}
          linkText={t(statsCards[2].linkTextKey)}
        />
        <StatCard
          title={t('Products')}
          value={data.productsCount}
          icon={Package}
          gradient={statsCards[3].gradient}
          bgGradient={statsCards[3].bgGradient}
          iconBg={statsCards[3].iconBg}
          iconColor={statsCards[3].iconColor}
          borderColor={statsCards[3].borderColor}
          trend={statsCards[3].trend}
          trendUp={statsCards[3].trendUp}
          linkHref={statsCards[3].linkHref}
          linkText={t(statsCards[3].linkTextKey)}
        />
      </div>

      {/* ═══════════════ الرسم البياني الرئيسي ═══════════════ */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {t('Sales Overview')}
              </h3>
              <p className="text-xs text-gray-400">
                تحليل المبيعات خلال الفترة المحددة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-400">المبيعات</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-400">الطلبات</span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <SalesAreaChart data={data.salesChartData} />
        </div>
      </div>

      {/* ═══════════════ صف الأرباح وأداء المنتجات ═══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* بطاقة الأرباح */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500/5 to-green-600/5 border border-emerald-500/20 overflow-hidden">
          <div className="flex items-center gap-3 p-5 sm:p-6 border-b border-emerald-500/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">
                {t("How much you're earning")}
              </h3>
              <p className="text-xs text-gray-400">
                {t('Estimated')} · {t('Last 6 months')}
              </p>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <TableChart data={data.monthlySales} labelType="month" />
          </div>
        </div>

        {/* بطاقة أداء المنتجات */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-500/5 to-purple-600/5 border border-violet-500/20 overflow-hidden">
          <div className="flex items-center gap-3 p-5 sm:p-6 border-b border-violet-500/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
              <Package className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-bold text-white">
                {t('Product Performance')}
              </h3>
              <p className="text-xs text-gray-400">
                {formatDateTime(date!.from!).dateOnly} - {formatDateTime(date!.to!).dateOnly}
              </p>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <TableChart data={data.topSalesProducts} labelType="product" />
          </div>
        </div>
      </div>

      {/* ═══════════════ صف الفئات والمبيعات الأخيرة ═══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* بطاقة الفئات الأكثر مبيعاً */}
        <div className="rounded-2xl bg-gradient-to-br from-orange-500/5 to-amber-600/5 border border-orange-500/20 overflow-hidden">
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-orange-500/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20">
                <PieChart className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="font-bold text-white">
                {t('Best-Selling Categories')}
              </h3>
            </div>
            <Link
              href="/admin/categories"
              className="flex items-center gap-1 text-xs text-orange-400 hover:underline"
            >
              <span>عرض الكل</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-5 sm:p-6">
            <SalesCategoryPieChart data={data.topSalesCategories} />
          </div>
        </div>

        {/* بطاقة المبيعات الأخيرة */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-600/5 border border-blue-500/20 overflow-hidden">
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-blue-500/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-white">{t('Recent Sales')}</h3>
            </div>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
            >
              <span>عرض الكل</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-5 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700/50 hover:bg-transparent">
                    <TableHead className="text-gray-400 font-medium">
                      {t('Buyer')}
                    </TableHead>
                    <TableHead className="text-gray-400 font-medium">
                      {t('Date')}
                    </TableHead>
                    <TableHead className="text-gray-400 font-medium">
                      {t('Total')}
                    </TableHead>
                    <TableHead className="text-gray-400 font-medium text-left">
                      {t('Actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.latestOrders.map((order: IOrderList, index: number) => (
                    <TableRow
                      key={order._id}
                      className={cn(
                        'border-gray-700/30 transition-colors hover:bg-gray-800/30',
                        index === 0 && 'bg-blue-500/5'
                      )}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <span className="font-medium text-white text-sm">
                            {order.user ? order.user.name : t('Deleted User')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-400">
                          {formatDateTime(order.createdAt).dateOnly}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-emerald-400">
                          <ProductPrice price={order.totalPrice} plain />
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-700/50 text-gray-300 text-xs font-medium hover:bg-gray-700 hover:text-white transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          <span>{t('Details')}</span>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* رابط عرض المزيد */}
            <div className="mt-4 pt-4 border-t border-gray-700/30">
              <Link
                href="/admin/orders"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gray-800/50 text-gray-300 text-sm font-medium hover:bg-gray-800 hover:text-white transition-colors"
              >
                <span>عرض جميع الطلبات</span>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ ملاحظة أسفل الصفحة ═══════════════ */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
        <Sparkles className="h-4 w-4 text-yellow-400" />
        <span>يتم تحديث البيانات تلقائياً عند تغيير النطاق الزمني</span>
      </div>
    </div>
  )
}