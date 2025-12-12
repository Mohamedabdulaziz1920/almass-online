'use server'

import { connectToDatabase } from '../db'
import Category from '../db/models/category.model'
import Product from '../db/models/product.model'
import { CategoryType, ProductType } from '@/types'
import { CategoryInputSchema } from '@/lib/validator'
import { z } from 'zod'
import mongoose from 'mongoose'

export type CreateCategoryInput = z.infer<typeof CategoryInputSchema>

// واجهات بيانات
interface CategoryParams {
  name: string
  slug: string
  image: string
  isFeatured: boolean
  banner?: string
}

interface SimpleCategory {
  _id: string
  name: string
  slug: string
  image: string
  isFeatured: boolean
  banner?: string
}

// ====== إنشاء تصنيف جديد ======
export async function createCategory(data: CategoryParams) {
  try {
    await connectToDatabase()

    const existing = await Category.findOne({ slug: data.slug })
    if (existing) {
      return {
        success: false,
        message: 'تصنيف موجود بالفعل بنفس الـ slug.',
      }
    }

    const newCategory = await Category.create({
      name: data.name,
      slug: data.slug,
      image: data.image,
      isFeatured: data.isFeatured,
      banner: data.banner,
    })

    return {
      success: true,
      message: 'تم إنشاء التصنيف بنجاح.',
      data: JSON.parse(JSON.stringify(newCategory)) as CategoryType,
    }
  } catch (error) {
    return {
      success: false,
      message: `فشل في إنشاء التصنيف: ${(error as Error).message}`,
    }
  }
}

// ====== جلب تصنيف مع المنتجات ======
export const getCategoryWithProducts = async (
  slug: string
): Promise<{
  category: CategoryType
  products: ProductType[]
} | null> => {
  try {
    await connectToDatabase()

    // جلب بيانات التصنيف
    const categoryDoc = await Category.findOne({ slug }).lean()
    if (!categoryDoc) return null

    // جلب المنتجات التي تملك نفس slug في حقل category (كنص)
    const products = await Product.find({ category: slug })
      .select(
        '_id name slug category images brand price listPrice countInStock tags avgRating numReviews createdAt updatedAt description'
      )
      .lean()
      .sort({ createdAt: -1 })

    const category: CategoryType = {
      _id: String(categoryDoc._id),
      name: categoryDoc.name,
      slug: categoryDoc.slug,
      image: categoryDoc.image,
      isFeatured: categoryDoc.isFeatured ?? false,
      banner: categoryDoc.banner,
      createdAt: categoryDoc.createdAt,
      updatedAt: categoryDoc.updatedAt,
    }

    return {
      category,
      products: products.map(
        (product): ProductType => ({
          _id: String(product._id),
          name: product.name,
          slug: product.slug,
          category: product.category, // slug كنص
          images: product.images || [],
          brand: product.brand || 'غير محدد',
          description: product.description || '',
          price: product.price,
          listPrice: product.listPrice || product.price,
          countInStock: product.countInStock || 0,
          tags: product.tags || [],
          avgRating: product.avgRating || 0,
          numReviews: product.numReviews || 0,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })
      ),
    }
  } catch (error) {
    console.error('Failed to fetch category with products:', error)
    throw new Error(
      `Failed to fetch category with products: ${(error as Error).message}`
    )
  }
}

// ====== تحديث تصنيف موجود ======
export async function updateCategory(data: { _id: string } & CategoryParams) {
  try {
    await connectToDatabase()

    const category = await Category.findById(data._id)
    if (!category) {
      return {
        success: false,
        message: 'التصنيف غير موجود.',
      }
    }

    if (category.slug !== data.slug) {
      const existing = await Category.findOne({ slug: data.slug })
      if (existing) {
        return {
          success: false,
          message: 'يوجد تصنيف آخر بنفس الـ slug.',
        }
      }
    }

    category.name = data.name
    category.slug = data.slug
    category.image = data.image
    category.isFeatured = data.isFeatured
    category.banner = data.banner

    await category.save()
    return {
      success: true,
      message: 'تم تحديث التصنيف بنجاح.',
      data: JSON.parse(JSON.stringify(category)) as CategoryType,
    }
  } catch (error) {
    return {
      success: false,
      message: `فشل في تحديث التصنيف: ${(error as Error).message}`,
    }
  }
}

// ====== حذف تصنيف ======
export async function deleteCategory(id: string) {
  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return {
        success: false,
        message: 'معرّف التصنيف غير صالح',
      }
    }

    await connectToDatabase()

    const category = await Category.findById(id)
    if (!category) {
      return {
        success: false,
        message: 'التصنيف غير موجود',
      }
    }

    const dependentProducts = await Product.countDocuments({ categoryId: id })
    if (dependentProducts > 0) {
      return {
        success: false,
        message: `لا يمكن الحذف - يوجد ${dependentProducts} منتجات مرتبطة`,
      }
    }

    await Category.findByIdAndDelete(id)

    return {
      success: true,
      message: 'تم حذف التصنيف بنجاح',
    }
  } catch (error) {
    console.error('Delete Error:', error)
    return {
      success: false,
      message: `حدث خطأ فني': ${(error as Error).message}`,
    }
  }
}

// ====== جلب تصنيف حسب الـ ID ======
export async function getCategoryById(id: string): Promise<CategoryType> {
  try {
    await connectToDatabase()

    const category = await Category.findById(id).lean()
    if (!category) {
      throw new Error('Category not found.')
    }

    return {
      _id: String(category._id),
      name: category.name,
      slug: category.slug,
      image: category.image,
      isFeatured: category.isFeatured ?? false,
      banner: category.banner,
    }
  } catch (error) {
    throw new Error(`Failed to fetch category: ${(error as Error).message}`)
  }
}

// ====== جلب جميع التصنيفات (للوحة التحكم) ======
export const getCategories = async (): Promise<{
  success: boolean
  data: SimpleCategory[]
  message?: string
}> => {
  try {
    await connectToDatabase()

    const categories = await Category.find()
      .select('name slug image isFeatured banner')
      .lean()

    const data: SimpleCategory[] = categories.map((cat: any) => ({
      _id: String(cat._id),
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      isFeatured: cat.isFeatured ?? false,
      banner: cat.banner,
    }))

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      data: [],
      message: 'Failed to fetch categories.',
    }
  }
}

// ====== جلب جميع التصنيفات (كاملة) ======
export const getAllCategories = async (): Promise<CategoryType[]> => {
  await connectToDatabase()

  const categories = await Category.find().lean()

  return categories.map(
    (cat: any): CategoryType => ({
      _id: String(cat._id),
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      isFeatured: cat.isFeatured ?? false,
      banner: cat.banner,
    })
  )
}

// ====== جلب تصنيف عن طريق الـ Slug ======
export const getCategoryBySlug = async (
  slug: string
): Promise<CategoryType | null> => {
  await connectToDatabase()

  const category = await Category.findOne({ slug }).lean()
  if (!category) return null

  return {
    _id: String(category._id),
    name: category.name,
    slug: category.slug,
    image: category.image,
    isFeatured: category.isFeatured ?? false,
    banner: category.banner,
  }
}
