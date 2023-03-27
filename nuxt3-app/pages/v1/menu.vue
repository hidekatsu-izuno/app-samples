<script setup lang="ts">
const { data } = useFetch("/api/v1/menu")
</script>

<template>
  <Frame title="Menu" :user="data?.user" :menus="data?.menus">
    <h1 class="text-2xl font-bold">Menu</h1>
  </Frame>
</template>
