import { INITIAL_PAGINATION } from '~/constants'
import { PRODUCT_KEYS } from '~/constants/product.constant'
import { useProductRepository } from '~/repositories'
import { cleanObject } from '~/utils'
import type { BaseParams, CreateProductRequest, Pagination, Product, UpdateProductRequest } from '~/models'

export const useProductStore = defineStore('product', () => {
    const repository = useProductRepository()
    const { run, isLoading } = useAsync()
    const products = ref<Product[]>([])
    const product = ref<Product | null>(null)
    const productPagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    const findAllProducts = async (query: BaseParams) => {
        const result = await run(PRODUCT_KEYS.findAll, (signal) => repository.findAll(cleanObject(query), { signal }))
        if (!result.ok) return result
        products.value = result.data.data
        productPagination.value = result.data.pagination
        return result
    }
    const findById = async (id: string) => {
        const result = await run(PRODUCT_KEYS.findById, (signal) => repository.findById(id, { signal }))
        if (!result.ok) return
        product.value = result.data.data
        return result.data.data
    }
    const create = async (payload: CreateProductRequest) => {
        return run(PRODUCT_KEYS.create, (signal) => repository.create(payload, { signal }))
    }
    const update = async (id: string, payload: UpdateProductRequest) => {
        return run(PRODUCT_KEYS.update, (signal) => repository.update(id, payload, { signal }))
    }
    const deleteProduct = async (id: string) => {
        return run(PRODUCT_KEYS.remove, (signal) => repository.delete(id, { signal }))
    }

    return { products, product, productPagination, findAllProducts, findById, create, update, deleteProduct, isLoading }
})
