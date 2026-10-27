import { INITIAL_PAGINATION } from '~/constants'
import { CUSTOMER_KEYS } from '~/constants/customer.constant'
import { useCustomerRepository } from '~/repositories'
import { cleanObject } from '~/utils'
import type { BaseParams, CreateCustomerRequest, Customer, Pagination, UpdateCustomerRequest } from '~/models'

export const useCustomerStore = defineStore('customer', () => {
    const repository = useCustomerRepository()
    const { run, isLoading } = useAsync()
    const customers = ref<Customer[]>([])
    const customer = ref<Customer | null>(null)
    const customerPagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    const findAllCustomers = async (query: BaseParams) => {
        const result = await run(CUSTOMER_KEYS.findAll, (signal) => repository.findAll(cleanObject(query), { signal }))
        if (!result.ok) return result
        customers.value = result.data.data
        customerPagination.value = result.data.pagination
        return result
    }
    const findById = async (id: string) => {
        const result = await run(CUSTOMER_KEYS.findById, (signal) => repository.findById(id, { signal }))
        if (!result.ok) return result
        customer.value = result.data.data
        return result
    }
    const create = async (payload: CreateCustomerRequest) => {
        const result = await run(CUSTOMER_KEYS.create, (signal) => repository.create(payload, { signal }))
        return result
    }
    const update = async (id: string, payload: UpdateCustomerRequest) => {
        const result = await run(CUSTOMER_KEYS.update, (signal) => repository.update(id, payload, { signal }))
        return result
    }
    const deleteCustomer = async (id: string) => {
        const result = await run(CUSTOMER_KEYS.remove, (signal) => repository.delete(id, { signal }))
        return result
    }

    return { customers, customer, customerPagination, findAllCustomers, findById, create, update, deleteCustomer, isLoading }
})
