import type { Role, Pagination, BaseParams, CreateRoleRequest, UpdateRoleRequest } from '~/models'
import { useRoleService } from '~/services'
import { INITIAL_PAGINATION, ROLE_KEYS } from '~/constants'

export const useRoleStore = defineStore('role', () => {
    // Instance
    const roleService = useRoleService()
    const { run, isLoading } = useAsync()

    // State
    const roles = ref<Role[]>([])
    const rolesPagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    // Getters

    // Actions
    const findAllRoles = async (query: BaseParams) => {
        const result = await run(ROLE_KEYS.findAllRoles, (signal) => roleService.findAll(query, { signal }))
        if (!result.ok) {
            return result
        }

        roles.value = result.data.data
        rolesPagination.value = result.data.pagination
    }

    const findRoleById = async (id: string) => {
        const result = await run(ROLE_KEYS.findRoleById, (signal) => roleService.findById(id, { signal }))
        return result
    }

    const createRole = async (req: CreateRoleRequest) => {
        const result = await run(ROLE_KEYS.createRole, (signal) => roleService.create(req, { signal }))
        return result
    }

    const updateRole = async (id: string, req: UpdateRoleRequest) => {
        const result = await run(ROLE_KEYS.updateRole, (signal) => roleService.update(id, req, { signal }))
        return result
    }

    const deleteRole = async (id: string) => {
        const result = await run(ROLE_KEYS.deleteRole, (signal) => roleService.deleteRole(id, { signal }))
        return result
    }

    return {
        findAllRoles,
        findRoleById,
        createRole,
        updateRole,
        deleteRole,
        roles,
        rolesPagination,
        isLoading,
        clearError,
    }
})
