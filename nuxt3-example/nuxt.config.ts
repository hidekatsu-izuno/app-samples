// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
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
  }
})
