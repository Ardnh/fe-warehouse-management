import { useUserRepository } from '~/repositories'
import { cleanObject } from '~/utils'
import type { BaseParams, User, Pagination, CreateUserRequest, UpdateUserRequest, UserProfile } from '~/models'
import { INITIAL_PAGINATION } from '~/constants'
import { USER_KEYS } from '~/constants'

export const useUserStore = defineStore('user', () => {
    // Instance
    const userRepository = useUserRepository()
    const { run, isLoading } = useAsync()

    // State
    const users = ref<User[]>([])
    const user = ref<User | null>(null)
    const userProfile = ref<UserProfile | null>(null)

    const userPagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    // Actions
    const findAllUsers = async (query: BaseParams) => {
        const result = await run(USER_KEYS.findAll, (signal) => userRepository.findAll(cleanObject(query), { signal }))

        if (!result.ok) return result

        users.value = result.data.data
        userPagination.value = result.data.pagination
        return result
    }

    const findById = async (id: string) => {
        const result = await run(USER_KEYS.findById, (signal) => userRepository.findById(id, { signal }))
        if (!result.ok) return

        user.value = result.data.data
        return result.data.data
    }

    const findProfile = async () => {
        const result = await run(USER_KEYS.findProfile, (signal) => userRepository.findProfile({ signal }))
        if (!result.ok) return result

        userProfile.value = result.data.data
        return result
    }

    const create = async (user: CreateUserRequest) => {
        const result = await run(USER_KEYS.create, (signal) => userRepository.create(user, { signal }))
        return result
    }

    const update = async (id: string, user: UpdateUserRequest) => {
        const result = await run(USER_KEYS.update, (signal) => userRepository.update(id, user, { signal }))
        return result
    }

    const deleteUser = async (id: string) => {
        const result = await run(USER_KEYS.remove, (signal) => userRepository.delete(id, { signal }))
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
    }
})
