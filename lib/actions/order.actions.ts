'use server'

import { Cart, IOrderList, OrderItem, ShippingAddress, OrderStatus } from '@/types'
import { formatError, round2 } from '../utils'
import { connectToDatabase } from '../db'
import { auth } from '@/auth'
import { OrderInputSchema } from '../validator'
import Order, { IOrder } from '../db/models/order.model'
import { revalidatePath } from 'next/cache'
import { sendAskReviewOrderItems, sendPurchaseReceipt } from '@/emails'
import { paypal } from '../paypal'
import { DateRange } from 'react-day-picker'
import Product from '../db/models/product.model'
import User from '../db/models/user.model'
import mongoose from 'mongoose'
import { getSetting } from './setting.actions'

// ═══════════════════════════════════════════════════════════════════════════
// 📦 CREATE - إنشاء طلب جديد
// ═══════════════════════════════════════════════════════════════════════════
export const createOrder = async (clientSideCart: Cart) => {
  try {
    await connectToDatabase()
    const session = await auth()
    if (!session) throw new Error('User not authenticated')
    // recalculate price and delivery date on the server
    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    )
    return {
      success: true,
      message: 'Order placed successfully',
      data: { orderId: createdOrder._id.toString() },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  }

  const order = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  })
  return await Order.create(order)
}

// ═══════════════════════════════════════════════════════════════════════════
// 💳 تحديث حالة الدفع
// ═══════════════════════════════════════════════════════════════════════════
export async function updateOrderToPaid(orderId: string) {
  try {
    await connectToDatabase()
    const order = await Order.findById(orderId).populate<{
      user: { email: string; name: string }
    }>('user', 'name email')
    if (!order) throw new Error('Order not found')
    if (order.isPaid) throw new Error('Order is already paid')
    
    order.isPaid = true
    order.paidAt = new Date()
    
    // تحديث الحالة إلى قيد التحضير إذا كانت في الانتظار
    if (!order.status || order.status === 'pending') {
      order.status = 'processing'
      order.statusHistory = order.statusHistory || []
      order.statusHistory.push({
        status: 'processing',
        timestamp: new Date(),
        note: 'تم الدفع - بدء التحضير تلقائياً',
      })
    }
    
    await order.save()
    if (!process.env.MONGODB_URI?.startsWith('mongodb://localhost'))
      await updateProductStock(order._id)
    if (order.user.email) await sendPurchaseReceipt({ order })
    revalidatePath(`/account/orders/${orderId}`)
    return { success: true, message: 'Order paid successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

const updateProductStock = async (orderId: string) => {
  const session = await mongoose.connection.startSession()

  try {
    session.startTransaction()
    const opts = { session }

    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { isPaid: true, paidAt: new Date() },
      opts
    )
    if (!order) throw new Error('Order not found')

    for (const item of order.items) {
      const product = await Product.findById(item.product).session(session)
      if (!product) throw new Error('Product not found')

      product.countInStock -= item.quantity
      await Product.updateOne(
        { _id: product._id },
        { countInStock: product.countInStock },
        opts
      )
    }
    await session.commitTransaction()
    session.endSession()
    return true
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🚚 تحديث حالة التوصيل
// ═══════════════════════════════════════════════════════════════════════════
export async function deliverOrder(orderId: string) {
  try {
    await connectToDatabase()
    const order = await Order.findById(orderId).populate<{
      user: { email: string; name: string }
    }>('user', 'name email')
    if (!order) throw new Error('Order not found')
    if (!order.isPaid) throw new Error('Order is not paid')
    
    order.isDelivered = true
    order.deliveredAt = new Date()
    
    // تحديث الحالة إلى تم التوصيل
    order.status = 'delivered'
    order.statusHistory = order.statusHistory || []
    order.statusHistory.push({
      status: 'delivered',
      timestamp: new Date(),
      note: 'تم توصيل الطلب',
    })
    
    await order.save()
    if (order.user.email) await sendAskReviewOrderItems({ order })
    revalidatePath(`/account/orders/${orderId}`)
    return { success: true, message: 'Order delivered successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🗑️ DELETE - حذف طلب
// ═══════════════════════════════════════════════════════════════════════════
export async function deleteOrder(id: string) {
  try {
    await connectToDatabase()
    const res = await Order.findByIdAndDelete(id)
    if (!res) throw new Error('Order not found')
    revalidatePath('/admin/orders')
    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📋 GET - جلب جميع الطلبات
// ═══════════════════════════════════════════════════════════════════════════
export async function getAllOrders({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const ordersCount = await Order.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(orders)) as IOrderList[],
    totalPages: Math.ceil(ordersCount / limit),
  }
}

export async function getMyOrders({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()
  const session = await auth()
  if (!session) {
    throw new Error('User is not authenticated')
  }
  const skipAmount = (Number(page) - 1) * limit
  const orders = await Order.find({
    user: session?.user?.id,
  })
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const ordersCount = await Order.countDocuments({ user: session?.user?.id })

  return {
    data: JSON.parse(JSON.stringify(orders)),
    totalPages: Math.ceil(ordersCount / limit),
  }
}

export async function getOrderById(orderId: string): Promise<IOrder> {
  await connectToDatabase()
  const order = await Order.findById(orderId)
  return JSON.parse(JSON.stringify(order))
}

// ═══════════════════════════════════════════════════════════════════════════
// 💰 PayPal - دوال الدفع
// ═══════════════════════════════════════════════════════════════════════════
export async function createPayPalOrder(orderId: string) {
  await connectToDatabase()
  try {
    const order = await Order.findById(orderId)
    if (order) {
      const paypalOrder = await paypal.createOrder(order.totalPrice)
      order.paymentResult = {
        id: paypalOrder.id,
        email_address: '',
        status: '',
        pricePaid: '0',
      }
      await order.save()
      return {
        success: true,
        message: 'PayPal order created successfully',
        data: paypalOrder.id,
      }
    } else {
      throw new Error('Order not found')
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  await connectToDatabase()
  try {
    const order = await Order.findById(orderId).populate('user', 'email')
    if (!order) throw new Error('Order not found')

    const captureData = await paypal.capturePayment(data.orderID)
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Error in paypal payment')
    
    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    }
    
    // تحديث الحالة
    if (!order.status || order.status === 'pending') {
      order.status = 'processing'
      order.statusHistory = order.statusHistory || []
      order.statusHistory.push({
        status: 'processing',
        timestamp: new Date(),
        note: 'تم الدفع عبر PayPal - بدء التحضير',
      })
    }
    
    await order.save()
    await sendPurchaseReceipt({ order })
    revalidatePath(`/account/orders/${orderId}`)
    return {
      success: true,
      message: 'Your order has been successfully paid by PayPal',
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🧮 حساب تاريخ التوصيل والسعر
// ═══════════════════════════════════════════════════════════════════════════
export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: OrderItem[]
  shippingAddress?: ShippingAddress
}) => {
  const { availableDeliveryDates } = await getSetting()
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const deliveryDate =
    availableDeliveryDates[
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex
    ]
  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 &&
          itemsPrice >= deliveryDate.freeShippingMinPrice
        ? 0
        : deliveryDate.shippingPrice

  const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15)
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )
  return {
    availableDeliveryDates,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? availableDeliveryDates.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 إحصائيات الطلبات للوحة التحكم
// ═══════════════════════════════════════════════════════════════════════════
export async function getOrderSummary(date: DateRange) {
  await connectToDatabase()

  const ordersCount = await Order.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })
  const productsCount = await Product.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })
  const usersCount = await User.countDocuments({
    createdAt: {
      $gte: date.from,
      $lte: date.to,
    },
  })

  const totalSalesResult = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
    { $project: { totalSales: { $ifNull: ['$sales', 0] } } },
  ])
  const totalSales = totalSalesResult[0] ? totalSalesResult[0].totalSales : 0

  const today = new Date()
  const sixMonthEarlierDate = new Date(
    today.getFullYear(),
    today.getMonth() - 5,
    1
  )
  const monthlySales = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: sixMonthEarlierDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: '$totalSales',
      },
    },

    { $sort: { label: -1 } },
  ])
  const topSalesCategories = await getTopSalesCategories(date)
  const topSalesProducts = await getTopSalesProducts(date)

  const {
    common: { pageSize },
  } = await getSetting()
  const limit = pageSize
  const latestOrders = await Order.find()
    .populate('user', 'name')
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    monthlySales: JSON.parse(JSON.stringify(monthlySales)),
    salesChartData: JSON.parse(JSON.stringify(await getSalesChartData(date))),
    topSalesCategories: JSON.parse(JSON.stringify(topSalesCategories)),
    topSalesProducts: JSON.parse(JSON.stringify(topSalesProducts)),
    latestOrders: JSON.parse(JSON.stringify(latestOrders)) as IOrderList[],
  }
}

async function getSalesChartData(date: DateRange) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $concat: [
            { $toString: '$_id.year' },
            '/',
            { $toString: '$_id.month' },
            '/',
            { $toString: '$_id.day' },
          ],
        },
        totalSales: 1,
      },
    },
    { $sort: { date: 1 } },
  ])

  return result
}

async function getTopSalesProducts(date: DateRange) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: {
          name: '$items.name',
          image: '$items.image',
          _id: '$items.product',
        },
        totalSales: {
          $sum: { $multiply: ['$items.quantity', '$items.price'] },
        },
      },
    },
    {
      $sort: {
        totalSales: -1,
      },
    },
    { $limit: 6 },
    {
      $project: {
        _id: 0,
        id: '$_id._id',
        label: '$_id.name',
        image: '$_id.image',
        value: '$totalSales',
      },
    },
    { $sort: { _id: 1 } },
  ])

  return result
}

async function getTopSalesCategories(date: DateRange, limit = 5) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.category',
        totalSales: { $sum: '$items.quantity' },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: limit },
  ])

  return result
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 تحديث حالة الطلب
// ═══════════════════════════════════════════════════════════════════════════
export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus,
  rejectionReason?: string
) {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session || session.user.role !== 'Admin') {
      throw new Error('غير مصرح لك بتنفيذ هذا الإجراء')
    }

    const validStatuses: OrderStatus[] = [
      'pending',
      'processing', 
      'shipped',
      'delivered',
      'completed',
      'cancelled',
      'rejected'
    ]

    if (!validStatuses.includes(status)) {
      return {
        success: false,
        message: 'حالة غير صالحة',
      }
    }

    const order = await Order.findById(orderId).populate<{
      user: { email: string; name: string }
    }>('user', 'name email')

    if (!order) {
      return {
        success: false,
        message: 'الطلب غير موجود',
      }
    }

    // حفظ الحالة السابقة للسجل
    const previousStatus = order.status || 'pending'

    // تحديث الحالة
    order.status = status
    order.statusHistory = order.statusHistory || []
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: rejectionReason || undefined,
    })

    // تحديث الحقول المرتبطة بناءً على الحالة
    switch (status) {
      case 'processing':
        // عند بدء التحضير، نعتبر أن الدفع تم (إذا لم يكن قد تم)
        if (!order.isPaid) {
          order.isPaid = true
          order.paidAt = new Date()
        }
        break

      case 'shipped':
        // تأكد من أن الطلب مدفوع قبل الشحن
        if (!order.isPaid) {
          order.isPaid = true
          order.paidAt = new Date()
        }
        order.shippedAt = new Date()
        break

      case 'delivered':
        order.isDelivered = true
        order.deliveredAt = new Date()
        // إرسال بريد طلب المراجعة
        if (order.user?.email) {
          try {
            await sendAskReviewOrderItems({ order })
          } catch (emailError) {
            console.error('Error sending review email:', emailError)
          }
        }
        break

      case 'completed':
        order.isDelivered = true
        order.deliveredAt = order.deliveredAt || new Date()
        order.completedAt = new Date()
        break

      case 'cancelled':
        order.isCancelled = true
        order.cancelledAt = new Date()
        order.cancellationReason = rejectionReason
        // إعادة المخزون إذا تم الإلغاء
        await restoreProductStock(order._id)
        break

      case 'rejected':
        order.isRejected = true
        order.rejectedAt = new Date()
        order.rejectionReason = rejectionReason
        // إعادة المخزون إذا تم الرفض
        await restoreProductStock(order._id)
        break

      case 'pending':
        // إعادة الطلب للانتظار (تراجع)
        break
    }

    await order.save()

    // إعادة تحميل الصفحات
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    revalidatePath(`/account/orders/${orderId}`)

    return {
      success: true,
      message: getStatusChangeMessage(status),
      data: {
        previousStatus,
        newStatus: status,
      }
    }
  } catch (err) {
    console.error('Error updating order status:', err)
    return { success: false, message: formatError(err) }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 إعادة المخزون عند الإلغاء أو الرفض
// ═══════════════════════════════════════════════════════════════════════════
async function restoreProductStock(orderId: string) {
  const session = await mongoose.connection.startSession()

  try {
    session.startTransaction()
    const opts = { session }

    const order = await Order.findById(orderId).session(session)
    if (!order) throw new Error('Order not found')

    // فقط إذا كان الطلب قد تم دفعه (أي تم خصم المخزون)
    if (order.isPaid) {
      for (const item of order.items) {
        const product = await Product.findById(item.product).session(session)
        if (product) {
          product.countInStock += item.quantity
          await Product.updateOne(
            { _id: product._id },
            { countInStock: product.countInStock },
            opts
          )
        }
      }
    }

    await session.commitTransaction()
    session.endSession()
    return true
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.error('Error restoring product stock:', error)
    return false
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📝 رسائل تغيير الحالة
// ═══════════════════════════════════════════════════════════════════════════
function getStatusChangeMessage(status: OrderStatus): string {
  const messages: Record<OrderStatus, string> = {
    pending: 'تم إرجاع الطلب إلى حالة الانتظار',
    processing: 'تم بدء تحضير الطلب',
    shipped: 'تم شحن الطلب بنجاح',
    delivered: 'تم تسليم الطلب بنجاح',
    completed: 'تم إكمال الطلب بنجاح',
    cancelled: 'تم إلغاء الطلب',
    rejected: 'تم رفض الطلب',
  }
  return messages[status]
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 الحصول على إحصائيات الطلبات حسب الحالة
// ═══════════════════════════════════════════════════════════════════════════
export async function getOrdersStats() {
  try {
    await connectToDatabase()

    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalPrice' },
        },
      },
    ])

    const totalOrders = await Order.countDocuments()
    const paidOrders = await Order.countDocuments({ isPaid: true })
    const deliveredOrders = await Order.countDocuments({ isDelivered: true })
    const pendingOrders = await Order.countDocuments({ 
      $or: [
        { status: 'pending' },
        { status: { $exists: false } }
      ]
    })

    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ])

    return {
      success: true,
      data: {
        totalOrders,
        paidOrders,
        deliveredOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusBreakdown: stats.reduce((acc, curr) => {
          acc[curr._id || 'pending'] = {
            count: curr.count,
            totalAmount: curr.totalAmount,
          }
          return acc
        }, {} as Record<string, { count: number; totalAmount: number }>),
      },
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📋 الحصول على الطلبات حسب الحالة
// ═══════════════════════════════════════════════════════════════════════════
export async function getOrdersByStatus({
  status,
  limit,
  page,
}: {
  status?: OrderStatus
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()
  
  const skipAmount = (Number(page) - 1) * limit
  
  const query = status 
    ? { status } 
    : {}
  
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
    
  const ordersCount = await Order.countDocuments(query)
  
  return {
    data: JSON.parse(JSON.stringify(orders)) as IOrderList[],
    totalPages: Math.ceil(ordersCount / limit),
    totalOrders: ordersCount,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔄 تحديث متعدد للطلبات (Bulk Update)
// ═══════════════════════════════════════════════════════════════════════════
export async function bulkUpdateOrderStatus(
  orderIds: string[],
  status: OrderStatus
) {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session || session.user.role !== 'Admin') {
      throw new Error('غير مصرح لك بتنفيذ هذا الإجراء')
    }

    const results = await Promise.allSettled(
      orderIds.map(id => updateOrderStatus(id, status))
    )

    const successful = results.filter(
      r => r.status === 'fulfilled' && (r.value as { success: boolean }).success
    ).length
    const failed = results.length - successful

    revalidatePath('/admin/orders')

    return {
      success: true,
      message: `تم تحديث ${successful} طلب بنجاح${failed > 0 ? ` (فشل ${failed})` : ''}`,
      data: { successful, failed, total: orderIds.length },
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}