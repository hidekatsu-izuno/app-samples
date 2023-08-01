<script setup lang="ts">
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
      <header class="sticky top-0 left-0 right-0 z-10 overflow-hidden">
        <div class="flex flex-row items-center px-4 h-14 bg-white border-b border-gray-300 gap-2">
          <Icon @click="openDrawer" name="menu" class="text-4xl xl:hidden cursor-pointer" />
          <div v-if="$slots.headerLeft" class="flex-grow overflow-hidden"><slot name="headerLeft" /></div>
          <div v-if="$slots.headerRight" class="flex-shrink justify-self-end overflow-hidden"><slot name="headerRight" /></div>
        </div>
        <div v-if="$slots.headerBottom" class="px-4 py-1 bg-white border-b border-gray-300 overflow-hidden"><slot name="headerBottom" /></div>
      </header>
      <main class="flex-grow p-4 bg-slate-50 overflow-hidden">
        <slot />
      </main>
      <footer v-if="$slots.footer"
        class="sticky bottom-0 left-0 right-0 px-4 py-2 bg-slate-400 z-10 overflow-hidden"
      ><slot name="footer" /></footer>
    </div>
    <div v-if="$slots.drawer" @click="closeDrawer"
      class="fixed top-0 bottom-0 left-0 right-0 xl:block xl:static bg-black/[.5] z-10"
      :class="{ hidden: !data.showDrawer }"
    >
      <div @click="onDrawerClick"
        class="sticky top-0 w-fit h-screen overflow-y-auto bg-slate-900 text-white"
      >
        <div class="flex items-center px-4 w-64 h-14">
          <Icon @click="closeDrawer" name="menu-open" class="text-4xl xl:hidden cursor-pointer mr-2" />
          <div class="flex-grow text-lg font-bold">Nuxt3 App</div>
        </div>
        <slot name="drawer" />
      </div>
    </div>
  </div>
</template>
