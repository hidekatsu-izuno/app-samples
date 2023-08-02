<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  modelValue?: number,
  pageSize?: number,
  totalCount?: number,
  disabled?: boolean,
  readonly?: boolean,
}>(), {
  modelValue: 1,
  pageSize: 100,
  totalCount: 0,
})

const data = reactive({
  focused: false
})

const maxPage = computed(() => Math.max(Math.ceil(props.totalCount / props.pageSize), 1))

const emits = defineEmits<{
  (event: "focus", value: Event): void
  (event: "update:modelValue", value: number): void
  (event: "blur", value: Event): void
}>()

function onFocusin(event: Event) {
  if (!data.focused) {
    data.focused = true
    emits("focus", event)
  }
}

function onClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLButtonElement
  const value = target.dataset.value
  if (value && /^[0-9]+$/.test(value)) {
    emits("update:modelValue", Number.parseInt(value))
  }
}

function onFocusout(event: Event) {
  const currentTarget = event.currentTarget as HTMLElement
  requestAnimationFrame(() => {
    if (!currentTarget.contains(document.activeElement)) {
      emits("blur", event)
      data.focused = false
    }
  })
}
</script>

<template>
  <div
    class="Paginator flex flex-row"
    @focusin="onFocusin"
    @focusout="onFocusout"
  >
    <button
      type="button"
      class="flex items-center justify-center bg-white border border-gray-300 rounded-l-lg w-8 h-8 outline-none disabled:text-gray-500 hover:enabled:text-white hover:enabled:border-0 hover:enabled:bg-blue-800 focus:ring-2 focus:ring-blue-200"
      :disabled="disabled || modelValue === 1"
      :data-value="1"
      @click="onClick"
    >
      <Icon name="page-first" class="text-2xl" />
    </button>
    <button
      type="button"
      class="-ml-[1px] flex items-center justify-center bg-white border border-gray-300 w-8 h-8 outline-none disabled:text-gray-500 hover:enabled:text-white hover:enabled:border-0 hover:enabled:bg-blue-800 focus:ring-2 focus:ring-blue-200"
      :disabled="disabled || modelValue === 1"
      :data-value="Math.max(modelValue - 1, 1)"
      @click="onClick"
    >
      <Icon name="chevron-left" class="text-2xl" />
    </button>
    <div
      class="flex items-center justify-center bg-white border-y border-gray-300 w-48 h-8 outline-none hover:enabled:text-white hover:enabled:border-0 hover:enabled:bg-blue-800 focus:ring-2 focus:ring-blue-200"
    >{{ modelValue }} / {{ maxPage }}</div>
    <button
      type="button"
      class="flex items-center justify-center bg-white border border-gray-300 rounded-r-lg w-8 h-8 outline-none disabled:text-gray-500 hover:enabled:text-white hover:enabled:border-0 hover:enabled:bg-blue-800 focus:ring-2 focus:ring-blue-200"
      :disabled="disabled || modelValue === maxPage"
      :data-value="Math.min(modelValue + 1, maxPage)"
      @click="onClick"
    >
      <Icon name="chevron-right" class="text-2xl" />
    </button>
  </div>
</template>
