<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  halign?: "start" | "center" | "end"
}>(), {
})

const data = reactive({
  error: "",
})

const emits = defineEmits<{
  (event: "click", value: MouseEvent): void
}>()

const onClick = (event: MouseEvent) => {
  emits("click", event)
}
</script>

<template>
  <div class="Hyperlink flex flex-col">
    <label v-if="label"
      class="block"
    >{{ label }}</label>
    <a
      class="text-blue-600 cursor-pointer hover:underline"
      :class="{
        'block': !halign,
        'w-full': !halign,
        'self-start': halign === 'start',
        'self-center': halign === 'center',
        'self-end': halign === 'end',
      }"
      @click="onClick"
    ><slot /></a>
    <div v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
