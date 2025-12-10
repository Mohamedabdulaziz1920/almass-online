// app/[locale]/admin/products/product-list.tsx
'use client'

import React, { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package,
  Search,
  Plus,
  Edit3,
  ExternalLink,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Star,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Grid3X3,
  List,
  X,
  ImageIcon,
  Tag,
} from 'lucide-react'

import DeleteDialog from '@/components/shared/delete-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  deleteProduct,
  getAllProductsForAdmin,
} from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import { formatDateTime, formatId, cn } from '@/lib/utils'
import ProductPrice from '@/components/shared/product/product-price'

// ═══════════════════════════════════════════════════════════════
// 📋 تعريف الأنواع
// ═══════════════════════════════════════════════════════════════
type ProductListDataProps = {
  products: IProduct[]
  totalPages: number
  totalProducts: number
  to: number
  from: number
}

type ViewMode = 'table' | 'grid'

// تعريف نوع debounce
declare global {
  interface Window {
    productSearchDebounce: ReturnType<typeof setTimeout> | undefined
  }
}

// ═══════════════════════════════════════════════════════════════
// 🎭 مكون حالة التحميل
// ═══════════════════════════════════════════════════════════════
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* شريط البحث */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-11 w-64 bg-gray-800 rounded-xl" />
        <Skeleton className="h-11 w-32 bg-gray-800 rounded-xl" />
      </div>
      
      {/* الجدول */}
      <div className="rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="bg-gray-800/50 p-4">
          <div className="flex gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1 bg-gray-700" />
            ))}
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 bg-gray-800 rounded-xl" />
              <Skeleton className="h-4 flex-1 bg-gray-800" />
              <Skeleton className="h-4 w-20 bg-gray-800" />
              <Skeleton className="h-4 w-16 bg-gray-800" />
              <Skeleton className="h-8 w-24 bg-gray-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 📦 مكون حالة فارغة
// ═══════════════════════════════════════════════════════════════
function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-800/50 border border-gray-700/50">
          <Package className="h-10 w-10 text-gray-500" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">
        {query ? 'لا توجد نتائج' : 'لا توجد منتجات'}
      </h3>
      <p className="text-gray-400 text-center max-w-md mb-6">
        {query 
          ? `لم نجد أي منتجات تطابق بحثك. جرب البحث بكلمات مختلفة.`
          : 'لم تقم بإضافة أي منتجات بعد. ابدأ بإضافة منتجك الأول!'
        }
      </p>
      
      {!query && (
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25"
        >
          <Plus className="h-5 w-5" />
          إضافة منتج جديد
        </Link>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ⭐ مكون التقييم
// ═══════════════════════════════════════════════════════════════
function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-600'
            )}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 mr-1">
        ({rating.toFixed(1)})
      </span>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🏷️ مكون حالة المخزون
// ═══════════════════════════════════════════════════════════════
function StockBadge({ count }: { count: number }) {
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
        <XCircle className="h-3 w-3" />
        نفذ
      </span>
    )
  }
  
  if (count < 10) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
        <AlertTriangle className="h-3 w-3" />
        {count}
      </span>
    )
  }
  
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
      <CheckCircle2 className="h-3 w-3" />
      {count}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════
// 📌 مكون حالة النشر
// ═══════════════════════════════════════════════════════════════
function PublishBadge({ isPublished }: { isPublished: boolean }) {
  return isPublished ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
      <CheckCircle2 className="h-3 w-3" />
      منشور
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-500/10 text-gray-400 text-xs font-medium border border-gray-500/20">
      <XCircle className="h-3 w-3" />
      مسودة
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════
// 🎯 المكون الرئيسي
// ═══════════════════════════════════════════════════════════════
const ProductList = () => {
  const [page, setPage] = useState<number>(1)
  const [inputValue, setInputValue] = useState<string>('')
  const [data, setData] = useState<ProductListDataProps>()
  const [isPending, startTransition] = useTransition()
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // تغيير الصفحة
  const handlePageChange = (changeType: 'next' | 'prev') => {
    const newPage = changeType === 'next' ? page + 1 : page - 1
    setPage(newPage)
    startTransition(async () => {
      const result = await getAllProductsForAdmin({
        query: inputValue,
        page: newPage,
      })
      setData(result)
    })
  }

  // البحث
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setPage(1)
    
    if (window.productSearchDebounce) {
      clearTimeout(window.productSearchDebounce)
    }
    
    window.productSearchDebounce = setTimeout(() => {
      startTransition(async () => {
        const result = await getAllProductsForAdmin({ query: value, page: 1 })
        setData(result)
      })
    }, 500)
  }

  // مسح البحث
  const handleClearSearch = () => {
    setInputValue('')
    setPage(1)
    startTransition(async () => {
      const result = await getAllProductsForAdmin({ query: '', page: 1 })
      setData(result)
    })
  }

  // تحديث البيانات
  const handleRefresh = () => {
    startTransition(async () => {
      const result = await getAllProductsForAdmin({ query: inputValue, page })
      setData(result)
    })
  }

  // تحميل البيانات الأولية
  useEffect(() => {
    startTransition(async () => {
      const result = await getAllProductsForAdmin({ query: '' })
      setData(result)
      setIsInitialLoading(false)
    })
  }, [])

  // حالة التحميل الأولي
  if (isInitialLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* ═══════════════ شريط الأدوات ═══════════════ */}
      <div className="flex flex-col gap-4">
        {/* الصف الأول: البحث والأزرار */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          {/* البحث */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="البحث عن منتج..."
              className={cn(
                'w-full h-11 pr-10 pl-10 rounded-xl',
                'bg-gray-800/50 border-gray-700/50',
                'text-white placeholder-gray-500',
                'focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20',
                'transition-all'
              )}
            />
            {inputValue && (
              <button
                onClick={handleClearSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-2">
            {/* زر التحديث */}
            <button
              onClick={handleRefresh}
              disabled={isPending}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-xl',
                'bg-gray-800/50 border border-gray-700/50',
                'text-gray-400 hover:text-white hover:bg-gray-800',
                'transition-all',
                isPending && 'animate-spin'
              )}
            >
              <RefreshCcw className="h-4 w-4" />
            </button>

            {/* تبديل العرض */}
            <div className="hidden sm:flex items-center rounded-xl bg-gray-800/50 border border-gray-700/50 p-1">
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                  viewMode === 'table'
                    ? 'bg-violet-500/20 text-violet-400'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                  viewMode === 'grid'
                    ? 'bg-violet-500/20 text-violet-400'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>

            {/* زر إضافة منتج */}
            <Link
              href="/admin/products/create"
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
              <span className="hidden sm:inline">إضافة منتج</span>
            </Link>
          </div>
        </div>

        {/* الصف الثاني: معلومات النتائج */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            {isPending ? (
              <div className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 animate-spin" />
                <span>جاري التحميل...</span>
              </div>
            ) : (
              <>
                <Package className="h-4 w-4 text-violet-400" />
                <span>
                  {data?.totalProducts === 0 ? (
                    'لا توجد منتجات'
                  ) : (
                    <>
                      عرض{' '}
                      <span className="text-white font-medium">
                        {data?.from}-{data?.to}
                      </span>
                      {' '}من{' '}
                      <span className="text-white font-medium">
                        {data?.totalProducts}
                      </span>
                      {' '}منتج
                    </>
                  )}
                </span>
              </>
            )}
          </div>

          {inputValue && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs border border-violet-500/20">
              <Search className="h-3 w-3" />
              نتائج البحث عن: {inputValue}
            </span>
          )}
        </div>
      </div>

      {/* ═══════════════ المحتوى ═══════════════ */}
      {data?.products.length === 0 ? (
        <EmptyState query={inputValue} />
      ) : viewMode === 'table' ? (
        /* ═══ عرض الجدول ═══ */
        <div className="rounded-2xl border border-gray-700/50 overflow-hidden bg-gray-800/20">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700/50 hover:bg-transparent bg-gray-800/50">
                  <TableHead className="text-gray-400 font-semibold">المنتج</TableHead>
                  <TableHead className="text-gray-400 font-semibold text-center">السعر</TableHead>
                  <TableHead className="text-gray-400 font-semibold text-center hidden md:table-cell">الفئة</TableHead>
                  <TableHead className="text-gray-400 font-semibold text-center hidden lg:table-cell">المخزون</TableHead>
                  <TableHead className="text-gray-400 font-semibold text-center hidden lg:table-cell">التقييم</TableHead>
                  <TableHead className="text-gray-400 font-semibold text-center hidden sm:table-cell">الحالة</TableHead>
                  <TableHead className="text-gray-400 font-semibold text-center hidden xl:table-cell">آخر تحديث</TableHead>
                  <TableHead className="text-gray-400 font-semibold text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.products.map((product: IProduct, index: number) => (
                  <TableRow
                    key={product._id}
                    className={cn(
                      'border-gray-700/30 transition-all hover:bg-gray-800/50 group',
                      index === 0 && 'bg-violet-500/5'
                    )}
                  >
                    {/* المنتج */}
                    <TableCell>
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="flex items-center gap-3 group/link"
                      >
                        {/* صورة المنتج */}
                        <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50 group-hover/link:border-violet-500/50 transition-colors shrink-0">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        
                        {/* اسم المنتج */}
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate max-w-[150px] sm:max-w-[200px] lg:max-w-[300px] group-hover/link:text-violet-400 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">
                            {formatId(product._id)}
                          </p>
                        </div>
                      </Link>
                    </TableCell>

                    {/* السعر */}
                    <TableCell className="text-center">
                      <span className="font-bold text-emerald-400">
                        <ProductPrice price={product.price} plain />
                      </span>
                    </TableCell>

                    {/* الفئة */}
                    <TableCell className="text-center hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                        <Tag className="h-3 w-3" />
                        {product.category}
                      </span>
                    </TableCell>

                    {/* المخزون */}
                    <TableCell className="text-center hidden lg:table-cell">
                      <StockBadge count={product.countInStock} />
                    </TableCell>

                    {/* التقييم */}
                    <TableCell className="text-center hidden lg:table-cell">
                      <RatingStars rating={product.avgRating || 0} />
                    </TableCell>

                    {/* الحالة */}
                    <TableCell className="text-center hidden sm:table-cell">
                      <PublishBadge isPublished={product.isPublished} />
                    </TableCell>

                    {/* آخر تحديث */}
                    <TableCell className="text-center hidden xl:table-cell">
                      <span className="text-sm text-gray-400">
                        {formatDateTime(product.updatedAt).dateOnly}
                      </span>
                    </TableCell>

                    {/* الإجراءات */}
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {/* أزرار سطح المكتب */}
                        <div className="hidden sm:flex items-center gap-1">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 hover:bg-violet-500/20 hover:text-violet-400 transition-all"
                            title="تعديل"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 hover:bg-blue-500/20 hover:text-blue-400 transition-all"
                            title="معاينة"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <DeleteDialog
                            id={product._id}
                            action={deleteProduct}
                            callbackAction={() => {
                              startTransition(async () => {
                                const result = await getAllProductsForAdmin({
                                  query: inputValue,
                                  page,
                                })
                                setData(result)
                              })
                            }}
                          />
                        </div>

                        {/* قائمة منسدلة للموبايل */}
                        <div className="sm:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white transition-all">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 bg-gray-900 border-gray-700/50 rounded-xl"
                            >
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/products/${product._id}`}
                                  className="flex items-center gap-2 text-gray-300"
                                >
                                  <Edit3 className="h-4 w-4" />
                                  تعديل
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/product/${product.slug}`}
                                  target="_blank"
                                  className="flex items-center gap-2 text-gray-300"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  معاينة
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700/50" />
                              <DropdownMenuItem className="flex items-center gap-2 text-red-400 focus:text-red-400">
                                <Trash2 className="h-4 w-4" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        /* ═══ عرض الشبكة ═══ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.products.map((product: IProduct) => (
            <div
              key={product._id}
              className="group rounded-2xl bg-gray-800/30 border border-gray-700/50 overflow-hidden hover:border-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/10"
            >
              {/* صورة المنتج */}
              <div className="relative aspect-square bg-gray-800">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-600" />
                  </div>
                )}
                
                {/* شارة الحالة */}
                <div className="absolute top-3 right-3">
                  <PublishBadge isPublished={product.isPublished} />
                </div>
                
                {/* أزرار الإجراءات */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/products/${product._id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <Edit3 className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/product/${product.slug}`}
                    target="_blank"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              {/* معلومات المنتج */}
              <div className="p-4">
                <Link href={`/admin/products/${product._id}`}>
                  <h3 className="font-semibold text-white truncate hover:text-violet-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-emerald-400">
                    <ProductPrice price={product.price} plain />
                  </span>
                  <StockBadge count={product.countInStock} />
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {product.category}
                  </span>
                  <RatingStars rating={product.avgRating || 0} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════ Pagination ═══════════════ */}
      {(data?.totalPages ?? 0) > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-700/30">
          {/* معلومات الصفحات */}
          <div className="text-sm text-gray-400">
            الصفحة{' '}
            <span className="text-white font-medium">{page}</span>
            {' '}من{' '}
            <span className="text-white font-medium">{data?.totalPages}</span>
          </div>

          {/* أزرار التنقل */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange('prev')}
              disabled={page <= 1 || isPending}
              className={cn(
                'h-10 px-4 rounded-xl',
                'bg-gray-800/50 border-gray-700/50',
                'text-gray-300 hover:text-white hover:bg-gray-800',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <ChevronRight className="h-4 w-4 ml-1" />
              السابق
            </Button>

            {/* أرقام الصفحات */}
            <div className="hidden sm:flex items-center gap-1">
              {[...Array(Math.min(5, data?.totalPages ?? 0))].map((_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setPage(pageNum)
                      startTransition(async () => {
                        const result = await getAllProductsForAdmin({
                          query: inputValue,
                          page: pageNum,
                        })
                        setData(result)
                      })
                    }}
                    className={cn(
                      'h-10 w-10 rounded-xl font-medium transition-all',
                      page === pageNum
                        ? 'bg-violet-500 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange('next')}
              disabled={page >= (data?.totalPages ?? 0) || isPending}
              className={cn(
                'h-10 px-4 rounded-xl',
                'bg-gray-800/50 border-gray-700/50',
                'text-gray-300 hover:text-white hover:bg-gray-800',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              التالي
              <ChevronLeft className="h-4 w-4 mr-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductList