import { INITIAL_PAGINATION } from "~/constants";
import { CUSTOMER_KEYS } from "~/constants/customer.constant";
import { useCustomerService } from "~/services";
import type { BaseParams, CreateCustomerRequest, Customer, Pagination, UpdateCustomerRequest } from "~/models";

export const useCustomerStore = defineStore("customer", () => {
    const service = useCustomerService();
    const { run, isLoading, getError, clearError } = useAsync();
    const customers = ref<Customer[]>([]);
    const customer = ref<Customer | null>(null);
    const customerPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    const findAllCustomers = async (query: BaseParams) => {
        const result = await run(CUSTOMER_KEYS.findAll, (signal) => service.findAll(query, { signal }));
        if (!result) return;
        customers.value = result.data;
        customerPagination.value = result.pagination;
        return result.data;
    };
    const findById = async (id: string) => {
        const result = await run(CUSTOMER_KEYS.findById, (signal) => service.findById(id, { signal }));
        if (!result) return;
        customer.value = result.data;
        return result.data;
    };
    const create = async (payload: CreateCustomerRequest) => {
        const result = await run(CUSTOMER_KEYS.create, (signal) => service.create(payload, { signal }));
        return result?.message;
    };
    const update = async (id: string, payload: UpdateCustomerRequest) => {
        const result = await run(CUSTOMER_KEYS.update, (signal) => service.update(id, payload, { signal }));
        return result?.message;
    };
    const deleteCustomer = async (id: string) => {
        const result = await run(CUSTOMER_KEYS.remove, (signal) => service.deleteCustomer(id, { signal }));
        return result?.message;
    };

    return { customers, customer, customerPagination, findAllCustomers, findById, create, update, deleteCustomer, isLoading, getError, clearError };
});
