// app/[locale]/(root)/product/[slug]/review-list.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Calendar, 
  StarIcon, 
  ThumbsUp, 
  ThumbsDown,
  MessageSquare,
  Loader2,
  Sparkles,
  Filter,
  ChevronDown,
  CheckCircle2,
  PenLine,
  Send
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  createUpdateReview,
  getReviewByProductId,
  getReviews,
} from '@/lib/actions/review.actions'
import { ReviewInputSchema } from '@/lib/validator'
import RatingSummary from '@/components/shared/product/rating-summary'
import { IProduct } from '@/lib/db/models/product.model'
import { IReviewDetails } from '@/types'
import { cn } from '@/lib/utils'

const reviewFormDefaultValues = {
  title: '',
  comment: '',
  rating: 0,
}

export default function ReviewList({
  userId,
  product,
}: {
  userId: string | undefined
  product: IProduct
}) {
  const t = useTranslations('Product')
  const [page, setPage] = useState(2)
  const [totalPages, setTotalPages] = useState(0)
  const [reviews, setReviews] = useState<IReviewDetails[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const { ref, inView } = useInView({ triggerOnce: true })
  const { toast } = useToast()

  const reload = async () => {
    try {
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
    } catch {
      toast({
        variant: 'destructive',
        description: t('Error in fetching reviews'),
      })
    }
  }

  const loadMoreReviews = async () => {
    if (totalPages !== 0 && page > totalPages) return
    setLoadingReviews(true)
    const res = await getReviews({ productId: product._id, page })
    setLoadingReviews(false)
    setReviews([...reviews, ...res.data])
    setTotalPages(res.totalPages)
    setPage(page + 1)
  }

  useEffect(() => {
    const loadReviews = async () => {
      setLoadingReviews(true)
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
      setLoadingReviews(false)
    }

    if (inView) {
      loadReviews()
    }
  }, [inView, product._id])

  type CustomerReview = z.infer<typeof ReviewInputSchema>
  const form = useForm<CustomerReview>({
    resolver: zodResolver(ReviewInputSchema),
    defaultValues: reviewFormDefaultValues,
  })
  
  const [open, setOpen] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const onSubmit: SubmitHandler<CustomerReview> = async (values) => {
    const res = await createUpdateReview({
      data: { ...values, product: product._id },
      path: `/product/${product.slug}`,
    })
    if (!res.success)
      return toast({
        variant: 'destructive',
        description: res.message,
      })
    setOpen(false)
    reload()
    toast({
      description: res.message,
    })
  }

  const handleOpenForm = async () => {
    form.setValue('product', product._id)
    form.setValue('user', userId!)
    form.setValue('isVerifiedPurchase', true)
    const review = await getReviewByProductId({ productId: product._id })
    if (review) {
      form.setValue('title', review.title)
      form.setValue('comment', review.comment)
      form.setValue('rating', review.rating)
      setSelectedRating(review.rating)
    }
    setOpen(true)
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'اليوم'
    if (diffInDays === 1) return 'أمس'
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`
    if (diffInDays < 30) return `منذ ${Math.floor(diffInDays / 7)} أسابيع`
    if (diffInDays < 365) return `منذ ${Math.floor(diffInDays / 30)} أشهر`
    return `منذ ${Math.floor(diffInDays / 365)} سنوات`
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        
        {/* العمود الجانبي */}
        <div className='lg:col-span-1 space-y-6'>
          {reviews.length !== 0 && (
            <div className='p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 
                            dark:from-amber-950/30 dark:to-orange-950/30
                            border border-amber-200/50 dark:border-amber-800/50'>
              <RatingSummary
                avgRating={product.avgRating}
                numReviews={product.numReviews}
                ratingDistribution={product.ratingDistribution}
              />
            </div>
          )}

          <div className='p-5 rounded-2xl bg-white dark:bg-gray-900
                          border border-gray-200 dark:border-gray-800'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 rounded-xl bg-gradient-to-br from-primary/10 to-amber-500/10'>
                <PenLine className='w-5 h-5 text-primary' />
              </div>
              <h3 className='font-bold text-lg'>
                {t('Review this product')}
              </h3>
            </div>
            
            <p className='text-sm text-muted-foreground mb-4'>
              {t('Share your thoughts with other customers')}
            </p>
            
            {userId ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <Button
                  onClick={handleOpenForm}
                  className='w-full h-11 rounded-xl
                             bg-gradient-to-r from-primary to-amber-500
                             hover:from-primary/90 hover:to-amber-500/90
                             text-white font-semibold
                             shadow-lg shadow-primary/25
                             hover:shadow-xl hover:shadow-primary/30
                             transition-all duration-300
                             hover:scale-[1.02] active:scale-[0.98]
                             group'
                >
                  <MessageSquare className='w-5 h-5 ml-2 group-hover:scale-110 transition-transform' />
                  {t('Write a customer review')}
                </Button>

                <DialogContent className='sm:max-w-[500px] p-0 overflow-hidden
                                          bg-white dark:bg-gray-900
                                          border-0 shadow-2xl rounded-2xl'>
                  <Form {...form}>
                    <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
                      <DialogHeader className='p-6 pb-4 bg-gradient-to-r from-primary/5 to-amber-500/5
                                               border-b border-gray-200 dark:border-gray-800'>
                        <div className='flex items-center gap-3'>
                          <div className='p-2 rounded-xl bg-gradient-to-br from-primary/10 to-amber-500/10'>
                            <Sparkles className='w-5 h-5 text-primary' />
                          </div>
                          <div>
                            <DialogTitle className='text-xl font-bold'>
                              {t('Write a customer review')}
                            </DialogTitle>
                            <DialogDescription className='text-sm'>
                              {product.name}
                            </DialogDescription>
                          </div>
                        </div>
                      </DialogHeader>

                      <div className='p-6 space-y-5'>
                        <FormField
                          control={form.control}
                          name='rating'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm font-medium flex items-center gap-2'>
                                <StarIcon className='w-4 h-4 text-amber-500' />
                                {t('Rating')}
                              </FormLabel>
                              <FormControl>
                                <div className='flex items-center gap-3'>
                                  <div className='flex gap-1'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type='button'
                                        onClick={() => {
                                          setSelectedRating(star)
                                          field.onChange(star)
                                        }}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className='p-1 transition-transform hover:scale-110'
                                      >
                                        <StarIcon 
                                          className={cn(
                                            'w-8 h-8 transition-colors duration-200',
                                            (hoverRating || selectedRating) >= star
                                              ? 'fill-amber-400 text-amber-400'
                                              : 'text-gray-300 dark:text-gray-600'
                                          )}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                  
                                  <span className='text-sm text-muted-foreground'>
                                    {selectedRating === 1 && 'سيء'}
                                    {selectedRating === 2 && 'مقبول'}
                                    {selectedRating === 3 && 'جيد'}
                                    {selectedRating === 4 && 'جيد جداً'}
                                    {selectedRating === 5 && 'ممتاز'}
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='title'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm font-medium'>
                                {t('Title')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('Enter title')}
                                  className='h-11 rounded-xl
                                             bg-gray-50 dark:bg-gray-800/50
                                             border-gray-200 dark:border-gray-700
                                             focus:border-primary focus:ring-2 focus:ring-primary/20'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name='comment'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-sm font-medium'>
                                {t('Comment')}
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t('Enter comment')}
                                  rows={4}
                                  className='rounded-xl resize-none
                                             bg-gray-50 dark:bg-gray-800/50
                                             border-gray-200 dark:border-gray-700
                                             focus:border-primary focus:ring-2 focus:ring-primary/20'
                                  {...field}
                                />
                              </FormControl>
                              <p className='text-xs text-muted-foreground mt-1'>
                                {field.value?.length || 0}/500 حرف
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter className='p-6 pt-4 bg-gray-50 dark:bg-gray-800/50
                                               border-t border-gray-200 dark:border-gray-800'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => setOpen(false)}
                          className='rounded-xl'
                        >
                          إلغاء
                        </Button>
                        <Button
                          type='submit'
                          disabled={form.formState.isSubmitting}
                          className='rounded-xl bg-gradient-to-r from-primary to-amber-500
                                     hover:from-primary/90 hover:to-amber-500/90
                                     text-white font-semibold
                                     shadow-lg shadow-primary/25
                                     disabled:opacity-70'
                        >
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2 className='w-4 h-4 ml-2 animate-spin' />
                              {t('Submitting...')}
                            </>
                          ) : (
                            <>
                              <Send className='w-4 h-4 ml-2' />
                              {t('Submit')}
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              <div className='p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50
                              border border-gray-200 dark:border-gray-700 text-center'>
                <p className='text-sm text-muted-foreground mb-3'>
                  سجل دخولك لكتابة مراجعة
                </p>
                <Link 
                  href={`/sign-in?callbackUrl=/product/${product.slug}`}
                  className='inline-flex items-center gap-2 px-4 py-2
                             bg-primary/10 text-primary font-medium text-sm
                             rounded-lg hover:bg-primary/20 transition-colors'
                >
                  {t('sign in')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* قائمة المراجعات */}
        <div className='lg:col-span-3 space-y-4'>
          {reviews.length > 0 && (
            <div className='flex items-center justify-between p-4 rounded-xl
                            bg-white dark:bg-gray-900
                            border border-gray-200 dark:border-gray-800'>
              <p className='text-sm text-muted-foreground'>
                عرض <span className='font-semibold text-foreground'>{reviews.length}</span> من{' '}
                <span className='font-semibold text-foreground'>{product.numReviews}</span> مراجعة
              </p>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-[160px] h-9 rounded-lg'>
                  <Filter className='w-4 h-4 ml-2' />
                  <SelectValue placeholder='ترتيب حسب' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='newest'>الأحدث</SelectItem>
                  <SelectItem value='highest'>الأعلى تقييماً</SelectItem>
                  <SelectItem value='lowest'>الأقل تقييماً</SelectItem>
                  <SelectItem value='helpful'>الأكثر فائدة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {reviews.length === 0 && !loadingReviews && (
            <div className='text-center py-12'>
              <div className='w-20 h-20 mx-auto mb-4 rounded-full
                              bg-gradient-to-br from-gray-100 to-gray-50
                              dark:from-gray-800 dark:to-gray-900
                              flex items-center justify-center'>
                <MessageSquare className='w-10 h-10 text-gray-400' />
              </div>
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                {t('No reviews yet')}
              </h3>
              <p className='text-muted-foreground text-sm mb-4'>
                كن أول من يشارك رأيه في هذا المنتج
              </p>
            </div>
          )}

          <div className='space-y-4'>
            {reviews.map((review: IReviewDetails, index) => (
              <Card 
                key={review._id}
                className='rounded-2xl border-0 shadow-sm overflow-hidden
                           bg-white dark:bg-gray-900
                           hover:shadow-md transition-shadow duration-300'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-full
                                      bg-gradient-to-br from-primary/20 to-amber-500/20
                                      flex items-center justify-center
                                      border-2 border-white dark:border-gray-800
                                      shadow-sm'>
                        <span className='text-sm font-bold text-primary'>
                          {review.user ? review.user.name?.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      
                      <div>
                        <div className='flex items-center gap-2'>
                          <span className='font-semibold text-foreground'>
                            {review.user ? review.user.name : t('Deleted User')}
                          </span>
                          <span className='inline-flex items-center gap-1 px-2 py-0.5
                                           bg-emerald-100 dark:bg-emerald-900/30
                                           text-emerald-700 dark:text-emerald-400
                                           text-[10px] font-semibold rounded-full'>
                            <CheckCircle2 className='w-3 h-3' />
                            {t('Verified Purchase')}
                          </span>
                        </div>
                        
                        <div className='flex items-center gap-2 text-xs text-muted-foreground mt-0.5'>
                          <Calendar className='w-3 h-3' />
                          {getTimeAgo(new Date(review.createdAt))}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-1 px-2 py-1 rounded-lg
                                    bg-amber-50 dark:bg-amber-900/20'>
                      <StarIcon className='w-4 h-4 fill-amber-400 text-amber-400' />
                      <span className='text-sm font-bold text-amber-700 dark:text-amber-400'>
                        {review.rating}
                      </span>
                    </div>
                  </div>

                  <CardTitle className='text-base font-bold mt-3'>
                    {review.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className='pt-0'>
                  <CardDescription className='text-foreground/80 leading-relaxed'>
                    {review.comment}
                  </CardDescription>

                  <div className='flex items-center gap-4 mt-4 pt-4
                                  border-t border-gray-100 dark:border-gray-800'>
                    <span className='text-xs text-muted-foreground'>
                      هل كانت هذه المراجعة مفيدة؟
                    </span>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 px-3 rounded-lg text-muted-foreground
                                   hover:text-emerald-600 hover:bg-emerald-50 
                                   dark:hover:bg-emerald-900/20'
                      >
                        <ThumbsUp className='w-4 h-4 ml-1' />
                        <span className='text-xs'>نعم</span>
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 px-3 rounded-lg text-muted-foreground
                                   hover:text-red-600 hover:bg-red-50 
                                   dark:hover:bg-red-900/20'
                      >
                        <ThumbsDown className='w-4 h-4 ml-1' />
                        <span className='text-xs'>لا</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {loadingReviews && (
            <div className='space-y-4'>
              {[1, 2].map((i) => (
                <Card key={i} className='rounded-2xl animate-pulse'>
                  <CardHeader>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700' />
                      <div className='space-y-2'>
                        <div className='h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded' />
                        <div className='h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded' />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-2'>
                      <div className='h-4 w-full bg-gray-200 dark:bg-gray-700 rounded' />
                      <div className='h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded' />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div ref={ref} className='text-center pt-4'>
            {page <= totalPages && !loadingReviews && (
              <Button 
                variant='outline'
                onClick={loadMoreReviews}
                className='rounded-xl px-6'
              >
                <ChevronDown className='w-4 h-4 ml-2' />
                {t('See more reviews')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
