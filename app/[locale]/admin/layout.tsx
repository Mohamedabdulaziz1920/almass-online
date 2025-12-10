// app/admin/layout.tsx
import { SidebarProvider } from '@/context/sidebar-context'
import AdminSidebar from '@/components/shared/admin/AdminSidebar'
import AdminHeader from '@/components/shared/admin/AdminHeader'
import Footer from '@/components/shared/admin/Footer'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        {/* الشريط الجانبي */}
        <AdminSidebar />

        {/* المنطقة الرئيسية */}
        <div className="flex flex-1 flex-col min-w-0 w-full">
          {/* الهيدر */}
          <AdminHeader />

          {/* المحتوى */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-xl sm:rounded-2xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm p-4 sm:p-6 shadow-xl">
                {children}
              </div>
            </div>
          </main>

          {/* الفوتر */}
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  )
}