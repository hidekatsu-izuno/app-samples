<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  href?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  disabled?: boolean,
}>(), {
})

const data = reactive({
  error: "",
})

const emits = defineEmits<{
  (event: "focus", value: Event): void
  (event: "click", value: MouseEvent): void
  (event: "blur", value: Event): void
}>()

function onFocus(event: MouseEvent) {
  emits("focus", event)
}

function onClick(event: MouseEvent) {
  emits("click", event)
}

function onBlur(event: MouseEvent) {
  emits("blur", event)
}
</script>

<template>
  <div class="UILink flex flex-col">
    <label
      v-if="label"
      class="block"
    >{{ label }}</label>
    <div
      :class="[
        halign ? `self-${halign}` : 'w-full',
      ]"
    >
      <NuxtLink
        class="rounded-md outline-none focus:ring-2 focus:ring-blue-200"
        :class="[
          disabled ? 'text-gray-400 cursor-default' : 'text-blue-600 hover:underline cursor-pointer',
          ...(Array.isArray(props.inputClass) ? props.inputClass : [ props.inputClass ])
        ]"
        :style="props.inputStyle"
        :href="!disabled && href"
        :tabindex="tabindex"
        @focus="onFocus"
        @click="!disabled && onClick"
        @blur="onBlur"
      >
        <slot />
      </NuxtLink>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >{{ data.error }}</div>
  </div>
</template>
