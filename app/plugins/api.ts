// plugins/api.ts
export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        retry: 0,
        onRequest({ options }) {
            const token = storage.getString("token");
            if (token) options.headers.set("Authorization", `Bearer ${token}`);
        },
        onResponseError({ response }) {
            // hanya efek samping global — pemetaan pesan ada di toErrorMessage
            if (response.status === 401) {
                storage.remove("token");
                navigateTo("/");
            }
        },
    });

    return { provide: { api } };
});
