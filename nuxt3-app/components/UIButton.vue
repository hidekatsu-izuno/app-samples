<script setup lang="ts">
const props = withDefaults(defineProps<{
  label?: string,
  halign?: "start" | "center" | "end",
  type?: "filled" | "outline",
  color?: "slate" | "gray" | "zinc" | "neutral" | "stone" |
    "red" | "orange" | "amber" | "yellow" |
    "lime" | "green" | "emerald" | "teal" |
    "cyan" | "sky" | "blue" | "indigo" |
    "violet" | "purple" | "fuchsia" | "pink" | "rose",
  prefix?: string,
  suffix?: string,
  tabindex?: number,
  inputClass?: string | Record<string, boolean> |(string | Record<string, boolean>)[],
  inputStyle?: string | Record<string, string> | (string | Record<string, string>)[],
  error?: string,
  disabled?: boolean,
}>(), {
  type: "filled",
  color: "blue",
})

const emits = defineEmits<{
  (event: "focus", value: Event): void,
  (event: "click", value: MouseEvent): void,
  (event: "blur", value: Event): void,
}>()

function onFocus(event: Event) {
  emits("focus", event)
}

function onClick(event: MouseEvent) {
  emits("click", event)
}

function onBlur(event: Event) {
  emits("blur", event)
}
</script>

<template>
  <div
    class="UIButton"
    :data-type="props.type"
    :data-color="props.color"
    :data-disabled="props.disabled || undefined"
    :data-halign="props.halign"
  >
    <label
      v-if="props.label"
      class="UIButton-Label"
    >{{ props.label }}</label>
    <div class="UIButton-Content">
      <div v-if="props.prefix" class="UITextBox-Prefix">{{ props.prefix }}</div>
      <button
        class="UIButton-Input"
        type="button"
        :class="props.inputClass"
        :style="props.inputStyle"
        :disabled="props.disabled"
        :tabindex="props.tabindex"
        @focus="onFocus"
        @click="onClick"
        @blur="onBlur"
      >
        <slot />
      </button>
      <div v-if="props.suffix" class="UITextBox-Suffix">{{ props.suffix }}</div>
    </div>
    <div
      v-if="error"
      class="UIButton-Error"
    >{{ error }}</div>
  </div>
</template>

<style>
.UIButton-Label {
  @apply block;
}

.UIButton-Content {
  @apply flex flex-row items-center gap-2;
}

.UIButton-Input {
  @apply focus:ring-2 focus:ring-blue-200
    outline-none
    rounded-md
    m-0
    w-full
    px-4 py-1.5
    font-medium disabled:text-gray-400;
}

.UIButton-Error {
  @apply text-sm text-red-500;
}

.UIButton[data-type="filled"] {
  .UIButton-Input {
    @apply bg-blue-700 hover:bg-blue-900 disabled:bg-gray-500
      text-white;
  }
}

.UIButton[data-type="outline"] {
  .UIButton-Input {
    @apply border border-blue-700 disabled:border-gray-500
      bg-transparent hover:bg-blue-900 disabled:hover:bg-transparent
      text-blue-700 hover:text-white disabled:text-gray-500;
  }
}

.UIButton[data-halign="start"] {
  .UIButton-Content {
    @apply justify-start;
  }

  .UIButton-Input {
    @apply w-auto;
  }
}

.UIButton[data-halign="center"] {
  .UIButton-Content {
    @apply justify-center;
  }

  .UIButton-Input {
    @apply w-auto;
  }
}
.UIButton[data-halign="end"] {
  .UIButton-Content {
    @apply justify-end;
  }

  .UIButton-Input {
    @apply w-auto;
  }
}
</style>
