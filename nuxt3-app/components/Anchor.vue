<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  halign?: "start" | "center" | "end"
  error?: string
}>(), {
})
</script>

<template>
  <div class="Anchor flex flex-col">
    <label v-if="label"
      class="block"
    >{{ label }}</label>
    <a href=""
      class="text-blue-600 hover:underline"
      :class="{
        'block': !halign,
        'w-full': !halign,
        'self-start': halign === 'start',
        'self-center': halign === 'center',
        'self-end': halign === 'end',
      }"
    ><slot /></a>
    <div v-if="error"
      class="block text-red-500"
    >{{ error }}</div>
  </div>
</template>
