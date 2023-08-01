<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  tabindex?: number,
  inputClass?: string | Record<string, boolean> | (string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  modelValue?: number,
  pageSize?: number,
  maxSize?: number,
}>(), {
  modelValue: 1,
  pageSize: 100,
  maxSize: 0,
})

const maxPage = computed(() => Math.max(Math.ceil(props.maxSize / props.pageSize), 1))

const emits = defineEmits<{
  (event: "focus", value: Event): void
  (event: "update:modelValue", value: number): void
  (event: "blur", value: Event): void
}>()

function onFocus(event: Event) {
  emits("focus", event)
}

function onClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLButtonElement
  const value = target.dataset.value
  if (value && /^[0-9]+$/.test(value)) {
    emits("update:modelValue", Number.parseInt(value))
  }
}

function onBlur(event: Event) {
  emits("blur", event)
}

</script>

<template>
  <div class="Paginator flex flex-row">
    <button type="button"
      class="flex items-center justify-center bg-white border border-gray-300 rounded-l-lg w-8 h-8 outline-none hover:enabled:text-white hover:enabled:border-0 hover:enabled:bg-blue-800 focus:ring-2 focus:ring-blue-200"
      :disabled="modelValue === 1"
      :data-value="Math.max(modelValue - 1, 1)"
      @click="onClick"
    ><Icon name="chevron-left" class="text-2xl" /></button>
    <button type="button" v-for="page in maxPage"
      class="-ml-[1px] flex items-center justify-center w-8 h-8 outline-none focus:ring-2 focus:ring-blue-200"
      :class="[modelValue === page ? 'text-white border-blue-700 bg-blue-700 hover:enabled:bg-blue-800' : 'border border-gray-300 bg-white hover:enabled:text-white hover:enabled:border-blue-800 hover:enabled:bg-blue-800']"
      :disabled="modelValue === page"
      :data-value="page"
      @click="onClick"
    >{{ page }}</button>
    <button type="button"
      class="-ml-[1px] flex items-center justify-center bg-white border border-gray-300 rounded-r-lg w-8 h-8 outline-none hover:enabled:text-white hover:enabled:border-0 hover:enabled:bg-blue-800 focus:ring-2 focus:ring-blue-200"
      :disabled="modelValue === maxPage"
      :data-value="Math.max(modelValue + 1, 1)"
      @click="onClick"
    ><Icon name="chevron-right" class="text-2xl" /></button>
  </div>
</template>
