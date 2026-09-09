// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    modules: ["@nuxt/ui", "@pinia/nuxt"],
    devServer: {
        port: 3000,
    },
    runtimeConfig: {
        apiSecret: "123",
        // Keys within public, will be also exposed to the client-side
        public: {
            apiBase: "http://localhost:8080/api/v1",
        },
    },
});
