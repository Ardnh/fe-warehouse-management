import type { Role, Pagination, BaseParams } from "~/models";
import { useRoleService } from "~/services";
import { INITIAL_PAGINATION, ROLE_KEYS } from "~/constants";

export const useRoleStore = defineStore("role", () => {
    // Instance
    const roleService = useRoleService();
    const { run, isLoading, getError, clearError } = useAsync();

    // State
    const roles = ref<Role[]>([]);
    const rolesPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    // Getters

    // Actions
    const findAllRoles = async (query: BaseParams) => {
        const result = await run(ROLE_KEYS.findAllRoles, (signal) =>
            roleService.findAll(query, { signal }),
        );
        if (!result) return;
        roles.value = result.data;
        rolesPagination.value = result.pagination;
        return result.data;
    };

    const createRole = async (req: any) => {
        const result = await run(ROLE_KEYS.createRole, (signal) =>
            roleService.create(req, { signal }),
        );
        if (!result) return;
        return result.message;
    };

    const updateRole = async (id: string, req: any) => {
        const result = await run(ROLE_KEYS.updateRole, (signal) =>
            roleService.update(id, req, { signal }),
        );
        if (!result) return;

        return result.message;
    };

    const deleteRole = async (id: string) => {
        const result = await run(ROLE_KEYS.deleteRole, (signal) =>
            roleService.deleteRole(id, { signal }),
        );
        if (!result) return;

        return result.message;
    };

    return {
        findAllRoles,
        createRole,
        updateRole,
        deleteRole,
        roles,
        rolesPagination,
        isLoading,
        getError,
        clearError,
    };
});
