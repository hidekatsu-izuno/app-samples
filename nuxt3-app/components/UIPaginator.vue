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

const data = reactive({
  focused: false,
})

const maxPage = computed(() => Math.max(Math.ceil(props.totalCount / props.pageSize), 1))

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: number): void,
  (event: "blur", value: Event): void,
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
    class="UIPaginator"
    :class="[
      props.disabled ? 'UIPaginator-disabled' : '',
      props.halign ? `UIPaginator-halign-${props.halign}` : '',
    ]"
    @focusin="onFocusin"
    @focusout="onFocusout"
  >
    <button
      class="UIPaginator-FirstInput"
      type="button"
      :disabled="props.disabled || props.modelValue === 1"
      :data-value="1"
      :tabindex="props.tabindex"
      @click="onClick"
    >
      <UIIcon name="page-first" />
    </button>
    <button
      class="UIPaginator-PrevInput"
      type="button"
      :disabled="props.disabled || props.modelValue === 1"
      :data-value="Math.max(props.modelValue - 1, 1)"
      @click="onClick"
    >
      <UIIcon name="chevron-left" />
    </button>
    <div
      class="UIPaginator-Page"
    >{{ props.modelValue }} / {{ maxPage }}</div>
    <button
      type="button"
      class="UIPaginator-NextInput"
      :disabled="props.disabled || props.modelValue === maxPage"
      :data-value="Math.min(props.modelValue + 1, maxPage)"
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

.UIPaginator-FirstInput,
.UIPaginator-PrevInput,
.UIPaginator-NextInput {
  @apply flex items-center justify-center
    focus:ring-2 focus:ring-blue-200
    outline-none
    border border-gray-300 hover:enabled:border-0
    w-8 h-8
    bg-white hover:enabled:bg-blue-800
    disabled:text-gray-400 hover:enabled:text-white;

    .UIIcon {
      @apply text-2xl;
    }
}

.UIPaginator-FirstInput {
  @apply rounded-l-lg;
}

.UIPaginator-PrevInput {
  margin-left: -1px;
}

.UIPaginator-NextInput {
  @apply rounded-r-lg;
}

.UIPaginator-Page {
  @apply flex items-center justify-center
    focus:ring-2 focus:ring-blue-200
    outline-none
    border-y border-gray-300 hover:enabled:border-0
    w-48 h-8
    bg-white hover:enabled:bg-blue-800
    hover:enabled:text-white;
}

.UIPaginator-TotalCount {
  @apply flex items-center
    px-2;
}

.UIPaginator-TotalCount::after {
  content: ' 件'
}

.UIPaginator-disabled {
  @apply text-gray-400;
}

.UIPaginator-halign-start {
  @apply justify-start;
}

.UIPaginator-halign-center {
  @apply justify-center;
}

.UIPaginator-halign-end {
  @apply justify-end;
}
</style>
