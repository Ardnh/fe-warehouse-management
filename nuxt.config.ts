// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    modules: ["@nuxt/ui", "@pinia/nuxt"],
    devServer: {
        port: 4200,
    },
    runtimeConfig: {
        apiSecret: "123",
        // Keys within public, will be also exposed to the client-side
        public: {
            apiBase: "http://127.0.0.1:3000/api/v1",
        },
    },
});
