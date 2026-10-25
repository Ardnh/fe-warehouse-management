import * as z from 'zod'

const passwordRule = z.string().min(8, 'Password minimal 8 karakter')

const baseUserSchema = z.object({
    username: z.string().min(1, 'Username wajib diisi'),
    email: z.email('Email tidak valid'),
    full_name: z.string().min(1, 'Nama lengkap wajib diisi'),
    location_id: z.string().min(1, 'Location wajib diisi'),
    status: z.enum(['ACTIVE', 'INACTIVE']),
    role_id: z.string().min(1, 'Role wajib diisi'),
})

// buat user baru: password wajib
export const createUserSchema = baseUserSchema.extend({
    password: passwordRule,
})

// edit user: password boleh kosong, tapi kalau diisi harus valid
export const updateUserSchema = baseUserSchema.extend({
    password: z.union([z.literal(''), passwordRule]).optional(),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>
export type UpdateUserSchema = z.infer<typeof updateUserSchema>

export type UserSchema = z.infer<typeof updateUserSchema>
export type UserFormPayload = Omit<UserSchema, 'password'> & {
    password?: string
}
