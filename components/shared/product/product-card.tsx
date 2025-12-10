// components/shared/product/product-card.tsx
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.model'
import Rating from './rating'
import { cn, formatNumber, generateId, round2 } from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'
import AddToCart from './add-to-cart'
import { 
  Heart, 
  Eye, 
  // ❌ تم إزالة: ShoppingCart, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  Percent,
  Star
} from 'lucide-react'

// 🔹 أنواع الـ Variant
type ProductCardVariant = 'default' | 'deals' | 'bestseller' | 'featured' | 'compact'

interface ProductCardProps {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
  hideAddToCart?: boolean
  variant?: ProductCardVariant
}

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
  variant = 'default',
}: ProductCardProps) => {
  
  // 🔹 حساب نسبة الخصم
  const discountPercent = product.listPrice > product.price 
    ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100)
    : 0

  // 🔹 التحقق من نوع المنتج
  const isDeal = product.tags?.includes('todays-deal')
  const isBestSeller = product.tags?.includes('best-seller')
  const isNewArrival = product.tags?.includes('new-arrival')
  // ❌ تم إزالة: const isFeatured = product.tags?.includes('featured')
  const isLowStock = product.countInStock <= 5 && product.countInStock > 0
  const isOutOfStock = product.countInStock === 0

  // 🔹 أنماط الـ Variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'deals':
        return {
          badge: 'from-red-500 to-orange-500',
          ring: 'group-hover:ring-red-500/30',
          icon: Flame,
        }
      case 'bestseller':
        return {
          badge: 'from-emerald-500 to-teal-500',
          ring: 'group-hover:ring-emerald-500/30',
          icon: TrendingUp,
        }
      case 'featured':
        return {
          badge: 'from-purple-500 to-pink-500',
          ring: 'group-hover:ring-purple-500/30',
          icon: Sparkles,
        }
      default:
        return {
          badge: 'from-primary to-amber-500',
          ring: 'group-hover:ring-primary/30',
          icon: Star,
        }
    }
  }

  const variantStyles = getVariantStyles()

  // 🔹 مكون الصورة
  const ProductImage = () => (
    <Link 
      href={`/product/${product.slug}`}
      className='block relative overflow-hidden rounded-xl bg-muted/30'
    >
      <div className='relative aspect-square'>
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes='(max-width: 768px) 50vw, 25vw'
            className={cn(
              'object-contain p-2',
              'transition-transform duration-500 ease-out',
              'group-hover:scale-110'
            )}
          />
        )}

        {/* 🔹 Overlay عند Hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          🔹 الـ Badges
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className='absolute top-2 left-2 right-2 flex items-start justify-between pointer-events-none'>
        <div className='flex flex-col gap-1.5'>
          {/* 🔹 Badge الخصم */}
          {discountPercent > 0 && (
            <span className='inline-flex items-center gap-1 px-2 py-1
                             bg-gradient-to-r from-red-500 to-pink-500
                             text-white text-xs font-bold
                             rounded-lg shadow-lg shadow-red-500/30'>
              <Percent className='w-3 h-3' />
              {discountPercent}%-
            </span>
          )}

          {/* 🔹 Badge عرض اليوم */}
          {isDeal && (
            <span className='inline-flex items-center gap-1 px-2 py-1
                             bg-gradient-to-r from-orange-500 to-amber-500
                             text-white text-xs font-bold
                             rounded-lg shadow-lg shadow-orange-500/30
                             animate-pulse'>
              <Flame className='w-3 h-3' />
              HOT
            </span>
          )}

          {/* 🔹 Badge الأكثر مبيعاً */}
          {isBestSeller && !isDeal && (
            <span className='inline-flex items-center gap-1 px-2 py-1
                             bg-gradient-to-r from-emerald-500 to-teal-500
                             text-white text-xs font-bold
                             rounded-lg shadow-lg shadow-emerald-500/30'>
              <TrendingUp className='w-3 h-3' />
              TOP
            </span>
          )}

          {/* 🔹 Badge جديد */}
          {isNewArrival && !isDeal && !isBestSeller && (
            <span className='inline-flex items-center gap-1 px-2 py-1
                             bg-gradient-to-r from-blue-500 to-cyan-500
                             text-white text-xs font-bold
                             rounded-lg shadow-lg shadow-blue-500/30'>
              <Sparkles className='w-3 h-3' />
              NEW
            </span>
          )}
        </div>

        {/* 🔹 Badge الكمية المنخفضة */}
        {isLowStock && (
          <span className='px-2 py-1
                           bg-amber-500/90 backdrop-blur-sm
                           text-white text-[10px] font-semibold
                           rounded-lg'>
            آخر {product.countInStock} قطع
          </span>
        )}
      </div>

      {/* 🔹 أزرار الإجراءات السريعة */}
      <div className='absolute top-2 right-2 flex flex-col gap-2
                      opacity-0 group-hover:opacity-100
                      translate-x-4 group-hover:translate-x-0
                      transition-all duration-300
                      pointer-events-auto'>
        {/* 🔹 زر المفضلة */}
        <button 
          className='w-9 h-9 rounded-full
                     bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
                     border border-gray-200 dark:border-gray-700
                     flex items-center justify-center
                     text-gray-600 hover:text-red-500 dark:text-gray-300
                     hover:scale-110 active:scale-95
                     shadow-lg
                     transition-all duration-200'
          aria-label='Add to wishlist'
        >
          <Heart className='w-4 h-4' />
        </button>

        {/* 🔹 زر المعاينة السريعة */}
        <button 
          className='w-9 h-9 rounded-full
                     bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
                     border border-gray-200 dark:border-gray-700
                     flex items-center justify-center
                     text-gray-600 hover:text-primary dark:text-gray-300
                     hover:scale-110 active:scale-95
                     shadow-lg
                     transition-all duration-200'
          aria-label='Quick view'
        >
          <Eye className='w-4 h-4' />
        </button>
      </div>

      {/* 🔹 Overlay نفاد المخزون */}
      {isOutOfStock && (
        <div className='absolute inset-0 bg-black/60 backdrop-blur-[2px]
                        flex items-center justify-center'>
          <span className='px-4 py-2 bg-white/90 dark:bg-gray-900/90 
                           text-gray-900 dark:text-white font-bold text-sm
                           rounded-lg'>
            نفد المخزون
          </span>
        </div>
      )}
    </Link>
  )

  // 🔹 مكون التفاصيل
  const ProductDetails = () => (
    <div className='flex flex-col gap-2'>
      {/* 🔹 الماركة */}
      <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
        {product.brand}
      </p>

      {/* 🔹 اسم المنتج */}
      <Link
        href={`/product/${product.slug}`}
        className='font-semibold text-foreground leading-tight
                   hover:text-primary transition-colors duration-200
                   line-clamp-2 min-h-[2.5rem]'
      >
        {product.name}
      </Link>

      {/* 🔹 التقييم */}
      <div className='flex items-center justify-center gap-2'>
        <Rating rating={product.avgRating} />
        <span className='text-xs text-muted-foreground'>
          ({formatNumber(product.numReviews)})
        </span>
      </div>

      {/* 🔹 السعر */}
      <div className='mt-1'>
        <ProductPrice
          isDeal={isDeal}
          price={product.price}
          listPrice={product.listPrice}
          forListing
        />
      </div>
    </div>
  )

  // 🔹 زر الإضافة للسلة
  const AddButton = () => (
    <div className='w-full'>
      {isOutOfStock ? (
        <button 
          disabled
          className='w-full py-2.5 px-4 rounded-xl
                     bg-gray-100 dark:bg-gray-800
                     text-gray-400 dark:text-gray-500
                     font-medium text-sm
                     cursor-not-allowed'
        >
          غير متوفر
        </button>
      ) : (
        <div className='relative group/btn'>
          <AddToCart
            minimal
            item={{
              clientId: generateId(),
              product: product._id,
              size: product.sizes[0],
              color: product.colors[0],
              countInStock: product.countInStock,
              name: product.name,
              slug: product.slug,
              category: product.category,
              price: round2(product.price),
              quantity: 1,
              image: product.images[0],
            }}
          />
        </div>
      )}
    </div>
  )

  // 🔹 العرض بدون Border
  if (hideBorder) {
    return (
      <div className={cn(
        'group relative flex flex-col h-full',
        'rounded-2xl',
        'transition-all duration-300',
        'hover:-translate-y-1'
      )}>
        <ProductImage />
        {!hideDetails && (
          <div className='p-3 flex-1 flex flex-col'>
            <div className='flex-1 text-center'>
              <ProductDetails />
            </div>
            {!hideAddToCart && (
              <div className='mt-3'>
                <AddButton />
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // 🔹 العرض مع Border (Card)
  return (
    <Card className={cn(
      'group relative flex flex-col h-full overflow-hidden',
      'rounded-2xl',
      'border border-border/50',
      'bg-card/80 backdrop-blur-sm',
      'shadow-sm hover:shadow-xl',
      'transition-all duration-300',
      'hover:-translate-y-1',
      `ring-0 hover:ring-2 ${variantStyles.ring}`
    )}>
      <CardHeader className='p-3 pb-0'>
        <ProductImage />
      </CardHeader>

      {!hideDetails && (
        <>
          <CardContent className='p-4 flex-1 text-center'>
            <ProductDetails />
          </CardContent>

          {!hideAddToCart && (
            <CardFooter className='p-4 pt-0'>
              <AddButton />
            </CardFooter>
          )}
        </>
      )}

      {/* 🔹 تأثير التوهج على الـ Card */}
      <div className={cn(
        'absolute inset-0 -z-10 opacity-0 group-hover:opacity-100',
        'bg-gradient-to-t from-primary/5 via-transparent to-transparent',
        'transition-opacity duration-500',
        'pointer-events-none'
      )} />
    </Card>
  )
}

export default ProductCard