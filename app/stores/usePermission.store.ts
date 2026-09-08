import type { Permission, FindAllPermissionParams, Pagination } from "~/models";
import { usePermissionService } from "~/services";
import { INITIAL_PAGINATION } from "~/constants";

export const usePermissionStore = defineStore("permission", () => {
    // Instance
    const permissionService = usePermissionService();
    const { run } = useAsync();
    const { setError } = useAsyncError();

    // State
    const permissions = ref<Permission[]>([]);
    const permissionsPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    // Getters

    // Actions
    const findAllPermissions = async (query: FindAllPermissionParams) => {
        const result = await run("findAllPermissions", () =>
            permissionService.findAll(query),
        );
        if (!result.success) {
            setError("findAllPermissions", result.message);
            return;
        }

        return result.data;
    };

    return {
        permissions,
        findAllPermissions,
    };
});
