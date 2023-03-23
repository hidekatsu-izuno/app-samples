const isGenerateMode = process.argv.includes('generate')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    }
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "vue-history-state/nuxt",
  ],
  tailwindcss: {
    config: {
      content: [
        "./node_modules/flowbite/**/*.js"
      ],
      theme: {
        extend: {},
      },
      plugins: [
        require("flowbite")
      ],
    }
  },

  ...(isGenerateMode ? {
    ignore: [
      "**/v1/**/*",
      "**/*.stories.{js,ts,jsx,tsx}",
      "**/*.{spec,test}.{js,ts,jsx,tsx}",
      "**/*.d.ts",
      ".output",
      "**/-*.*"
    ]
  } : {})
})
