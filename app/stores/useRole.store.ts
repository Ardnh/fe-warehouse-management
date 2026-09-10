import type { Role, Pagination, BaseParams } from "~/models";
import { useRoleService } from "~/services";
import { INITIAL_PAGINATION } from "~/constants";

export const useRoleStore = defineStore("role", () => {
    // Instance
    const roleService = useRoleService();
    const { run, isLoading } = useAsync();
    const { setError } = useAsyncError();

    // State
    const roles = ref<Role[]>([]);
    const rolesPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    // Getters

    // Actions
    const findAllRoles = async (query: BaseParams) => {
        const result = await run("findAllRoles", () =>
            roleService.findAll(query),
        );
        if (!result.success) {
            setError("findAllRoles", result.message);
            return;
        }

        roles.value = result.data;
        rolesPagination.value = result.pagination;
        return result.data;
    };

    const createRole = async (req: any) => {
        const result = await run("createRole", () => roleService.create(req));
        if (!result.success) {
            setError("createRole", result.message);
            return;
        }

        return result.message;
    };

    const updateRole = async (id: string, req: any) => {
        const result = await run("updateRole", () =>
            roleService.update(id, req),
        );
        if (!result.success) {
            setError("updateRole", result.message);
            return;
        }

        return result.message;
    };

    const deleteRole = async (id: string) => {
        const result = await run("deleteRole", () =>
            roleService.deleteRole(id),
        );
        if (!result.success) {
            setError("deleteRole", result.message);
            return;
        }

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
    };
});
