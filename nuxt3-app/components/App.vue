
<script setup type="ts">
import { initFlowbite } from 'flowbite'

onMounted(() => {
    initFlowbite()
})
</script>

<template>
  <div class="min-h-screen">
    <slot />
  </div>
</template>
