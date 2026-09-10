// plugins/api.ts
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        retry: 0, // penting: cegah retry request yang sudah di-abort
        onRequest({ options }) {
            const token = storage.getString("token");
            if (token) options.headers.set("Authorization", `Bearer ${token}`);
        },
        async onResponseError({ response }) {
            const data = response._data; // body error dari server
            if (typeof data?.message === "string") return data.message;
            if (Array.isArray(data?.errors)) return data.errors.join(", ");

            switch (response.status) {
                case 401:
                    return "Sesi berakhir, silakan login kembali";
                case 403:
                    return "Akses ditolak";
                case 404:
                    return "Data tidak ditemukan";
                case 500:
                    return "Terjadi kesalahan pada server";
                default:
                    return "Terjadi kesalahan";
            }
        },
    });

    return { provide: { api } };
});
