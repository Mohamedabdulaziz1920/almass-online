import {
  CarouselSchema,
  CartSchema,
  DeliveryDateSchema,
  OrderInputSchema,
  OrderItemSchema,
  OrderStatusEnum,
  StatusHistorySchema,
  UpdateOrderStatusSchema,
  BulkUpdateOrderStatusSchema,
  PaymentMethodSchema,
  ProductInputSchema,
  ReviewInputSchema,
  SettingInputSchema,
  ShippingAddressSchema,
  SiteCurrencySchema,
  SiteLanguageSchema,
  UserInputSchema,
  UserNameSchema,
  UserSignInSchema,
  UserSignUpSchema,
  CategoryInputSchema,
  WebPageInputSchema,
} from '@/lib/validator'
import { z } from 'zod'

export type IReviewInput = z.infer<typeof ReviewInputSchema>
export type IReviewDetails = IReviewInput & {
  _id: string
  createdAt: string
  user: {
    name: string
  }
}

export type IProductInput = z.infer<typeof ProductInputSchema>

// ✅✅✅ تم إضافة هذا التعريف لحل المشكلة ✅✅✅
export type IProduct = IProductInput & {
  _id: string
  createdAt: Date
  updatedAt: Date
}
export type ProductType = IProduct
// ---------------------------------------------

export type Data = {
  settings: ISettingInput[]
  webPages: IWebPageInput[]
  users: IUserInput[]
  products: IProductInput[]
  reviews: {
    title: string
    rating: number
    comment: string
  }[]
  headerMenus: {
    name: string
    href: string
  }[]
  carousels: {
    image: string
    url: string
    title: string
    buttonCaption: string
    isPublished: boolean
  }[]
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 أنواع حالات الطلب
// ═══════════════════════════════════════════════════════════════════════════
export type OrderStatus = 
  | 'pending'      // جاري الانتظار
  | 'processing'   // قيد التحضير
  | 'shipped'      // تم الشحن
  | 'delivered'    // تم التوصيل
  | 'completed'    // مكتمل
  | 'cancelled'    // ملغي
  | 'rejected'     // مرفوض

// ═══════════════════════════════════════════════════════════════════════════
// 📋 واجهة سجل الحالة
// ═══════════════════════════════════════════════════════════════════════════
export interface IStatusHistory {
  status: OrderStatus
  timestamp: Date
  note?: string
}

// ═══════════════════════════════════════════════════════════════════════════
// 📦 Order - الطلبات
// ═══════════════════════════════════════════════════════════════════════════
export type IOrderInput = z.infer<typeof OrderInputSchema>

export type IOrderList = IOrderInput & {
  _id: string
  user: {
    _id?: string
    name: string
    email: string
  }
  
  // حقول الحالة
  status: OrderStatus
  statusHistory?: IStatusHistory[]
  
  // حقول الدفع
  isPaid: boolean
  paidAt?: Date
  
  // حقول التوصيل
  isDelivered: boolean
  deliveredAt?: Date
  shippedAt?: Date
  
  // حقول الإكمال
  completedAt?: Date
  
  // حقول الإلغاء
  isCancelled?: boolean
  cancelledAt?: Date
  cancellationReason?: string
  
  // حقول الرفض
  isRejected?: boolean
  rejectedAt?: Date
  rejectionReason?: string
  
  // ملاحظات
  notes?: string
  
  // التواريخ
  createdAt: Date
  updatedAt?: Date
}
export type OrderStatusType = z.infer<typeof OrderStatusEnum>
export type IStatusHistory = z.infer<typeof StatusHistorySchema>
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>
export type BulkUpdateOrderStatusInput = z.infer<typeof BulkUpdateOrderStatusSchema>
export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

// user
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IUserName = z.infer<typeof UserNameSchema>

// webpage
export type IWebPageInput = z.infer<typeof WebPageInputSchema>

// setting
export type ICarousel = z.infer<typeof CarouselSchema>
export type ISettingInput = z.infer<typeof SettingInputSchema>
export type ClientSetting = ISettingInput & {
  currency: string
}
export type SiteLanguage = z.infer<typeof SiteLanguageSchema>
export type SiteCurrency = z.infer<typeof SiteCurrencySchema>
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
export type DeliveryDate = z.infer<typeof DeliveryDateSchema>

// 2. أضف تعريفات الفئة (Category)
export type ICategoryInput = z.infer<typeof CategoryInputSchema>

export type CategoryType = ICategoryInput & {
  _id: string
  createdAt: Date
  updatedAt: Date
}