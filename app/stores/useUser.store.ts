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
    const { run, isLoading } = useAsync();
    const { setError } = useAsyncError();

    // State
    const users = ref<User[]>([]);
    const user = ref<User | null>(null);
    const userPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    // Actions
    const findAllUsers = async (query: BaseParams) => {
        const result = await run(USER_KEYS.findAll, () =>
            userService.findAll(query),
        );
        if (!result.success) {
            setError("findAllUsers", result.message);
            return;
        }

        users.value = result.data;
        userPagination.value = result.pagination;
        return result.data;
    };

    const findById = async (id: string) => {
        const result = await run(USER_KEYS.findById, () =>
            userService.findById(id),
        );
        if (!result.success) {
            setError("findById", result.message);
            return;
        }

        user.value = result.data;
        return result.data;
    };

    const create = async (user: CreateUserRequest) => {
        const result = await run(USER_KEYS.create, () =>
            userService.create(user),
        );
        if (!result.success) {
            setError("createUser", result.message);
            return;
        }

        return result.message;
    };

    const update = async (id: string, user: UpdateUserRequest) => {
        const result = await run(USER_KEYS.update, () =>
            userService.update(id, user),
        );
        if (!result.success) {
            setError("updateUser", result.message);
            return;
        }

        return result.message;
    };

    const deleteUser = async (id: string) => {
        const result = await run(USER_KEYS.remove, () =>
            userService.deleteUser(id),
        );
        if (!result.success) {
            setError("deleteUser", result.message);
            return;
        }

        return result.message;
    };

    return {
        users,
        userPagination,
        findAllUsers,
        findById,
        isLoading,
        create,
        update,
        deleteUser,
    };
});
