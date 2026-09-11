export class BusinessError extends Error {
    constructor(
        message: string,
        readonly code?: string,
    ) {
        super(message);
        this.name = "BusinessError";
    }
}

export const isAbortError = (e: any) =>
    e?.name === "AbortError" ||
    e?.cause?.name === "AbortError" || // ofetch membungkus error asli
    e?.code === "ERR_CANCELED";

export const toErrorMessage = (e: any): string => {
    // pesan bisnis ditulis untuk user, langsung pakai
    if (e instanceof BusinessError) return e.message;

    // body error dari server
    const data = e?.data;
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.errors) && data.errors.length)
        return data.errors.join(", ");

    switch (e?.status ?? e?.statusCode) {
        case 401:
            return "Sesi berakhir, silakan login kembali";
        case 403:
            return "Akses ditolak";
        case 404:
            return "Data tidak ditemukan";
        case 422:
            return "Data yang dikirim tidak valid";
        case 500:
            return "Terjadi kesalahan pada server";
    }

    // error tak dikenal (kemungkinan bug) — jangan tampilkan pesan teknis
    console.error("[unhandled error]", e);
    return "Terjadi kesalahan";
};
