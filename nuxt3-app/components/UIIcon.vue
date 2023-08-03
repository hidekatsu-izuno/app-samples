<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string,
}>(), {
})
</script>

<template>
  <div v-if="props.name === 'alert-circle-outline'" class="UIIcon icon-[mdi--alert-circle-outline]" />
  <div v-else-if="props.name === 'arrow-left'" class="UIIcon icon-[mdi--arrow-left]" />
  <div v-else-if="props.name === 'arrow-right'" class="UIIcon icon-[mdi--arrow-right]" />
  <div v-else-if="props.name === 'close-circle'" class="UIIcon icon-[mdi--close-circle]" />
  <div v-else-if="props.name === 'calendar'" class="UIIcon icon-[mdi--calendar]" />
  <div v-else-if="props.name === 'chevron-left'" class="UIIcon icon-[mdi--chevron-left]" />
  <div v-else-if="props.name === 'chevron-right'" class="UIIcon icon-[mdi--chevron-right]" />
  <div v-else-if="props.name === 'help'" class="UIIcon icon-[mdi--help]" />
  <div v-else-if="props.name === 'menu'" class="UIIcon icon-[mdi--menu]" />
  <div v-else-if="props.name === 'menu-open'" class="UIIcon icon-[mdi--menu-open]" />
  <div v-else-if="props.name === 'page-first'" class="UIIcon icon-[mdi--page-first]" />
  <div v-else-if="props.name === 'page-last'" class="UIIcon icon-[mdi--page-last]" />
</template>
