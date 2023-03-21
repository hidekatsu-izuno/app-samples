<script setup lang="ts">
withDefaults(defineProps<{
  type?: "text" | "password" | "email"
  label?: string
  placeholder?: string
}>(), {
  type: "text"
})
</script>

<template>
  <div class="TextBox">
    <label v-if="label"
      class="block"
    >{{ label }}</label>
    <input :type="type" :placeholder="placeholder"
      class="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600"
    />
  </div>
</template>
