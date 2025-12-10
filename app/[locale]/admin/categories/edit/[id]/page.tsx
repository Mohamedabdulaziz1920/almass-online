// app/[locale]/admin/categories/edit/[id]/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getCategoryById } from '@/lib/actions/category.actions'
import CategoryForm, { CategoryFormType } from '../../category-form'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  Layers,
  ChevronLeft,
  Home,
  Edit3,
  Eye,
  ExternalLink,
  Package,
  Calendar,
  Clock,
  Star,
  ImageIcon,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'تعديل الفئة | لوحة التحكم',
  description: 'تعديل معلومات الفئة',
}

// ═══════════════════════════════════════════════════════════════
// 📋 تعريف الأنواع
// ═══════════════════════════════════════════════════════════════
type Props = {
  params: Promise<{ id: string }>
}

// ═══════════════════════════════════════════════════════════════
// 🧭 شريط التنقل (Breadcrumb)
// ═══════════════════════════════════════════════════════════════
function Breadcrumb({ categoryName }: { categoryName: string }) {
  const items = [
    { label: 'لوحة التحكم', href: '/admin/overview', icon: Home },
    { label: 'الفئات', href: '/admin/categories', icon: Layers },
    { label: categoryName, href: '#', icon: Edit3, active: true },
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
// 📊 مكون بطاقة الإحصائية الصغيرة
// ═══════════════════════════════════════════════════════════════
function MiniStatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  color: 'violet' | 'emerald' | 'blue' | 'amber'
}) {
  const colors = {
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-xl border',
      colors[color]
    )}>
      <Icon className="h-4 w-4" />
      <div>
        <p className="text-xs opacity-70">{label}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════════════════════════════
export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params

  // التحقق من الصلاحيات
  const session = await auth()

  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=/admin/categories/edit/${id}`)
  }

  if (session.user.role !== 'Admin') {
    redirect('/admin/overview')
  }

  // جلب بيانات الفئة
  const category = await getCategoryById(id)

  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════ الهيدر ═══════════════ */}
      <div className="flex flex-col gap-4">
        {/* شريط التنقل والإجراءات */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumb categoryName={category.name} />
          
          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-2">
            {/* معاينة */}
            <Link
              href={`/category/${category.slug}`}
              target="_blank"
              className={cn(
                'flex items-center gap-2 h-9 px-3 sm:px-4 rounded-xl',
                'bg-blue-500/10 border border-blue-500/20',
                'text-blue-400 hover:bg-blue-500/20',
                'transition-all text-sm font-medium'
              )}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">معاينة</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            {/* رجوع للقائمة */}
            <Link
              href="/admin/categories"
              className={cn(
                'flex items-center gap-2 h-9 px-3 sm:px-4 rounded-xl',
                'bg-gray-800/50 border border-gray-700/50',
                'text-gray-300 hover:text-white hover:bg-gray-800',
                'transition-all text-sm font-medium'
              )}
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">كل الفئات</span>
            </Link>
          </div>
        </div>

        {/* بطاقة معلومات الفئة */}
        <div className="rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* صورة الفئة */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-2xl overflow-hidden bg-gray-800 border-2 border-gray-700/50">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500/10 to-purple-500/10">
                    <Layers className="h-12 w-12 text-violet-400/50" />
                  </div>
                )}
              </div>
              
              {/* شارة مميزة */}
              {category.isFeatured && (
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/30">
                  <Star className="h-4 w-4 text-black fill-black" />
                </div>
              )}
            </div>

            {/* معلومات الفئة */}
            <div className="flex-1 text-center sm:text-right">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                      {category.name}
                    </h1>
                    {category.isFeatured && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20">
                        مميز
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    تعديل معلومات الفئة
                  </p>
                </div>

                {/* معرف الفئة */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs text-gray-500">ID:</span>
                  <code className="font-mono text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-lg">
                    {category._id}
                  </code>
                </div>
              </div>

              {/* الإحصائيات السريعة */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {/* عدد المنتجات */}
                <MiniStatCard
                  icon={Package}
                  label="المنتجات"
                  value={category.productCount || 0}
                  color="violet"
                />

                {/* الحالة */}
                <div className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl border',
                  category.isFeatured
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                )}>
                  {category.isFeatured ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {category.isFeatured ? 'مميز' : 'عادي'}
                  </span>
                </div>

                {/* Slug */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800/50 border border-gray-700/50">
                  <span className="text-xs text-gray-500">Slug:</span>
                  <code className="font-mono text-xs text-blue-400">
                    /{category.slug}
                  </code>
                </div>
              </div>

              {/* تاريخ الإنشاء والتحديث */}
              {(category.createdAt || category.updatedAt) && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-4 border-t border-gray-700/50 text-xs text-gray-500">
                  {category.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      الإنشاء: {formatDateTime(category.createdAt).dateOnly}
                    </span>
                  )}
                  {category.updatedAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      التحديث: {formatDateTime(category.updatedAt).dateOnly}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* بانر الفئة (إذا وجد) */}
          {category.banner && (
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                بانر الفئة
              </p>
              <div className="relative h-24 sm:h-32 rounded-xl overflow-hidden bg-gray-800">
                <Image
                  src={category.banner}
                  alt={`${category.name} banner`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════ النموذج ═══════════════ */}
      <CategoryForm
        type={CategoryFormType.Update}
        initialData={{
          name: category.name,
          slug: category.slug,
          image: category.image || '',
          isFeatured: category.isFeatured || false,
          banner: category.banner || '',
        }}
        categoryId={category._id}
      />
    </div>
  )
}