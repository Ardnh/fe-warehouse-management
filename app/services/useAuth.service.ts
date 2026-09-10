import { useAuthRepository } from "~/repositories";
import type { AuthLoginRequest } from "~/models/auth.model";
import type { RequestOptions } from "~/constants";

export const useAuthService = () => {
    const { Login } = useAuthRepository();

    const login = async (req: AuthLoginRequest, opts?: RequestOptions) => {
        const result = await Login(req, opts);
        return result;
    };

    return {
        login,
    };
};
