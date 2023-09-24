<script setup lang="ts">
const props = withDefaults(defineProps<{
  type: "slideup" | "slideleft",
  delay?: string,
  duration?: string,
}>(), {
  delay: "0s",
  duration: "1s",
  timing: "ease",
})

const data = reactive({
  size: "",
})

function onBeforeEnter(el: HTMLElement) {
  if (props.type === "slideup") {
    data.size = `${el.scrollHeight}px`
  } else if (props.type === "slideleft") {
    if (el.parentElement) {
      if (el.style.width === "" || el.style.width === "auto") {
        data.size = `${el.parentElement.scrollWidth}px`
      }
    }
    if (!data.size) {
      data.size = `${el.scrollWidth}px`
    }
  }
}

function onAfterEnter(el: HTMLElement) {
  if (el.dataset.height) {
    data.size = ""
  }
}

function onBeforeLeave(el: HTMLElement) {
  if (props.type === "slideup") {
    data.size = `${el.scrollHeight}px`
  } else if (props.type === "slideleft") {
    if (el.parentElement) {
      if (el.style.width === "" || el.style.width === "auto") {
        data.size = `${el.parentElement.scrollWidth}px`
      }
    }
    if (!data.size) {
      data.size = `${el.scrollWidth}px`
    }
  }
}

function onAfterLeave(el: HTMLElement) {
  if (props.type === "slideup") {
    if (el.dataset.height) {
      data.size = ""
    }
  }
}
</script>

<template>
  <Transition
    :name="`UIEffect-${props.type}`"
    @before-enter="onBeforeEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @after-leave="onAfterLeave"
  >
    <slot />
  </Transition>
</template>

<style>
.UIEffect-slideup-enter-active,
.UIEffect-slideup-leave-active {
  transition: max-height v-bind("props.duration") ease v-bind("props.delay");
  overflow-y: hidden;
}

.UIEffect-slideup-enter-to,
.UIEffect-slideup-leave-from {
  max-height: v-bind("data.size");
}

.UIEffect-slideup-enter-from,
.UIEffect-slideup-leave-to {
  max-height: 0;
}

.UIEffect-slideleft-enter-active,
.UIEffect-slideleft-leave-active {
  transition: max-width v-bind("props.duration") ease v-bind("props.delay");
  overflow-x: hidden;
}

.UIEffect-slideleft-enter-to,
.UIEffect-slideleft-leave-from {
  max-width: v-bind("data.size");
}

.UIEffect-slideleft-enter-from,
.UIEffect-slideleft-leave-to {
  max-width: 0;
}
</style>
