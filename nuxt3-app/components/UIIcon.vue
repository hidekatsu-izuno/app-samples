<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string,
}>(), {
})
</script>

<template>
  <div class="UIIcon" :data-name="props.name" />
</template>

<style>
.UIIcon[data-name="alert-circle-outline"] {
  @apply icon-[mdi--alert-circle-outline];
}

.UIIcon[data-name="arrow-left"] {
  @apply icon-[mdi--arrow-left];
}

.UIIcon[data-name="arrow-right"] {
  @apply icon-[mdi--arrow-right];
}

.UIIcon[data-name="calendar"] {
  @apply icon-[mdi--calendar];
}

.UIIcon[data-name="check"] {
  @apply icon-[mdi--check];
}

.UIIcon[data-name="check-bold"] {
  @apply icon-[mdi--check-bold];
}

.UIIcon[data-name="chevron-up"] {
  @apply icon-[mdi--chevron-up];
}

.UIIcon[data-name="chevron-down"] {
  @apply icon-[mdi--chevron-down];
}

.UIIcon[data-name="chevron-left"] {
  @apply icon-[mdi--chevron-left];
}

.UIIcon[data-name="chevron-right"] {
  @apply icon-[mdi--chevron-right];
}

.UIIcon[data-name="circle-medium"] {
  @apply icon-[mdi--circle-medium];
}

.UIIcon[data-name="close-circle"] {
  @apply icon-[mdi--close-circle];
}

.UIIcon[data-name="cog"] {
  @apply icon-[mdi--cog];
}

.UIIcon[data-name="help"] {
  @apply icon-[mdi--help];
}

.UIIcon[data-name="menu"] {
  @apply icon-[mdi--menu];
}

.UIIcon[data-name="menu-open"] {
  @apply icon-[mdi--menu-open];
}

.UIIcon[data-name="page-first"] {
  @apply icon-[mdi--page-first];
}

.UIIcon[data-name="page-last"] {
  @apply icon-[mdi--page-last];
}
</style>
