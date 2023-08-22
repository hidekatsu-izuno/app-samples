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
}>(), {
  modelValue: 1,
  pageSize: 100,
  totalCount: 0,
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: number): void,
  (event: "blur", value: Event): void,
}>()

const data = reactive({
  focused: false,
  maxPage: 1,
  layout: [] as (number | undefined)[],
})

watch(() => [props.modelValue, props.pageSize, props.totalCount], () => {
  data.maxPage = Math.max(Math.ceil(props.totalCount / Math.max(props.pageSize, 1)), 1)

  const layout = [] as typeof data.layout
  const start = props.modelValue <= 4 ? 1 : Math.min(props.modelValue - 1, data.maxPage - 4)
  const end = props.modelValue >= data.maxPage - 3 ? data.maxPage : Math.max(props.modelValue + 1, 5)
  if (start !== 1) {
    layout.push(1, undefined)
  }
  for (let i = start; i <= end; i++) {
    layout.push(i)
  }
  if (end !== data.maxPage) {
    layout.push(undefined, data.maxPage)
  }
  data.layout = layout
}, { immediate: true })

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
    class="UIPaginator"
    :data-halign="props.halign || undefined"
    :data-disabled="props.disabled || undefined"
    @focusin="onFocusin"
    @focusout="onFocusout"
  >
    <button
      class="UIPaginator-PrevInput"
      type="button"
      :disabled="props.disabled || props.modelValue === 1"
      :data-value="Math.max(props.modelValue - 1, 1)"
      @click="onClick"
    >
      <UIIcon name="chevron-left" />
    </button>
    <template v-for="(page, index) in data.layout" :key="index">
      <button
        v-if="page"
        class="UIPaginator-PageInput"
        type="button"
        :disabled="props.disabled || props.modelValue === page"
        :data-value="page"
        @click="onClick"
      >{{ page }}</button>
      <div v-else class="UIPaginator-Leader" />
    </template>
    <button
      type="button"
      class="UIPaginator-NextInput"
      :disabled="props.disabled || props.modelValue === data.maxPage"
      :data-value="Math.min(props.modelValue + 1, data.maxPage)"
      @click="onClick"
    >
      <UIIcon name="chevron-right" />
    </button>
    <div class="UIPaginator-TotalCount">{{ props.totalCount }}</div>
  </div>
</template>

<style>
.UIPaginator {
  @apply flex flex-row;
}

.UIPaginator-PrevInput,
.UIPaginator-PageInput,
.UIPaginator-Leader,
.UIPaginator-NextInput {
  @apply flex items-center justify-center
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 hover:enabled:border-0
    w-8 h-8
    bg-white hover:enabled:bg-blue-800
    disabled:text-gray-400 hover:enabled:text-white
    focus:z-[1];

  .UIIcon {
    @apply text-2xl;
  }
}

.UIPaginator-PrevInput,
.UIPaginator-PageInput,
.UIPaginator-Leader {
  @apply -mr-[1px];
}

.UIPaginator-PrevInput {
  @apply rounded-l-lg;
}

.UIPaginator-Leader::after {
  content: "…"
}

.UIPaginator-NextInput {
  @apply rounded-r-lg;
}

.UIPaginator-TotalCount {
  @apply flex items-center justify-end
    pl-2
    whitespace-nowrap;
}

.UIPaginator-TotalCount::after {
  content: " 件"
}

.UIPaginator[data-disabled="true"] {
  @apply text-gray-400;
}

.UIPaginator[data-halign="start"] {
  @apply justify-start;
}

.UIPaginator[data-halign="center"] {
  @apply justify-center;
}

.UIPaginator[data-halign="end"] {
  @apply justify-end;
}
</style>
