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
})

watch(() => [props.pageSize, props.totalCount], () => {
  data.maxPage = Math.max(Math.ceil(props.totalCount / Math.max(props.pageSize, 1)), 1)
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
    class="UIPageNavigator"
    :data-halign="props.halign || undefined"
    :data-disabled="props.disabled || undefined"
    @focusin="onFocusin"
    @focusout="onFocusout"
  >
    <button
      class="UIPageNavigator-FirstInput"
      type="button"
      :disabled="props.disabled || props.modelValue === 1"
      :data-value="1"
      :tabindex="props.tabindex ?? ''"
      @click="onClick"
    >
      <UIIcon name="page-first" />
    </button>
    <button
      class="UIPageNavigator-PrevInput"
      type="button"
      :disabled="props.disabled || props.modelValue === 1"
      :data-value="Math.max(props.modelValue - 1, 1)"
      @click="onClick"
    >
      <UIIcon name="chevron-left" />
    </button>
    <div
      class="UIPageNavigator-Page"
    >{{ props.modelValue }} / {{ data.maxPage }}</div>
    <button
      type="button"
      class="UIPageNavigator-NextInput"
      :disabled="props.disabled || props.modelValue === data.maxPage"
      :data-value="Math.min(props.modelValue + 1, data.maxPage)"
      @click="onClick"
    >
      <UIIcon name="chevron-right" />
    </button>
    <div class="UIPageNavigator-TotalCount">{{ props.totalCount }}</div>
  </div>
</template>

<style>
.UIPageNavigator {
  @apply flex flex-row;
}

.UIPageNavigator-FirstInput,
.UIPageNavigator-PrevInput,
.UIPageNavigator-NextInput {
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

.UIPageNavigator-FirstInput,
.UIPageNavigator-PrevInput,
.UIPageNavigator-Page {
  @apply -mr-[1px];
}

.UIPageNavigator-FirstInput {
  @apply rounded-l-lg;
}

.UIPageNavigator-NextInput {
  @apply rounded-r-lg;
}

.UIPageNavigator-Page {
  @apply flex items-center justify-center
    outline-2 outline-blue-200
    border border-gray-300 hover:enabled:border-0
    px-2
    bg-white hover:enabled:bg-blue-800
    hover:enabled:text-white
    whitespace-nowrap;
}

.UIPageNavigator-TotalCount {
  @apply flex items-center justify-end
    pl-2
    whitespace-nowrap;
}

.UIPageNavigator-TotalCount::after {
  content: " 件"
}

.UIPageNavigator[data-disabled="true"] {
  @apply text-gray-400;
}

.UIPageNavigator[data-halign="start"] {
  @apply justify-start;
}

.UIPageNavigator[data-halign="center"] {
  @apply justify-center;
}

.UIPageNavigator[data-halign="end"] {
  @apply justify-end;
}
</style>
