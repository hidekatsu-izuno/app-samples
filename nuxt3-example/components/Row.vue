<script setup lang="ts">
withDefaults(defineProps<{
  align?: "start" | "center" | "end"
}>(), {
  align: "start"
})
</script>

<template>
<div class="flex flex-row items-center" :class="[`justify-${align}`]">
  <slot />
</div>
</template>
