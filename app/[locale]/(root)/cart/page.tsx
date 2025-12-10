// app/[locale]/(root)/cart/page.tsx
'use client'

import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import ProductPrice from '@/components/shared/product/product-price'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import useCartStore from '@/hooks/use-cart-store'
import useSettingStore from '@/hooks/use-setting-store'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Package,
  ChevronLeft,
  Sparkles,
  Gift,
  AlertCircle,
  CheckCircle2,
  Heart
} from 'lucide-react'

export default function CartPage() {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()
  const router = useRouter()
  const {
    setting: {
    
      common: { freeShippingMinPrice },
    },
  } = useSettingStore()

  const t = useTranslations()
  
  // 🔹 حساب نسبة التقدم للشحن المجاني
  const shippingProgress = Math.min((itemsPrice / freeShippingMinPrice) * 100, 100)
  const remainingForFreeShipping = Math.max(freeShippingMinPrice - itemsPrice, 0)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      {/* ═══════════════════════════════════════════════════════════════════════
          🔹 الهيدر
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-xl bg-gradient-to-br from-primary/10 to-amber-500/10
                              border border-primary/20'>
                <ShoppingCart className='w-6 h-6 text-primary' />
              </div>
              <div>
                <h1 className='text-xl md:text-2xl font-bold text-foreground'>
                  {t('Cart.Shopping Cart')}
                </h1>
                <p className='text-sm text-muted-foreground'>
                  {totalItems} {t('Cart.Items')}
                </p>
              </div>
            </div>
            
            <Link 
              href='/'
              className='flex items-center gap-2 text-sm text-muted-foreground 
                         hover:text-primary transition-colors duration-200'
            >
              <span>متابعة التسوق</span>
              <ChevronLeft className='w-4 h-4 rtl:rotate-180' />
            </Link>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6 md:py-8'>
        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 حالة السلة الفارغة
            ═══════════════════════════════════════════════════════════════════════ */}
        {items.length === 0 ? (
          <div className='max-w-2xl mx-auto py-12'>
            <Card className='rounded-3xl shadow-xl overflow-hidden
                             bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
              <CardContent className='p-8 md:p-12 text-center'>
                {/* 🔹 أيقونة السلة الفارغة */}
                <div className='relative w-32 h-32 mx-auto mb-6'>
                  <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-amber-500/20 
                                  rounded-full blur-2xl animate-pulse' />
                  <div className='relative w-full h-full rounded-full 
                                  bg-gradient-to-br from-gray-100 to-gray-50 
                                  dark:from-gray-800 dark:to-gray-900
                                  border-2 border-dashed border-gray-300 dark:border-gray-700
                                  flex items-center justify-center'>
                    <ShoppingCart className='w-16 h-16 text-gray-400' />
                  </div>
                </div>

                <h2 className='text-2xl md:text-3xl font-bold text-foreground mb-3'>
                  {t('Cart.Your Shopping Cart is empty')}
                </h2>
                <p className='text-muted-foreground mb-8 max-w-md mx-auto'>
                  لم تقم بإضافة أي منتجات بعد. تصفح منتجاتنا واكتشف العروض المميزة!
                </p>

                <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                  <Link href='/'>
                    <Button 
                      className='w-full sm:w-auto h-12 px-8 rounded-xl
                                 bg-gradient-to-r from-primary to-amber-500
                                 hover:from-primary/90 hover:to-amber-500/90
                                 text-white font-semibold
                                 shadow-lg shadow-primary/25
                                 hover:shadow-xl hover:shadow-primary/30
                                 transition-all duration-300
                                 hover:scale-[1.02] active:scale-[0.98]
                                 group'
                    >
                      <Sparkles className='w-5 h-5 ml-2 group-hover:rotate-12 transition-transform' />
                      ابدأ التسوق الآن
                    </Button>
                  </Link>
                  <Link href='/search?tag=todays-deal'>
                    <Button 
                      variant='outline'
                      className='w-full sm:w-auto h-12 px-8 rounded-xl
                                 border-2 border-primary/20 hover:border-primary/40
                                 hover:bg-primary/5
                                 transition-all duration-300'
                    >
                      <Gift className='w-5 h-5 ml-2' />
                      عروض اليوم
                    </Button>
                  </Link>
                </div>

                {/* 🔹 مميزات */}
                <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-800'>
                  <div className='grid grid-cols-3 gap-4'>
                    {[
                      { icon: Truck, text: 'شحن مجاني' },
                      { icon: ShieldCheck, text: 'دفع آمن' },
                      { icon: Gift, text: 'هدايا مجانية' },
                    ].map((feature, index) => (
                      <div key={index} className='flex flex-col items-center gap-2'>
                        <div className='p-2 rounded-lg bg-gray-100 dark:bg-gray-800'>
                          <feature.icon className='w-5 h-5 text-primary' />
                        </div>
                        <span className='text-xs text-muted-foreground'>{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════════════
              🔹 السلة مع المنتجات
              ═══════════════════════════════════════════════════════════════════════ */
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* ═══════════════════════════════════════════════════════════════════
                🔹 قائمة المنتجات
                ═══════════════════════════════════════════════════════════════════ */}
            <div className='lg:col-span-2 space-y-4'>
              {/* 🔹 شريط الشحن المجاني */}
              <Card className='rounded-2xl shadow-lg overflow-hidden
                               bg-gradient-to-r from-emerald-50 to-teal-50 
                               dark:from-emerald-950/30 dark:to-teal-950/30
                               border border-emerald-200/50 dark:border-emerald-800/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='p-2 rounded-lg bg-emerald-500/10'>
                      <Truck className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
                    </div>
                    <div className='flex-1'>
                      {remainingForFreeShipping > 0 ? (
                        <p className='text-sm text-foreground'>
                          أضف{' '}
                          <span className='font-bold text-emerald-600 dark:text-emerald-400'>
                            <ProductPrice price={remainingForFreeShipping} plain />
                          </span>{' '}
                          للحصول على شحن مجاني!
                        </p>
                      ) : (
                        <p className='text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2'>
                          <CheckCircle2 className='w-4 h-4' />
                          مبروك! طلبك مؤهل للشحن المجاني
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* 🔹 شريط التقدم */}
                  <div className='h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden'>
                    <div 
                      className='h-full bg-gradient-to-r from-emerald-500 to-teal-500 
                                 rounded-full transition-all duration-500'
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 🔹 قائمة المنتجات */}
              <Card className='rounded-2xl shadow-lg overflow-hidden
                               bg-white dark:bg-gray-900'>
                <CardContent className='p-0'>
                  {items.map((item, index) => (
                    <div
                      key={item.clientId}
                      className={cn(
                        'group p-4 md:p-6 transition-colors duration-200',
                        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                        index !== items.length - 1 && 'border-b border-gray-100 dark:border-gray-800'
                      )}
                    >
                      <div className='flex gap-4 md:gap-6'>
                        {/* 🔹 صورة المنتج */}
                        <Link 
                          href={`/product/${item.slug}`}
                          className='relative flex-shrink-0'
                        >
                          <div className='relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden
                                          bg-gray-100 dark:bg-gray-800
                                          group-hover:shadow-lg transition-shadow duration-300'>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes='(max-width: 768px) 96px, 128px'
                              className='object-contain p-2 group-hover:scale-105 transition-transform duration-300'
                            />
                          </div>
                          
                          {/* 🔹 Badge الكمية على الموبايل */}
                          <span className='md:hidden absolute -top-2 -right-2 
                                           w-6 h-6 rounded-full 
                                           bg-primary text-white text-xs font-bold
                                           flex items-center justify-center
                                           shadow-lg'>
                            {item.quantity}
                          </span>
                        </Link>

                        {/* 🔹 تفاصيل المنتج */}
                        <div className='flex-1 min-w-0'>
                          <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                            <div className='space-y-2'>
                              <Link
                                href={`/product/${item.slug}`}
                                className='text-base md:text-lg font-semibold text-foreground
                                           hover:text-primary transition-colors duration-200
                                           line-clamp-2'
                              >
                                {item.name}
                              </Link>
                              
                              {/* 🔹 اللون والحجم */}
                              <div className='flex flex-wrap gap-3 text-sm text-muted-foreground'>
                                {item.color && (
                                  <span className='flex items-center gap-1.5'>
                                    <span className='w-3 h-3 rounded-full border-2 border-gray-300'
                                          style={{ backgroundColor: item.color }} />
                                    {item.color}
                                  </span>
                                )}
                                {item.size && (
                                  <span className='px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800'>
                                    {item.size}
                                  </span>
                                )}
                              </div>

                              {/* 🔹 حالة المخزون */}
                              <div className='flex items-center gap-2'>
                                {item.countInStock > 0 ? (
                                  <span className='text-xs text-emerald-600 dark:text-emerald-400 
                                                   flex items-center gap-1'>
                                    <CheckCircle2 className='w-3 h-3' />
                                    متوفر
                                  </span>
                                ) : (
                                  <span className='text-xs text-red-500 flex items-center gap-1'>
                                    <AlertCircle className='w-3 h-3' />
                                    غير متوفر
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* 🔹 السعر */}
                            <div className='text-left md:text-right'>
                              <div className='text-xl font-bold text-foreground'>
                                <ProductPrice price={item.price * item.quantity} plain />
                              </div>
                              {item.quantity > 1 && (
                                <p className='text-sm text-muted-foreground'>
                                  {item.quantity} × <ProductPrice price={item.price} plain />
                                </p>
                              )}
                            </div>
                          </div>

                          {/* 🔹 أزرار التحكم */}
                          <div className='flex items-center justify-between mt-4 pt-4 
                                          border-t border-gray-100 dark:border-gray-800'>
                            {/* 🔹 محدد الكمية */}
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-muted-foreground hidden sm:block'>
                                {t('Cart.Quantity')}:
                              </span>
                              <div className='flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1'>
                                <button
                                  onClick={() => item.quantity > 1 && updateItem(item, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className='w-8 h-8 rounded-lg flex items-center justify-center
                                             text-foreground hover:bg-white dark:hover:bg-gray-700
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             transition-colors duration-200'
                                >
                                  <Minus className='w-4 h-4' />
                                </button>
                                
                                <span className='w-12 text-center font-semibold text-foreground'>
                                  {item.quantity}
                                </span>
                                
                                <button
                                  onClick={() => item.quantity < item.countInStock && updateItem(item, item.quantity + 1)}
                                  disabled={item.quantity >= item.countInStock}
                                  className='w-8 h-8 rounded-lg flex items-center justify-center
                                             text-foreground hover:bg-white dark:hover:bg-gray-700
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             transition-colors duration-200'
                                >
                                  <Plus className='w-4 h-4' />
                                </button>
                              </div>
                            </div>

                            {/* 🔹 أزرار الإجراءات */}
                            <div className='flex items-center gap-2'>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-muted-foreground hover:text-red-500
                                           hover:bg-red-50 dark:hover:bg-red-950/30
                                           rounded-lg transition-colors duration-200'
                                onClick={() => removeItem(item)}
                              >
                                <Trash2 className='w-4 h-4 ml-1' />
                                <span className='hidden sm:inline'>{t('Cart.Delete')}</span>
                              </Button>
                              
                              <Button
                                variant='ghost'
                                size='sm'
                                className='text-muted-foreground hover:text-primary
                                           rounded-lg transition-colors duration-200'
                              >
                                <Heart className='w-4 h-4 ml-1' />
                                <span className='hidden sm:inline'>حفظ</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                🔹 ملخص الطلب
                ═══════════════════════════════════════════════════════════════════ */}
            <div className='lg:col-span-1'>
              <div className='sticky top-24 space-y-4'>
                <Card className='rounded-2xl shadow-lg overflow-hidden
                                 bg-white dark:bg-gray-900'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-primary/10'>
                        <Package className='w-5 h-5 text-primary' />
                      </div>
                      <h3 className='font-bold text-lg'>ملخص الطلب</h3>
                    </div>
                  </CardHeader>
                  
                  <CardContent className='space-y-4'>
                    {/* 🔹 تفاصيل السعر */}
                    <div className='space-y-3'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>
                          المجموع الفرعي ({totalItems} منتج)
                        </span>
                        <span className='font-medium'>
                          <ProductPrice price={itemsPrice} plain />
                        </span>
                      </div>
                      
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>الشحن</span>
                        <span className={cn(
                          'font-medium',
                          remainingForFreeShipping <= 0 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : ''
                        )}>
                          {remainingForFreeShipping <= 0 ? 'مجاني' : 'يُحسب لاحقاً'}
                        </span>
                      </div>
                    </div>

                    <div className='border-t border-gray-200 dark:border-gray-800 pt-4'>
                      <div className='flex justify-between items-center'>
                        <span className='font-bold text-lg'>الإجمالي</span>
                        <span className='font-bold text-xl text-primary'>
                          <ProductPrice price={itemsPrice} plain />
                        </span>
                      </div>
                    </div>

                    {/* 🔹 زر الدفع */}
                    <Button
                      onClick={() => router.push('/checkout')}
                      className='w-full h-12 rounded-xl
                                 bg-gradient-to-r from-primary to-amber-500
                                 hover:from-primary/90 hover:to-amber-500/90
                                 text-white font-semibold text-base
                                 shadow-lg shadow-primary/25
                                 hover:shadow-xl hover:shadow-primary/30
                                 transition-all duration-300
                                 hover:scale-[1.02] active:scale-[0.98]
                                 group relative overflow-hidden'
                    >
                      <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                                      translate-x-[-100%] group-hover:translate-x-[100%]
                                      transition-transform duration-700' />
                      <span className='relative flex items-center justify-center gap-2'>
                        {t('Cart.Proceed to Checkout')}
                        <ArrowRight className='w-5 h-5 group-hover:translate-x-1 
                                               rtl:rotate-180 rtl:group-hover:-translate-x-1
                                               transition-transform duration-300' />
                      </span>
                    </Button>

                    {/* 🔹 طرق الدفع */}
                    <div className='pt-4 border-t border-gray-200 dark:border-gray-800'>
                      <div className='flex items-center justify-center gap-3 mb-3'>
                        <ShieldCheck className='w-4 h-4 text-emerald-500' />
                        <span className='text-xs text-muted-foreground'>دفع آمن 100%</span>
                      </div>
                      <div className='flex items-center justify-center gap-2'>
                        {['visa', 'master', 'mada', 'apple'].map((method) => (
                          <div 
                            key={method}
                            className='w-10 h-6 rounded bg-gray-100 dark:bg-gray-800
                                       flex items-center justify-center text-[8px] 
                                       text-gray-500 font-semibold uppercase'
                          >
                            {method}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 🔹 كود الخصم */}
                <Card className='rounded-2xl shadow-lg overflow-hidden
                                 bg-gradient-to-r from-purple-50 to-pink-50
                                 dark:from-purple-950/30 dark:to-pink-950/30
                                 border border-purple-200/50 dark:border-purple-800/50'>
                  <CardContent className='p-4'>
                    <div className='flex items-center gap-3 mb-3'>
                      <Gift className='w-5 h-5 text-purple-600 dark:text-purple-400' />
                      <span className='font-medium text-foreground'>لديك كود خصم؟</span>
                    </div>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        placeholder='أدخل الكود'
                        className='flex-1 px-4 py-2 rounded-lg
                                   bg-white dark:bg-gray-900
                                   border border-gray-200 dark:border-gray-700
                                   text-sm focus:outline-none focus:ring-2 
                                   focus:ring-purple-500/20 focus:border-purple-500'
                      />
                      <Button
                        variant='outline'
                        className='border-purple-300 dark:border-purple-700
                                   hover:bg-purple-100 dark:hover:bg-purple-900/50
                                   text-purple-600 dark:text-purple-400'
                      >
                        تطبيق
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            🔹 سجل التصفح
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className='mt-12'>
          <BrowsingHistoryList />
        </div>
      </div>
    </div>
  )
}