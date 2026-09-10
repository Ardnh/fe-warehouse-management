import { useAuthService } from "~/services/";
import { useAsync, useAsyncError } from "~/composables/";
import type { AuthLoginRequest } from "~/models";

export const useAuthStore = defineStore("auth", () => {
    // Instance
    const service = useAuthService();
    const { run, isLoading, getError } = useAsync();
    const toast = useToast();

    const login = async (req: AuthLoginRequest) => {
        const result = await run("login", (signal) =>
            service.login(req, { signal }),
        );
        if (!result.success) {
            toast.add({
                title: "Error",
                description: result.message,
                color: "error",
            });
            return;
        }

        storage.setString("token", result.data.token);
        storage.setString("expire_date", result.data.expire_date);

        await navigateTo("/dashboard");
    };

    return {
        login,
        isLoading,
        getError,
    };
});
