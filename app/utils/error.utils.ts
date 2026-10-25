export class BusinessError extends Error {
    constructor(
        message: string,
        readonly code?: string
    ) {
        super(message)
        this.name = 'BusinessError'
    }
}

export const isAbortError = (e: any) =>
    e?.name === 'AbortError' ||
    e?.cause?.name === 'AbortError' || // ofetch membungkus error asli
    e?.code === 'ERR_CANCELED'

export const toErrorMessage = (e: any): string => {
    if (e instanceof BusinessError) return e.message

    const status = e?.status ?? e?.statusCode
    const data = e?.data

    // error validasi: 400 / 422 dengan detail per field
    if (status === 400 || status === 422) {
        const messages = Object.values(toFieldErrors(e))
        if (messages.length) return messages.join('. ')
        if (Array.isArray(data?.errors) && data.errors.length) return data.errors.join(', ')
        return status === 422 ? 'Data yang dikirim tidak valid' : 'Permintaan tidak valid'
    }

    // pesan dari server untuk status lain
    if (typeof data?.message === 'string') return data.message

    switch (status) {
        case 401:
            return 'Sesi berakhir, silakan login kembali'
        case 403:
            return 'Akses ditolak'
        case 404:
            return 'Data tidak ditemukan'
        case 500:
            return 'Terjadi kesalahan pada server'
    }

    console.error('[unhandled error]', e)
    return 'Terjadi kesalahan'
}

// utils/error.ts
export type FieldErrors = Record<string, string>

export const toFieldErrors = (e: any): FieldErrors => {
    const err = e?.data?.error
    if (!err || typeof err !== 'object' || Array.isArray(err)) return {}

    return Object.fromEntries(Object.entries(err).filter(([, v]) => typeof v === 'string')) as FieldErrors
}

export class AppError extends Error {
    status?: number
    fields: FieldErrors
    raw: unknown

    constructor(e: any) {
        super(toErrorMessage(e))
        this.name = 'AppError'
        this.status = e?.status ?? e?.statusCode
        this.fields = toFieldErrors(e)
        this.raw = e
    }
}
