import { INITIAL_PAGINATION } from "~/constants";
import { PRODUCT_KEYS } from "~/constants/product.constant";
import { useProductService } from "~/services";
import type { BaseParams, CreateProductRequest, Pagination, Product, UpdateProductRequest } from "~/models";

export const useProductStore = defineStore("product", () => {
    const service = useProductService();
    const { run, isLoading, getError, clearError } = useAsync();
    const products = ref<Product[]>([]);
    const product = ref<Product | null>(null);
    const productPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    const findAllProducts = async (query: BaseParams) => {
        const result = await run(PRODUCT_KEYS.findAll, (signal) => service.findAll(query, { signal }));
        if (!result) return;
        products.value = result.data;
        productPagination.value = result.pagination;
        return result.data;
    };
    const findById = async (id: string) => {
        const result = await run(PRODUCT_KEYS.findById, (signal) => service.findById(id, { signal }));
        if (!result) return;
        product.value = result.data;
        return result.data;
    };
    const create = async (payload: CreateProductRequest) => {
        const result = await run(PRODUCT_KEYS.create, (signal) => service.create(payload, { signal }));
        return result?.message;
    };
    const update = async (id: string, payload: UpdateProductRequest) => {
        const result = await run(PRODUCT_KEYS.update, (signal) => service.update(id, payload, { signal }));
        return result?.message;
    };
    const deleteProduct = async (id: string) => {
        const result = await run(PRODUCT_KEYS.remove, (signal) => service.deleteProduct(id, { signal }));
        return result?.message;
    };

    return { products, product, productPagination, findAllProducts, findById, create, update, deleteProduct, isLoading, getError, clearError };
});
