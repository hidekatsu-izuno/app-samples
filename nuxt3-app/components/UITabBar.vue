<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  items?: Array<{ value: string, text: string }>,
  modelValue?: string,
}>(), {
  items: () => [],
  modelValue: props => props.items?.[0].value ?? "",
})

const data = reactive({
  focused: false,
  value: "",
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
}, { immediate: true })

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "update:modelValue", value: string): void,
  (event: "change", value: Event): void,
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
  if (value) {
    data.value = value
    emits("update:modelValue", data.value)
    emits("change", event)
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
    class="UITabBar"
    @focus="onFocusin"
    @blur="onFocusout"
  >
    <button
      v-for="(item, index) in props.items"
      :key="index"
      class="UITabBar-Input"
      type="button"
      :class="props.inputClass"
      :style="props.inputStyle"
      :data-value="item.value"
      :disabled="item.value === data.value"
      :tabindex="props.tabindex"
      @click="onClick"
    >{{ item.text }}</button>
  </div>
</template>

<style>
.UITabBar {
  @apply flex flex-row items-center
    bg-white;
}

.UITabBar-Input {
  @apply appearance-none
    flex-auto
    focus:ring-2 focus:ring-blue-200
    outline-none
    border-b border-gray-300 disabled:border-b-2 disabled:border-blue-700
    p-4 enabled:pb-[17px]
    text-gray-400 font-bold disabled:text-blue-700;
}
</style>
