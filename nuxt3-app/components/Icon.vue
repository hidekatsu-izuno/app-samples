<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
}>(), {
})
</script>

<template>
  <template v-if="props.name === 'alert-circle-outline'">
    <div class="icon-[mdi--alert-circle-outline]"></div>
  </template>
  <template v-else-if="props.name === 'menu'">
    <div class="icon-[mdi--menu]"></div>
  </template>
  <template v-else-if="props.name === 'menu-open'">
    <div class="icon-[mdi--menu-open]"></div>
  </template>
  <template v-else>
    <div class="icon-[mdi--help]"></div>
  </template>
</template>
