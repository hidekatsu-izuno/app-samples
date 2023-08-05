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
    font-medium;
}

.UIButton-Error {
  @apply text-sm text-red-500;
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

.UIButton[data-color="slate"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-slate-500 enabled:hover:bg-slate-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="slate"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-slate-500 disabled:border-gray-400
      enabled:hover:bg-slate-500
      text-slate-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="gray"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-gray-500 enabled:hover:bg-gray-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="gray"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-gray-500 disabled:border-gray-400
      enabled:hover:bg-gray-500
      text-gray-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="zinc"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-zinc-500 enabled:hover:bg-zinc-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="zinc"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-zinc-500 disabled:border-gray-400
      enabled:hover:bg-zinc-500
      text-zinc-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="neutral"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-neutral-500 enabled:hover:bg-neutral-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="neutral"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-neutral-500 disabled:border-gray-400
      enabled:hover:bg-neutral-500
      text-neutral-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="stone"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-stone-500 enabled:hover:bg-stone-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="stone"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-stone-500 disabled:border-gray-400
      enabled:hover:bg-stone-500
      text-slate-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="blue"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-blue-700 enabled:hover:bg-blue-800 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="blue"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-blue-700 disabled:border-gray-400
      enabled:hover:bg-blue-700
      text-blue-700 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="red"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-red-700 enabled:hover:bg-red-800 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="red"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-red-700 disabled:border-gray-400
      enabled:hover:bg-red-700
      text-red-700 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="orange"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-orange-500 enabled:hover:bg-orange-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="orange"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-orange-500 disabled:border-gray-400
      enabled:hover:bg-orange-500
      text-orange-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="amber"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-amber-500 enabled:hover:bg-amber-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="amber"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-amber-500 disabled:border-gray-400
      enabled:hover:bg-amber-500
      text-amber-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="yellow"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-yellow-500 enabled:hover:bg-yellow-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="yellow"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-yellow-500 disabled:border-gray-400
      enabled:hover:bg-yellow-500
      text-yellow-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="lime"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-lime-600 enabled:hover:bg-lime-700 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="lime"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-lime-600 disabled:border-gray-400
      enabled:hover:bg-lime-600
      text-lime-600 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="green"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-green-600 enabled:hover:bg-green-700 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="green"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-green-600 disabled:border-gray-400
      enabled:hover:bg-green-600
      text-green-600 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="emerald"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-emerald-600 enabled:hover:bg-emerald-700 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="emerald"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-emerald-600 disabled:border-gray-400
      enabled:hover:bg-emerald-600
      text-emerald-600 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="teal"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-teal-600 enabled:hover:bg-teal-700 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="teal"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-teal-600 disabled:border-gray-400
      enabled:hover:bg-teal-600
      text-teal-600 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="cyan"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-cyan-600 enabled:hover:bg-cyan-700 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="cyan"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-cyan-600 disabled:border-gray-400
      enabled:hover:bg-cyan-600
      text-cyan-600 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="sky"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-sky-500 enabled:hover:bg-sky-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="sky"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-sky-500 disabled:border-gray-400
      enabled:hover:bg-sky-500
      text-sky-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="indigo"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-indigo-500 enabled:hover:bg-indigo-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="indigo"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-indigo-500 disabled:border-gray-400
      enabled:hover:bg-indigo-500
      text-indigo-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="violet"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-violet-500 enabled:hover:bg-violet-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="violet"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-violet-500 disabled:border-gray-400
      enabled:hover:bg-violet-500
      text-violet-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="purple"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-purple-500 enabled:hover:bg-purple-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="purple"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-purple-500 disabled:border-gray-400
      enabled:hover:bg-purple-500
      text-purple-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="fuchsia"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-fuchsia-500 enabled:hover:bg-fuchsia-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="fuchsia"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-fuchsia-500 disabled:border-gray-400
      enabled:hover:bg-fuchsia-500
      text-fuchsia-500 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="pink"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-pink-400 enabled:hover:bg-pink-500 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="pink"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-pink-400 disabled:border-gray-400
      enabled:hover:bg-pink-400
      text-pink-400 enabled:hover:text-white disabled:text-gray-400;
  }
}

.UIButton[data-color="rose"][data-type="filled"] {
  .UIButton-Input {
    @apply bg-rose-500 enabled:hover:bg-rose-600 disabled:bg-gray-400
      text-white;
  }
}

.UIButton[data-color="rose"][data-type="outline"] {
  .UIButton-Input {
    @apply border border-rose-500 disabled:border-gray-400
      enabled:hover:bg-rose-500
      text-rose-500 enabled:hover:text-white disabled:text-gray-400;
  }
}
</style>
