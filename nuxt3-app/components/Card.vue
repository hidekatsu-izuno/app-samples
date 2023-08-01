<script setup type="ts">

</script>

<template>
  <div class="flex flex-col w-full p-6 border border-gray-200 rounded-lg bg-white shadow">
    <div v-if="$slots.header"><slot name="header" /></div>
    <div class="flex-grow">
      <slot />
    </div>
    <div v-if="$slots.footer"><slot name="footer" /></div>
  </div>
</template>
