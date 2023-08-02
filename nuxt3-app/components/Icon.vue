<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string,
}>(), {
})
</script>

<template>
  <div v-if="props.name === 'alert-circle-outline'" class="icon-[mdi--alert-circle-outline]" />
  <div v-else-if="props.name === 'arrow-left'" class="icon-[mdi--arrow-left]" />
  <div v-else-if="props.name === 'arrow-right'" class="icon-[mdi--arrow-right]" />
  <div v-else-if="props.name === 'close-circle'" class="icon-[mdi--close-circle]" />
  <div v-else-if="props.name === 'menu'" class="icon-[mdi--menu]" />
  <div v-else-if="props.name === 'menu-open'" class="icon-[mdi--menu-open]" />
  <div v-else-if="props.name === 'calendar'" class="icon-[mdi--calendar]" />
  <div v-else-if="props.name === 'chevron-left'" class="icon-[mdi--chevron-left]" />
  <div v-else-if="props.name === 'chevron-right'" class="icon-[mdi--chevron-right]" />
  <div v-else class="icon-[mdi--help]" />
</template>
