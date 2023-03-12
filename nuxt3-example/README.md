# Nuxt 3 example

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Create a project

```bash
npx nuxi@latest init nuxt3-example
```

## Setup

Make sure to install the dependencies:

```bash
npm install
```

### Install Tailwind CSS

```bash
npm install -D @nuxtjs/tailwindcss
```

```typescript:nuxt-config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
```

```js:./assets/css/tailwind.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Install Flowbit

```bash
npm install flowbite
```

```typescript:nuxt-config.ts
export default defineNuxtConfig({
  // ...
  tailwindcss: {
    config: {
      content: [
        "./node_modules/flowbite.{js,ts}"
      ],
      theme: {
        extend: {},
      },
      plugins: [
        flowbite
      ],
    }
  }
})
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
