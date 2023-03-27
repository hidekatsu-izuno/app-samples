<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: boolean
}>(), {
  modelValue: false,
})
</script>

<template>
  <div>
    <slot />

    <div class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40" :class="{ 'hidden': !modelValue }">
    </div>
  </div>
</template>
