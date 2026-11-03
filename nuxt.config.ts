// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: '2025-07-15',
   devtools: { enabled: true },
   css: ['~/assets/css/main.css'],
   modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxtjs/i18n'],
   i18n: {
      locales: [
         { code: 'en', language: 'en-US' },
         { code: 'fr', language: 'fr-FR' },
      ],
      defaultLocale: 'id',
   },
   devServer: {
      port: 3000,
   },
   runtimeConfig: {
      apiSecret: '123',
      // Keys within public, will be also exposed to the client-side
      public: {
         apiBase: 'http://localhost:8080/api/v1',
      },
   },
})
