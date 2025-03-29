// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@nuxtjs/color-mode",
    "nuxt-time",
    "@vueuse/nuxt",
    "dayjs-nuxt",
    "@nuxt/icon",
  ],
  colorMode: {
    preference: "system", // default theme
    dataValue: "theme", // activate data-theme in <html> tag
    classSuffix: "",
  },
  tailwindcss: { exposeConfig: true },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/"],
      saveRedirectToCookie: true,
    },
  },
  dayjs: {
    defaultLocale: "da",
    locales: ["da"],
    plugins: ["duration"],
  },
  // Add runtime config for app URL
  runtimeConfig: {
    public: {
      siteUrl: "",
    },
  },
});
