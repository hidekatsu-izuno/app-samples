<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  halign?: "start" | "center" | "end"
  error?: string
}>(), {
})

const emits = defineEmits<{
  (event: "update:error", value: string): void
  (event: "click", value: MouseEvent): void
}>()

const emitError = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits("update:error", target.value)
}

const onClick = (event: MouseEvent) => {
  emits("click", event)
}
</script>

<template>
  <div class="Hyperlink flex flex-col">
    <label v-if="label"
      class="block"
    >{{ label }}</label>
    <a href=""
      class="text-blue-600 hover:underline"
      :class="{
        'block': !halign,
        'w-full': !halign,
        'self-start': halign === 'start',
        'self-center': halign === 'center',
        'self-end': halign === 'end',
      }"
    ><slot /></a>
    <div v-if="error"
      class="block text-sm text-red-500"
    >{{ error }}</div>
  </div>
</template>
