<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  halign?: "start" | "center" | "end"
}>(), {
})
</script>

<template>
  <div class="Button flex flex-col">
    <label v-if="label"
      class="block"
    >{{ label }}</label>
    <button type="button"
      class="text-white px-5 py-2.5 m-0 bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
      :class="{
        'block': !halign,
        'w-full': !halign,
        'self-start': halign === 'start',
        'self-center': halign === 'center',
        'self-end': halign === 'end',
      }"
    ><slot /></button>
  </div>
</template>
