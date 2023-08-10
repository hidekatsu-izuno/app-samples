<script setup lang="ts">
useHead({
  title: "Nuxt3 Sample App",
})
</script>
<template>
  <NuxtLayout>
    <UILoadingIndicator>
      <NuxtPage />
    </UILoadingIndicator>
  </NuxtLayout>
</template>
