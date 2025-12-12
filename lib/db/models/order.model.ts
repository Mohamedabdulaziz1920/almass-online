import { IOrderInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 تعريف أنواع الحالات
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
// 📋 واجهة الطلب
// ═══════════════════════════════════════════════════════════════════════════
export interface IOrder extends Document, IOrderInput {
  _id: string
  
  // حقول الحالة الجديدة
  status: OrderStatus
  statusHistory: IStatusHistory[]
  
  // حقول الشحن
  shippedAt?: Date
  
  // حقول الإكمال
  completedAt?: Date
  
  // حقول الإلغاء
  isCancelled: boolean
  cancelledAt?: Date
  cancellationReason?: string
  
  // حقول الرفض
  isRejected: boolean
  rejectedAt?: Date
  rejectionReason?: string
  
  // ملاحظات
  notes?: string
  
  // التواريخ
  createdAt: Date
  updatedAt: Date
}

// ═══════════════════════════════════════════════════════════════════════════
// 📋 مخطط سجل الحالة
// ═══════════════════════════════════════════════════════════════════════════
const statusHistorySchema = new Schema<IStatusHistory>(
  {
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'rejected'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
    },
  },
  { _id: false }
)

// ═══════════════════════════════════════════════════════════════════════════
// 📋 مخطط الطلب
// ═══════════════════════════════════════════════════════════════════════════
const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        clientId: { type: String, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      province: { type: String, required: true },
      phone: { type: String, required: true },
    },
    expectedDeliveryDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    paymentResult: { id: String, status: String, email_address: String },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    
    // حقول الدفع
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    
    // حقول التوصيل
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    shippedAt: { type: Date },
    
    // ═══════════════════════════════════════════════════════════════════════
    // 🆕 الحقول الجديدة
    // ═══════════════════════════════════════════════════════════════════════
    
    // حقول الحالة
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    
    // حقول الإكمال
    completedAt: { type: Date },
    
    // حقول الإلغاء
    isCancelled: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    
    // حقول الرفض
    isRejected: { type: Boolean, default: false },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    
    // ملاحظات
    notes: { type: String },
    
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

// ═══════════════════════════════════════════════════════════════════════════
// 📋 فهارس للبحث السريع
// ═══════════════════════════════════════════════════════════════════════════
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })
orderSchema.index({ isPaid: 1 })
orderSchema.index({ isDelivered: 1 })
orderSchema.index({ isCancelled: 1 })
orderSchema.index({ isRejected: 1 })
orderSchema.index({ createdAt: -1 })

// ═══════════════════════════════════════════════════════════════════════════
// 📋 تصدير النموذج
// ═══════════════════════════════════════════════════════════════════════════
const Order =
  (models.Order as Model<IOrder>) || model<IOrder>('Order', orderSchema)

export default Order