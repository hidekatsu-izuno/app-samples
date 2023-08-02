<script setup lang="ts">
const props = withDefaults(defineProps<{
  halign?: "start" | "center" | "end",
  label?: string,
  href?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
}>(), {
})

const data = reactive({
  error: ""
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
  <div class="LinkButton flex flex-col">
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
        :href="href"
        :tabindex="tabindex"
        class="text-blue-600 rounded-md outline-none hover:underline focus:ring-2 focus:ring-blue-200 cursor-pointer"
        :class="props.inputClass"
        :style="props.inputStyle"
        @focus="onFocus"
        @click="onClick"
        @blur="onBlur"
      ><slot /></NuxtLink>
    </div>
    <div
      v-if="data.error"
      class="block text-sm text-red-500"
    >
      {{ data.error }}
    </div>
  </div>
</template>
