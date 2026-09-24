import type { AuthResponse, AuthLoginRequest } from "../models";
import type { RequestOptions } from "../constants";

export const useAuthRepository = () => {
    // const { api } = useApi();
    const { $api } = useNuxtApp();

    return {
        login: async (
            req: AuthLoginRequest,
            opts?: RequestOptions,
        ): Promise<AuthResponse> =>
            await $api("/login", {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
    };
};
