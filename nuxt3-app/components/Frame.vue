<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string,
}>(), {
  title: ""
})

const data = reactive({
  showDrawer: false
})

function openDrawer() {
  data.showDrawer = true
}

function closeDrawer() {
  data.showDrawer = false
}

function onDrawerClick(e: MouseEvent) {
  e.stopPropagation()
}
</script>

<template>
  <div class="Frame flex flex-row-reverse w-full min-h-screen bg-white">
    <div class="flex flex-col flex-grow">
      <div class="flex flex-row items-center gap-x-0.5 sticky top-0 left-0 right-0 bg-white">
        <div @click="openDrawer"
          class="icon-[mdi--menu] text-4xl xl:hidden"
        ></div>
        <h1>{{ title }}</h1>
      </div>
      <div class="flex-grow"><slot /></div>
      <div v-if="$slots.footer"
        class="sticky bottom-0 left-0 right-0 bg-white"
      ><slot name="footer" /></div>
    </div>
    <div v-if="$slots.drawer" @click="closeDrawer"
      class="fixed top-0 bottom-0 left-0 right-0 xl:block xl:static bg-black/[.5]"
      :class="{ hidden: !data.showDrawer }"
    >
      <div @click="onDrawerClick"
        class="sticky top-0 w-fit h-screen overflow-y-auto bg-white"
      >
        <div class="flex items-center gap-x-0.5">
          <div @click="closeDrawer"
            class="icon-[mdi--menu-open] text-4xl xl:hidden"
          ></div>
          <div class="flex-grow">Nuxt3 App</div>
        </div>
        <slot name="drawer" />
      </div>
    </div>
  </div>
</template>
