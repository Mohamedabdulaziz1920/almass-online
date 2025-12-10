// app/[locale]/admin/products/create/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ProductForm from '../product-form'
import {
  Package,
  ChevronLeft,
  Home,
  Plus,
  Sparkles,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'إضافة منتج جديد | لوحة التحكم',
  description: 'إضافة منتج جديد إلى المتجر',
}

// ═══════════════════════════════════════════════════════════════
// 🧭 مكون شريط التنقل (Breadcrumb)
// ═══════════════════════════════════════════════════════════════
function Breadcrumb() {
  const items = [
    { label: 'لوحة التحكم', href: '/admin/overview', icon: Home },
    { label: 'المنتجات', href: '/admin/products', icon: Package },
    { label: 'إضافة منتج', href: '/admin/products/create', icon: Plus, active: true },
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
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════════════════════════════
const CreateProductPage = async () => {
  // التحقق من الصلاحيات
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/admin/products/create')
  }

  if (session.user.role !== 'Admin') {
    redirect('/admin/overview')
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════ شريط التنقل ═══════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Breadcrumb />
        
        {/* شارة جديد */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-400">منتج جديد</span>
          </span>
        </div>
      </div>

      {/* ═══════════════ النموذج ═══════════════ */}
      <ProductForm type="Create" />
    </div>
  )
}

export default CreateProductPage