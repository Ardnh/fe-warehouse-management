import { useUserService } from '~/services'
import type { BaseParams, User, Pagination, CreateUserRequest, UpdateUserRequest, UserProfile } from '~/models'
import { INITIAL_PAGINATION } from '~/constants'
import { USER_KEYS } from '~/constants'

export const useUserStore = defineStore('user', () => {
    // Instance
    const userService = useUserService()
    const { run, isLoading } = useAsync()

    // State
    const users = ref<User[]>([])
    const user = ref<User | null>(null)
    const userProfile = ref<UserProfile | null>(null)

    const userPagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    // Actions
    const findAllUsers = async (query: BaseParams) => {
        const result = await run(USER_KEYS.findAll, (signal) => userService.findAll(query, { signal }))

        if (!result.ok) return result

        users.value = result.data.data
        userPagination.value = result.data.pagination
    }

    const findById = async (id: string) => {
        const result = await run(USER_KEYS.findById, (signal) => userService.findById(id, { signal }))
        return result
    }

    const findProfile = async () => {
        const result = await run(USER_KEYS.findProfile, (signal) => userService.findProfile({ signal }))
        if (!result.ok) return

        userProfile.value = result.data.data
    }

    const create = async (user: CreateUserRequest) => {
        const result = await run(USER_KEYS.create, (signal) => userService.create(user, { signal }))
        return result
    }

    const update = async (id: string, user: UpdateUserRequest) => {
        const result = await run(USER_KEYS.update, (signal) => userService.update(id, user, { signal }))
        return result
    }

    const deleteUser = async (id: string) => {
        const result = await run(USER_KEYS.remove, (signal) => userService.deleteUser(id, { signal }))
        return result
    }

    return {
        users,
        userProfile,
        userPagination,
        findAllUsers,
        findById,
        findProfile,
        create,
        update,
        deleteUser,
        isLoading,
        clearError,
    }
})
