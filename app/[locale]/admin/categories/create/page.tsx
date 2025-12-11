// app/[locale]/admin/categories/create/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
// 👇 1. قم بتعديل الاستيراد هنا لإحضار CategoryFormType
import CategoryForm, { CategoryFormType } from '../category-form'
import {
  Package,
  ChevronLeft,
  Home,
  Plus,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'إضافة قسم جديد | لوحة التحكم',
  description: 'إضافة قسم جديد إلى المتجر',
}

function Breadcrumb() {
  const items = [
    { label: 'لوحة التحكم', href: '/admin/overview', icon: Home },
    { label: 'الأقسام', href: '/admin/categories', icon: Package },
    { label: 'إضافة قسم', href: '/admin/categories/create', icon: Plus, active: true },
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

const CreateCategoryPage = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/admin/categories/create')
  }

  if (session.user.role !== 'Admin') {
    redirect('/admin/overview')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumb />
        
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-400">قسم جديد</span>
          </span>
        </div>
      </div>

      {/* 👇 2. استخدم Enum هنا بدلاً من النص */}
      <CategoryForm type={CategoryFormType.Create} />
    </div>
  )
}
export default CreateCategoryPage