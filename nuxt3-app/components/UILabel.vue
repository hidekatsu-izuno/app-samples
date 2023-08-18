<script setup lang="ts">
const props = withDefaults(defineProps<{
  required?: boolean,
  description?: string,
}>(), {
  required: false,
})
</script>

<template>
  <div
    class="UILabel"
    :data-required="props.required || undefined"
  >
    <label class="UILabel-Text"
    ><slot /></label>
    <span
      class="UILabel-Description"
      v-if="props.description"
    >{{ props.description }}</span>
  </div>
</template>

<style>
.UILabel {
  @apply flex flex-row items-center gap-2;
}

.UILabel-Text {
  @apply font-medium;
}

.UILabel-Description {
  @apply text-gray-500
    text-sm;
}

.UILabel[data-required="true"] {
  .UILabel-Text::after {
    @apply text-red-500;
    content: " ※";
  }
}
</style>
