
<script setup type="ts">
import { initFlowbite } from 'flowbite'

onMounted(() => {
    initFlowbite()
})
</script>

<template>
  <div class="bg-gray-50">
    <slot />
  </div>
</template>
