import { addDynamicIconSelectors } from "@iconify/tailwind"

const isGenerateMode = process.argv.includes("generate")

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    session: {
      password: "01234567890123456789012345678901",
      maxAge: 1800,
    },
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    logger: {
      level: process.env.LOG_LEVEL,
    },
  },

  sourcemap: true,

  modules: [
    "@nuxtjs/tailwindcss",
    "vue-history-state/nuxt",
  ],

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          "@": ["."],
          "@/*": ["./*"],
        },
      },
    },
  },

  components: [
    { path: "~/components", pathPrefix: false },
  ],

  tailwindcss: {
    config: {
      content: [],
      plugins: [
        addDynamicIconSelectors(),
      ],
    },
  },

  ...(isGenerateMode
    ? {
        ignore: [
          "**/v1/**/*",
          "**/*.stories.{js,ts,jsx,tsx}",
          "**/*.{spec,test}.{js,ts,jsx,tsx}",
          "**/*.d.ts",
          ".output",
          "**/-*.*",
        ],
      }
    : {}),
})
