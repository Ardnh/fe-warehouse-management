import type { AuthResponse } from "../models";
import type { RequestOptions } from "../constants";

export const useAuthRepository = () => {
    // const { api } = useApi();
    const { $api } = useNuxtApp();

    return {
        Login: async (
            req: Record<string, any>,
            opts?: RequestOptions,
        ): Promise<AuthResponse> =>
            await $api("/login", {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
    };
};
