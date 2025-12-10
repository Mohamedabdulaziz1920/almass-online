// app/[locale]/(root)/product/[slug]/page.tsx
import { auth } from '@/auth'
import AddToCart from '@/components/shared/product/add-to-cart'
import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from '@/lib/actions/product.actions'
import ReviewList from './review-list'
import { generateId, round2 } from '@/lib/utils'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import AddToBrowsingHistory from '@/components/shared/product/add-to-browsing-history'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import RatingSummary from '@/components/shared/product/rating-summary'
import ProductSlider from '@/components/shared/product/product-slider'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { 
  ChevronRight,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Package,
  CheckCircle2,
  AlertCircle,
  Flame,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Award,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const t = await getTranslations()
  const params = await props.params
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return { title: t('Product.Product not found') }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page: string; color: string; size: string }>
}) {
  const searchParams = await props.searchParams
  const { page, color, size } = searchParams
  const params = await props.params
  const { slug } = params
  const session = await auth()

  const product = await getProductBySlug(slug)

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId: product._id,
    page: Number(page || '1'),
  })

  const t = await getTranslations()

  // 🔹 حساب نسبة الخصم
  const discountPercent = product.listPrice > product.price 
    ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100)
    : 0

  // 🔹 التحقق من نوع المنتج
  const isDeal = product.tags?.includes('todays-deal')
  const isBestSeller = product.tags?.includes('best-seller')
  const isNewArrival = product.tags?.includes('new-arrival')

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      <AddToBrowsingHistory id={product._id} category={product.category} />
      
      {/* ═══════════════════════════════════════════════════════════════════════
          🔹 Breadcrumb
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className='bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'>
        <div className='container mx-auto px-4 py-3'>
          <nav className='flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto'>
            <Link href='/' className='hover:text-primary transition-colors whitespace-nowrap'>
              {t('Product.Home')}
            </Link>
            <ChevronRight className='w-4 h-4 flex-shrink-0 rtl:rotate-180' />
            <Link href={`/search?category=${product.category}`} className='hover:text-primary transition-colors whitespace-nowrap'>
              {product.category}
            </Link>
            <ChevronRight className='w-4 h-4 flex-shrink-0 rtl:rotate-180' />
            <span className='text-foreground font-medium truncate max-w-[200px]'>
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          🔹 القسم الرئيسي
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className='container mx-auto px-4 py-6 md:py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8'>
          
          {/* ═══════════════════════════════════════════════════════════════════
              🔹 معرض الصور
              ═══════════════════════════════════════════════════════════════════ */}
          <div className='lg:col-span-5'>
            <div className='sticky top-24'>
              {/* 🔹 Badges */}
              <div className='absolute top-4 left-4 z-10 flex flex-col gap-2'>
                {discountPercent > 0 && (
                  <span className='inline-flex items-center gap-1 px-3 py-1.5
                                   bg-gradient-to-r from-red-500 to-pink-500
                                   text-white text-sm font-bold
                                   rounded-full shadow-lg shadow-red-500/30'>
                    -{discountPercent}%
                  </span>
                )}
                {isDeal && (
                  <span className='inline-flex items-center gap-1 px-3 py-1.5
                                   bg-gradient-to-r from-orange-500 to-amber-500
                                   text-white text-sm font-bold
                                   rounded-full shadow-lg shadow-orange-500/30
                                   animate-pulse'>
                    <Flame className='w-4 h-4' />
                    HOT
                  </span>
                )}
                {isBestSeller && (
                  <span className='inline-flex items-center gap-1 px-3 py-1.5
                                   bg-gradient-to-r from-emerald-500 to-teal-500
                                   text-white text-sm font-bold
                                   rounded-full shadow-lg shadow-emerald-500/30'>
                    <Award className='w-4 h-4' />
                    TOP
                  </span>
                )}
                {isNewArrival && (
                  <span className='inline-flex items-center gap-1 px-3 py-1.5
                                   bg-gradient-to-r from-blue-500 to-cyan-500
                                   text-white text-sm font-bold
                                   rounded-full shadow-lg shadow-blue-500/30'>
                    <Sparkles className='w-4 h-4' />
                    NEW
                  </span>
                )}
              </div>

              <ProductGallery images={product.images} />

              {/* 🔹 أزرار المشاركة والمفضلة */}
              <div className='flex items-center justify-center gap-3 mt-4'>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full gap-2 hover:text-red-500 hover:border-red-500'
                >
                  <Heart className='w-4 h-4' />
                  <span className='hidden sm:inline'>أضف للمفضلة</span>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full gap-2 hover:text-primary hover:border-primary'
                >
                  <Share2 className='w-4 h-4' />
                  <span className='hidden sm:inline'>مشاركة</span>
                </Button>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              🔹 تفاصيل المنتج
              ═══════════════════════════════════════════════════════════════════ */}
          <div className='lg:col-span-4 space-y-6'>
            {/* 🔹 الماركة والتصنيف */}
            <div className='flex items-center gap-2 flex-wrap'>
              <Link 
                href={`/search?brand=${product.brand}`}
                className='px-3 py-1 rounded-full
                           bg-primary/10 text-primary text-sm font-medium
                           hover:bg-primary/20 transition-colors'
              >
                {product.brand}
              </Link>
              <Link 
                href={`/search?category=${product.category}`}
                className='px-3 py-1 rounded-full
                           bg-gray-100 dark:bg-gray-800 text-muted-foreground text-sm
                           hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
              >
                {product.category}
              </Link>
            </div>

            {/* 🔹 اسم المنتج */}
            <h1 className='text-2xl md:text-3xl font-bold text-foreground leading-tight'>
              {product.name}
            </h1>

            {/* 🔹 التقييم */}
            <div className='flex items-center gap-4'>
              <RatingSummary
                avgRating={product.avgRating}
                numReviews={product.numReviews}
                asPopover
                ratingDistribution={product.ratingDistribution}
              />
              <Link 
                href='#reviews'
                className='text-sm text-primary hover:underline flex items-center gap-1'
              >
                <MessageCircle className='w-4 h-4' />
                {product.numReviews} {t('Product.Reviews')}
              </Link>
            </div>

            {/* 🔹 السعر */}
            <div className='p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 
                            dark:from-gray-800/50 dark:to-gray-800
                            border border-gray-200 dark:border-gray-700'>
              <ProductPrice
                price={product.price}
                listPrice={product.listPrice}
                isDeal={isDeal}
                forListing={false}
              />
              
              {discountPercent > 0 && (
                <p className='mt-2 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1'>
                  <CheckCircle2 className='w-4 h-4' />
                  وفّرت {discountPercent}% من السعر الأصلي
                </p>
              )}
            </div>

            {/* 🔹 اختيار اللون والحجم */}
            <div className='space-y-4'>
              <SelectVariant
                product={product}
                size={size || product.sizes[0]}
                color={color || product.colors[0]}
              />
            </div>

            {/* 🔹 الوصف */}
            <div className='space-y-3'>
              <h3 className='font-bold text-lg flex items-center gap-2'>
                <Package className='w-5 h-5 text-primary' />
                {t('Product.Description')}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {product.description}
              </p>
            </div>

            {/* 🔹 المميزات */}
            <div className='grid grid-cols-2 gap-3'>
              {[
                { icon: Truck, title: 'شحن سريع', desc: 'خلال 2-3 أيام', color: 'text-blue-500' },
                { icon: RefreshCcw, title: 'إرجاع مجاني', desc: 'خلال 30 يوم', color: 'text-emerald-500' },
                { icon: ShieldCheck, title: 'ضمان الجودة', desc: 'منتج أصلي 100%', color: 'text-purple-500' },
                { icon: Clock, title: 'دعم 24/7', desc: 'خدمة عملاء متميزة', color: 'text-amber-500' },
              ].map((feature, index) => (
                <div 
                  key={index}
                  className='p-3 rounded-xl bg-white dark:bg-gray-900
                             border border-gray-200 dark:border-gray-800
                             hover:border-primary/30 transition-colors'
                >
                  <feature.icon className={cn('w-5 h-5 mb-1', feature.color)} />
                  <p className='text-sm font-medium text-foreground'>{feature.title}</p>
                  <p className='text-xs text-muted-foreground'>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              🔹 بطاقة الشراء
              ═══════════════════════════════════════════════════════════════════ */}
          <div className='lg:col-span-3'>
            <div className='sticky top-24'>
              <Card className='rounded-2xl shadow-xl overflow-hidden
                               bg-white dark:bg-gray-900
                               border border-gray-200 dark:border-gray-800'>
                <CardContent className='p-5 space-y-5'>
                  {/* 🔹 السعر */}
                  <div className='text-center pb-4 border-b border-gray-200 dark:border-gray-800'>
                    <ProductPrice price={product.price} />
                    <p className='text-xs text-muted-foreground mt-1'>
                      شامل الضريبة
                    </p>
                  </div>

                  {/* 🔹 حالة المخزون */}
                  <div className='space-y-3'>
                    {product.countInStock > 0 ? (
                      <>
                        <div className='flex items-center gap-2 text-emerald-600 dark:text-emerald-400'>
                          <CheckCircle2 className='w-5 h-5' />
                          <span className='font-semibold'>{t('Product.In Stock')}</span>
                        </div>
                        
                        {product.countInStock <= 5 && (
                          <div className='flex items-center gap-2 p-3 rounded-xl
                                          bg-amber-50 dark:bg-amber-950/30
                                          border border-amber-200 dark:border-amber-800'>
                            <AlertCircle className='w-5 h-5 text-amber-500' />
                            <span className='text-sm text-amber-700 dark:text-amber-400 font-medium'>
                              {t('Product.Only X left in stock - order soon', {
                                count: product.countInStock,
                              })}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className='flex items-center gap-2 p-3 rounded-xl
                                      bg-red-50 dark:bg-red-950/30
                                      border border-red-200 dark:border-red-800'>
                        <AlertCircle className='w-5 h-5 text-red-500' />
                        <span className='text-red-600 dark:text-red-400 font-semibold'>
                          {t('Product.Out of Stock')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 🔹 التوصيل */}
                  <div className='p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-primary/10'>
                        <Truck className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-foreground'>
                          التوصيل المتوقع
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          خلال 2-3 أيام عمل
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 🔹 زر الإضافة للسلة */}
                  {product.countInStock > 0 && (
                    <AddToCart
                      item={{
                        clientId: generateId(),
                        product: product._id,
                        countInStock: product.countInStock,
                        name: product.name,
                        slug: product.slug,
                        category: product.category,
                        price: round2(product.price),
                        quantity: 1,
                        image: product.images[0],
                        size: size || product.sizes[0],
                        color: color || product.colors[0],
                      }}
                    />
                  )}

                  {/* 🔹 الضمانات */}
                  <div className='pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2'>
                    {[
                      { icon: ShieldCheck, text: 'ضمان المنتج الأصلي' },
                      { icon: RefreshCcw, text: 'إرجاع مجاني خلال 30 يوم' },
                      { icon: Truck, text: 'شحن مجاني للطلبات فوق 200 ريال' },
                    ].map((item, index) => (
                      <div key={index} className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <item.icon className='w-4 h-4 text-emerald-500' />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          🔹 قسم المراجعات
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className='container mx-auto px-4 py-8' id='reviews'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10
                          border border-amber-500/20'>
            <Star className='w-6 h-6 text-amber-500' />
          </div>
          <div>
            <h2 className='text-xl md:text-2xl font-bold text-foreground'>
              {t('Product.Customer Reviews')}
            </h2>
            <p className='text-sm text-muted-foreground'>
              {product.numReviews} تقييم من عملائنا
            </p>
          </div>
        </div>
        
        <Card className='rounded-2xl border-0 shadow-lg overflow-hidden
                         bg-white dark:bg-gray-900'>
          <CardContent className='p-6'>
            <ReviewList product={product} userId={session?.user.id} />
          </CardContent>
        </Card>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          🔹 المنتجات ذات الصلة
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className='container mx-auto px-4 py-8'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10
                          border border-purple-500/20'>
            <Package className='w-6 h-6 text-purple-500' />
          </div>
          <div>
            <h2 className='text-xl md:text-2xl font-bold text-foreground'>
              {t('Product.Best Sellers in', { name: product.category })}
            </h2>
            <p className='text-sm text-muted-foreground'>
              منتجات قد تعجبك
            </p>
          </div>
        </div>
        
        <ProductSlider
          products={relatedProducts.data}
          title=''
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          🔹 سجل التصفح
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className='container mx-auto px-4 py-8'>
        <BrowsingHistoryList />
      </section>
    </div>
  )
}