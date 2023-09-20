<script setup lang="ts">
const props = withDefaults(defineProps<{
  type: "slideup",
  delay?: string,
  duration?: string,
}>(), {
  delay: "0s",
  duration: "1s",
  timing: "ease",
})

const data = reactive({
  height: "",
})

function onEnter(el: HTMLElement) {
  if (props.type === "slideup") {
    data.height = `${el.offsetHeight}px`
  }
}

function onAfterEnter(el: HTMLElement) {
  if (el.dataset.height) {
    data.height = ""
  }
}

function onLeave(el: HTMLElement) {
  if (props.type === "slideup") {
    data.height = `${el.offsetHeight}px`
  }
}

function onAfterLeave(el: HTMLElement) {
  if (props.type === "slideup") {
    if (el.dataset.height) {
      data.height = ""
    }
  }
}
</script>

<template>
  <Transition
    :name="`UIEffect-${props.type}`"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <slot />
  </Transition>
</template>

<style>
.UIEffect-slideup-enter-active,
.UIEffect-slideup-leave-active {
  transition: max-height v-bind("props.duration") ease v-bind("props.delay");
  overflow: hidden;
}

.UIEffect-slideup-enter-to,
.UIEffect-slideup-leave-from {
  max-height: v-bind("data.height");
}

.UIEffect-slideup-enter-from,
.UIEffect-slideup-leave-to {
  max-height: 0;
}
</style>
