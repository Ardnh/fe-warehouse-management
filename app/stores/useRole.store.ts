import type { Role, Pagination, BaseParams, CreateRoleRequest, UpdateRoleRequest } from '~/models'
import { useRoleRepository } from '~/repositories'
import { cleanObject } from '~/utils'
import { INITIAL_PAGINATION, ROLE_KEYS } from '~/constants'

export const useRoleStore = defineStore('role', () => {
    // Instance
    const roleRepository = useRoleRepository()
    const { run, isLoading } = useAsync()

    // State
    const roles = ref<Role[]>([])
    const rolesPagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    // Getters

    // Actions
    const findAllRoles = async (query: BaseParams) => {
        const result = await run(ROLE_KEYS.findAllRoles, (signal) => roleRepository.findAll(cleanObject(query), { signal }))
        if (!result.ok) return result

        roles.value = result.data.data
        rolesPagination.value = result.data.pagination
        return result
    }

    const findRoleById = async (id: string) => {
        const result = await run(ROLE_KEYS.findRoleById, (signal) => roleRepository.findById(id, { signal }))
        if (!result.ok) return

        return result.data.data
    }

    const createRole = async (req: CreateRoleRequest) => {
        return run(ROLE_KEYS.createRole, (signal) => roleRepository.create(req, { signal }))
    }

    const updateRole = async (id: string, req: UpdateRoleRequest) => {
        return run(ROLE_KEYS.updateRole, (signal) => roleRepository.update(id, req, { signal }))
    }

    const deleteRole = async (id: string) => {
        return run(ROLE_KEYS.deleteRole, (signal) => roleRepository.delete(id, { signal }))
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
    }
})
