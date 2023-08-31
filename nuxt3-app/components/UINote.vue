<script setup lang="ts">
const props = withDefaults(defineProps<{
  type: "error" | "warn" | "info",
}>(), {
})
</script>

<template>
  <div
    class="UINote"
    :data-type="props.type"
  >
    <slot />
  </div>
</template>

<style>
.UINote {
  @apply flex flex-row items-center gap-2
    px-[1em] py-[calc(0.125em+1px)];

  .UIIcon {
    @apply text-xl;
  }
}

.UINote[data-type="error"] {
  @apply border border-red-300 rounded-lg
    bg-red-50
    text-red-600;
}

.UINote[data-type="warn"] {
  @apply border border-yellow-400 rounded-lg
    bg-yellow-50
    text-yellow-800;
}

.UINote[data-type="info"] {
  @apply border border-blue-300 rounded-lg
    bg-blue-50
    text-blue-600;
}
</style>
