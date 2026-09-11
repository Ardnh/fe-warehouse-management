import { useAuthService } from "~/services/";
import { useAsync, useAsyncError } from "~/composables/";
import type { AuthLoginRequest } from "~/models";

export const useAuthStore = defineStore("auth", () => {
    // Instance
    const service = useAuthService();
    const { run, isLoading, getError } = useAsync();

    const login = async (req: AuthLoginRequest) => {
        const result = await run("login", (signal) =>
            service.login(req, { signal }),
        );

        if (!result) return;

        storage.setString("token", result.data.token);
        storage.setString("expire_date", result.data.expire_date);
        return result;
    };

    return {
        login,
        isLoading,
        getError,
    };
});
