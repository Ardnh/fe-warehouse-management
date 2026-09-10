export const toErrorMessage = (e: any): string => {
    const data = e?.data; // body error dari server
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.errors)) return data.errors.join(", ");

    switch (e?.statusCode ?? e?.status) {
        case 401:
            return "Sesi berakhir, silakan login kembali";
        case 403:
            return "Akses ditolak";
        case 404:
            return "Data tidak ditemukan";
        case 500:
            return "Terjadi kesalahan pada server";
        default:
            return e?.message ?? "Terjadi kesalahan";
    }
};
