<script setup lang="ts">
useHead({
  title: "Nuxt3 Sample App",
})
</script>
<template>
  <NuxtLayout>
    <div>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
