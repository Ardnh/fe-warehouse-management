import { useUserService } from "~/services";
import type {
    BaseParams,
    User,
    Pagination,
    CreateUserRequest,
    UpdateUserRequest,
} from "~/models";
import { INITIAL_PAGINATION } from "~/constants";
import { USER_KEYS } from "~/constants";

export const useUserStore = defineStore("user", () => {
    // Instance
    const userService = useUserService();
    const { run, isLoading, getError, clearError } = useAsync();

    // State
    const users = ref<User[]>([]);
    const user = ref<User | null>(null);
    const userPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    // Actions
    const findAllUsers = async (query: BaseParams) => {
        const result = await run(USER_KEYS.findAll, (signal) =>
            userService.findAll(query, { signal }),
        );
        if (!result) return;

        users.value = result.data;
        userPagination.value = result.pagination;
        return result.data;
    };

    const findById = async (id: string) => {
        const result = await run(USER_KEYS.findById, (signal) =>
            userService.findById(id, { signal }),
        );
        if (!result) return;

        user.value = result.data;
        return result.data;
    };

    const create = async (user: CreateUserRequest) => {
        const result = await run(USER_KEYS.create, (signal) =>
            userService.create(user, { signal }),
        );
        if (!result) return;

        return result.message;
    };

    const update = async (id: string, user: UpdateUserRequest) => {
        const result = await run(USER_KEYS.update, (signal) =>
            userService.update(id, user, { signal }),
        );
        if (!result) return;

        return result.message;
    };

    const deleteUser = async (id: string) => {
        const result = await run(USER_KEYS.remove, (signal) =>
            userService.deleteUser(id, { signal }),
        );
        if (!result) return;

        return result.message;
    };

    return {
        users,
        userPagination,
        findAllUsers,
        findById,
        create,
        update,
        deleteUser,
        isLoading,
        getError,
        clearError,
    };
});
