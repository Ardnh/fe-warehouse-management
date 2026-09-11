import type { Permission, FindAllPermissionParams, Pagination } from "~/models";
import { usePermissionService } from "~/services";
import { INITIAL_PAGINATION, PERMISSION_KEYS } from "~/constants";

export const usePermissionStore = defineStore("permission", () => {
    // Instance
    const permissionService = usePermissionService();
    const { run, isLoading, getError, clearError } = useAsync();

    // State
    const permissions = ref<Permission[]>([]);
    const permissionsPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    // Getters

    // Actions
    const findAllPermissions = async (query: FindAllPermissionParams) => {
        const result = await run(PERMISSION_KEYS.findAllPermissions, (signal) =>
            permissionService.findAll(query, { signal }),
        );
        if (!result) return;

        permissions.value = result.data;
        permissionsPagination.value = result.pagination;
        return result.data;
    };

    return {
        permissions,
        findAllPermissions,
        isLoading,
        getError,
        clearError,
    };
});
