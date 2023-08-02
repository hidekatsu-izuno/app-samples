<template>
  <div class="flex flex-col w-full border border-gray-200 rounded-lg bg-white shadow">
    <div v-if="$slots.header" class="p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
      <slot name="header" />
    </div>
    <div class="flex-grow p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="p-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
      <slot name="footer" />
    </div>
  </div>
</template>
