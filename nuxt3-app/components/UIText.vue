<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: "outline",
  halign?: "start" | "center" | "end",
  size?: "sm" | "lg",
}>(), {
  halign: "start",
})
</script>

<template>
  <div
    class="UIText"
    :data-type="props.type"
  >
    <div class="UIText-Content"><slot /></div>
  </div>
</template>

<style>
.UIText-Content {
  @apply text-base
    min-h-[calc(1em+0.5em*2)]
    px-[0.5em] py-[0.25em]
    whitespace-pre-wrap;
}

.UIText[data-size="lg"] {
  .UIText-Content {
    @apply text-lg;
  }
}

.UIText[data-size="sm"] {
  .UIText-Content {
    @apply text-sm;
  }
}

.UIText[data-halign="start"] {
  .UIText-Content {
    @apply justify-start;
  }
}

.UIText[data-halign="center"] {
  .UIText-Content {
    @apply justify-center;
  }
}

.UIText[data-halign="end"] {
  .UIText-Content {
    @apply justify-end;
  }
}

.UIText[data-type="outline"] {
  .UIText-Content {
    @apply border border-gray-200;
  }
}
</style>
