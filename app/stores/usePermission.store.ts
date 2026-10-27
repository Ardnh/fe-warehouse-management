import type { Permission, FindAllPermissionParams, Pagination } from '~/models'
import { usePermissionsRepository } from '~/repositories'
import { cleanObject } from '~/utils'
import { INITIAL_PAGINATION, INITIAL_PARAMS, PERMISSION_KEYS } from '~/constants'

export const usePermissionStore = defineStore('permission', () => {
    // Instance
    const permissionRepository = usePermissionsRepository()
    const { run, isLoading } = useAsync()

    // State
    const permissions = ref<Permission[]>([])
    const permissionsPagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    // Getters

    // Actions
    const findAllPermissions = async (query: FindAllPermissionParams = INITIAL_PARAMS) => {
        const result = await run(PERMISSION_KEYS.findAllPermissions, (signal) => permissionRepository.findAll(cleanObject(query), { signal }))
        if (!result.ok) return result

        permissions.value = result.data.data
        permissionsPagination.value = result.data.pagination
        return result
    }

    return {
        permissions,
        findAllPermissions,
        isLoading,
    }
})
