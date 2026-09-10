import * as z from "zod";

export const authSchema = z.object({
    username: z.string().min(1, "Username wajib diisi"),
    password: z.string().min(1, "Password wajib diisi"),
});

export type AuthSchema = z.output<typeof authSchema>;
