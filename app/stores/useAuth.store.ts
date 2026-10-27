import { useAuthRepository } from '~/repositories'
import { useAsync, useAsyncError } from '~/composables/'
import type { AuthLoginRequest } from '~/models'

export const useAuthStore = defineStore('auth', () => {
    // Instance
    const repository = useAuthRepository()
    const { run, isLoading } = useAsync()

    const login = async (req: AuthLoginRequest) => {
        const result = await run('login', (signal) => repository.login(req, { signal }))

        if (!result.ok) return result

        storage.setString('token', result.data.data.token)
        storage.setString('expire_date', result.data.data.expire_date)
        return result
    }

    const logout = async () => {
        storage.remove('token')
        storage.remove('expire_date')
        await navigateTo('/')
    }

    return {
        login,
        logout,
        isLoading,
    }
})
