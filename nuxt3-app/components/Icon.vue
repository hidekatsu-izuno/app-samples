<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
}>(), {
})
</script>

<template>
  <div v-if="props.name === 'alert-circle-outline'" class="icon-[mdi--alert-circle-outline]"></div>
  <div v-else-if="props.name === 'close-circle'" class="icon-[mdi--close-circle]"></div>
  <div v-else-if="props.name === 'menu'" class="icon-[mdi--menu]"></div>
  <div v-else-if="props.name === 'menu-open'" class="icon-[mdi--menu-open]"></div>
  <div v-else-if="props.name === 'calendar'" class="icon-[mdi--calendar]"></div>
  <div v-else class="icon-[mdi--help]"></div>
</template>
