// app/[locale]/admin/categories/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getCategories } from '@/lib/actions/category.actions'
// تم حذف Button لأنه غير مستخدم
import {
  Layers,
  Plus,
  Search,
  // تم حذف Filter
  // تم حذف RefreshCcw
  Edit3,
  // تم حذف Trash2
  Eye,
  FolderOpen,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Grid3X3,
  // تم حذف List
  ChevronLeft,
  Home,
  // تم حذف MoreVertical
  // تم حذف ImageIcon
  ExternalLink,
  Sparkles,
  // تم حذف BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'إدارة الفئات | لوحة التحكم',
  description: 'إدارة وتنظيم فئات المتجر',
}

// ═══════════════════════════════════════════════════════════════
// 📊 بطاقات الإحصائيات
// ═══════════════════════════════════════════════════════════════
const quickStats = [
  {
    label: 'إجمالي الفئات',
    icon: Layers,
    color: 'violet',
    getValue: (count: number) => count.toString(),
  },
  {
    label: 'الفئات النشطة',
    icon: CheckCircle2,
    color: 'emerald',
    getValue: (count: number) => count.toString(),
  },
  {
    label: 'فئات بدون منتجات',
    icon: AlertTriangle,
    color: 'amber',
    getValue: () => '3',
  },
  {
    label: 'الأكثر مبيعاً',
    icon: TrendingUp,
    color: 'blue',
    getValue: () => 'إلكترونيات',
  },
]

// ═══════════════════════════════════════════════════════════════
// 🧭 شريط التنقل
// ═══════════════════════════════════════════════════════════════
function Breadcrumb() {
  const items = [
    { label: 'لوحة التحكم', href: '/admin/overview', icon: Home },
    { label: 'الفئات', href: '/admin/categories', icon: Layers, active: true },
  ]

  return (
    <nav className="flex items-center gap-1 text-sm flex-wrap">
      {items.map((item, index) => {
        const Icon = item.icon
        const isLast = index === items.length - 1

        return (
          <div key={item.href} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
            
            {isLast ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 font-medium border border-violet-500/20">
                <Icon className="h-3.5 w-3.5" />
                {item.label}
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
// 📦 حالة فارغة
// ═══════════════════════════════════════════════════════════════
function EmptyState({ t }: { t: (key: string) => string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 blur-xl animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-800/50 border border-gray-700/50">
          <FolderOpen className="h-10 w-10 text-gray-500" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">
        {t('No categories yet')}
      </h3>
      <p className="text-gray-400 text-center max-w-md mb-6">
        لم تقم بإضافة أي فئات بعد. ابدأ بإنشاء فئتك الأولى لتنظيم منتجاتك.
      </p>
      
      <Link
        href="/admin/categories/create"
        className={cn(
          'flex items-center gap-2 px-5 py-2.5 rounded-xl',
          'bg-gradient-to-r from-violet-500 to-purple-600',
          'text-white font-semibold',
          'hover:from-violet-600 hover:to-purple-700',
          'shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
          'transition-all hover:scale-[1.02] active:scale-[0.98]'
        )}
      >
        <Plus className="h-5 w-5" />
        إنشاء فئة جديدة
      </Link>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎨 بطاقة الفئة المحسنة
// ═══════════════════════════════════════════════════════════════
interface Category {
  _id: string
  name: string
  slug: string
  image?: string
  description?: string
  productCount?: number
  isActive?: boolean
}

function CategoryCardEnhanced({ category }: { category: Category }) {
  return (
    <div className={cn(
      'group relative rounded-2xl overflow-hidden',
      'bg-gradient-to-br from-gray-800/50 to-gray-900/50',
      'border border-gray-700/50 hover:border-violet-500/30',
      'transition-all duration-300',
      'hover:shadow-xl hover:shadow-violet-500/10 hover:scale-[1.02]'
    )}>
      {/* صورة الفئة */}
      <div className="relative aspect-[4/3] bg-gray-800 overflow-hidden">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500/10 to-purple-500/10">
            <Layers className="h-16 w-16 text-violet-400/50" />
          </div>
        )}

        {/* Overlay عند Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* شارة عدد المنتجات */}
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-medium border border-white/10">
            <Package className="h-3.5 w-3.5" />
            {category.productCount || 0} منتج
          </span>
        </div>

        {/* أزرار الإجراءات */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Link
            href={`/admin/categories/edit/${category._id}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Edit3 className="h-5 w-5" />
          </Link>
          <Link
            href={`/category/${category.slug}`}
            target="_blank"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* معلومات الفئة */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-white text-lg group-hover:text-violet-400 transition-colors truncate">
            {category.name}
          </h3>
          {category.isActive !== false && (
            <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              نشط
            </span>
          )}
        </div>

        {category.description && (
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {category.description}
          </p>
        )}

        {/* الإجراءات */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
          <Link
            href={`/admin/categories/edit/${category._id}`}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-violet-400 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            تعديل
          </Link>
          <Link
            href={`/category/${category.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-400 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            عرض
          </Link>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 📊 مكون بطاقة الإحصائية
// ═══════════════════════════════════════════════════════════════
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: string
  icon: React.ElementType
  color: 'violet' | 'emerald' | 'amber' | 'blue'
}) {
  const colors = {
    violet: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      icon: 'text-violet-400',
      value: 'text-violet-400',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: 'text-emerald-400',
      value: 'text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: 'text-amber-400',
      value: 'text-amber-400',
    },
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: 'text-blue-400',
      value: 'text-blue-400',
    },
  }

  return (
    <div className={cn(
      'rounded-xl p-4',
      colors[color].bg,
      'border',
      colors[color].border,
      'transition-all hover:scale-[1.02]'
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('h-4 w-4', colors[color].icon)} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className={cn('text-xl font-bold', colors[color].value)}>
        {value}
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════════════════════════════
const CategoriesListPage = async () => {
  // التحقق من الصلاحيات
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/admin/categories')
  }

  if (session.user.role !== 'Admin') {
    redirect('/admin/overview')
  }

  const response = await getCategories()
  const t = await getTranslations('CategoriesListPage')

  // حالة الخطأ
  if (!response.success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-full bg-red-500/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-red-400 mb-2">{t('Error')}</h1>
        <p className="text-gray-400 text-center max-w-md">
          {/* تم التصحيح هنا: استخدام message بدلاً من error */}
          {response.message || 'حدث خطأ أثناء تحميل الفئات'}
        </p>
        <Link
          href="/admin/overview"
          className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          العودة للوحة التحكم
        </Link>
      </div>
    )
  }

  const categories = response.data || []

  return (
    <div className="space-y-6">
      {/* ═══════════════ الهيدر ═══════════════ */}
      <div className="flex flex-col gap-4">
        {/* شريط التنقل */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb />
          
          {/* شارة */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">
                {categories.length} فئة
              </span>
            </span>
          </div>
        </div>

        {/* العنوان والأزرار */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
              <Layers className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t('Categories')}
              </h1>
              <p className="text-sm text-gray-400">
                {t('Manage and track all Categories')}
              </p>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin/categories/create"
              className={cn(
                'flex items-center gap-2 h-11 px-4 sm:px-5 rounded-xl',
                'bg-gradient-to-r from-violet-500 to-purple-600',
                'text-white font-semibold text-sm',
                'hover:from-violet-600 hover:to-purple-700',
                'shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40',
                'transition-all hover:scale-[1.02] active:scale-[0.98]'
              )}
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">{t('Create New Category')}</span>
              <span className="sm:hidden">إضافة</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════ بطاقات الإحصائيات ═══════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.getValue(categories.length)}
            icon={stat.icon}
            color={stat.color as 'violet' | 'emerald' | 'amber' | 'blue'}
          />
        ))}
      </div>

      {/* ═══════════════ المحتوى ═══════════════ */}
      <div className="rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700/50 overflow-hidden">
        {/* هيدر القسم */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
              <Grid3X3 className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">جميع الفئات</h2>
              <p className="text-xs text-gray-400">
                عرض وإدارة جميع فئات المتجر
              </p>
            </div>
          </div>

          {/* بحث وفلترة */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="البحث عن فئة..."
                className={cn(
                  'w-full sm:w-64 h-10 pr-10 pl-4 rounded-xl',
                  'bg-gray-800/50 border border-gray-700/50',
                  'text-white placeholder-gray-500 text-sm',
                  'focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20',
                  'transition-all'
                )}
              />
            </div>
          </div>
        </div>

        {/* قائمة الفئات */}
        <div className="p-4 sm:p-6">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((category: Category) => (
                <CategoryCardEnhanced key={category._id} category={category} />
              ))}
            </div>
          ) : (
            <EmptyState t={t} />
          )}
        </div>
      </div>

      {/* ═══════════════ نصيحة ═══════════════ */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-4">
        <Sparkles className="h-4 w-4 text-violet-400" />
        <span>الفئات تساعد في تنظيم منتجاتك وتسهل على العملاء التصفح</span>
      </div>
    </div>
  )
}

export default CategoriesListPage