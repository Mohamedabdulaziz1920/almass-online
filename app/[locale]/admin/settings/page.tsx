import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Settings, 
  Shield,
  Sparkles,
  Building2,
  Palette,
  ImageIcon,
  Languages,
  CircleDollarSign,
  CreditCard,
  Truck,
  ChevronLeft,
  ArrowRight
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════
// 📋 Metadata
// ═══════════════════════════════════════════════════════════════════════════
export const metadata: Metadata = {
  title: 'الإعدادات | لوحة التحكم',
  description: 'إعدادات المتجر والتخصيص',
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 بطاقات الأقسام
// ═══════════════════════════════════════════════════════════════════════════
const settingSections = [
  {
    href: '/admin/settings/site-info',
    title: 'معلومات الموقع',
    description: 'اسم الموقع، الشعار، الوصف، ومعلومات الاتصال',
    icon: Building2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    href: '/admin/settings/common',
    title: 'الإعدادات العامة',
    description: 'المظهر، الألوان، وإعدادات النظام العامة',
    icon: Palette,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    href: '/admin/settings/carousels',
    title: 'السلايدر الرئيسي',
    description: 'إدارة صور العرض في الصفحة الرئيسية',
    icon: ImageIcon,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    href: '/admin/settings/languages',
    title: 'اللغات',
    description: 'إضافة وإدارة اللغات المتاحة في المتجر',
    icon: Languages,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    href: '/admin/settings/currencies',
    title: 'العملات',
    description: 'العملات المتاحة وأسعار التحويل',
    icon: CircleDollarSign,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    href: '/admin/settings/payment-methods',
    title: 'طرق الدفع',
    description: 'بوابات الدفع الإلكتروني والعمولات',
    icon: CreditCard,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    href: '/admin/settings/delivery-dates',
    title: 'مواعيد التوصيل',
    description: 'خيارات الشحن والتوصيل والأسعار',
    icon: Truck,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    gradient: 'from-orange-500 to-red-500',
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 الصفحة الرئيسية
// ═══════════════════════════════════════════════════════════════════════════
const SettingPage = async () => {
  // التحقق من الصلاحيات
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/admin/settings')
  }
  if (session.user.role !== 'Admin') {
    redirect('/admin/overview')
  }

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 🎨 خلفية زخرفية */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📊 الهيدر */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="mb-8 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-xl" />
                <div className="relative p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/20">
                  <Settings className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  إعدادات المتجر
                  <Sparkles className="h-5 w-5 text-purple-400" />
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  اختر القسم الذي تريد تعديله
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                مدير النظام
              </span>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 📦 بطاقات الأقسام */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settingSections.map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`
                    group relative p-6 rounded-2xl border transition-all duration-300
                    ${section.bgColor} ${section.borderColor}
                    hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20
                    overflow-hidden
                  `}
                >
                  {/* خلفية متدرجة عند الـ hover */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${section.gradient}
                    opacity-0 group-hover:opacity-10 transition-opacity duration-300
                  `} />

                  <div className="relative z-10">
                    {/* الأيقونة والعنوان */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${section.bgColor} border ${section.borderColor}`}>
                        <Icon className={`h-6 w-6 ${section.color}`} />
                      </div>
                      <ChevronLeft className={`
                        h-5 w-5 ${section.color} 
                        transform group-hover:-translate-x-1 transition-transform
                      `} />
                    </div>

                    {/* النصوص */}
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {section.description}
                    </p>

                    {/* رابط الانتقال */}
                    <div className={`
                      mt-4 flex items-center gap-2 ${section.color} text-sm font-medium
                      opacity-0 group-hover:opacity-100 transition-opacity
                    `}>
                      <span>تعديل الإعدادات</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* 💡 نصيحة */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-xl border border-amber-500/20">
            <p className="text-amber-300 text-sm flex items-center gap-2">
              <span className="text-lg">💡</span>
              <span>
                انقر على أي قسم لتعديل إعداداته. كل قسم يُحفظ بشكل مستقل.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingPage