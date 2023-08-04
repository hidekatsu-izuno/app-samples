<script setup lang="ts">
const data = reactive({
  showDrawer: false,
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
  <div class="UIFrame flex flex-row-reverse w-full min-h-screen bg-white">
    <div class="flex flex-col grow">
      <header class="sticky top-0 left-0 right-0 z-20 overflow-hidden shadow">
        <div class="flex flex-row items-center px-4 h-14 bg-white border-b border-gray-300 gap-2">
          <UIIcon name="menu" class="text-4xl xl:hidden cursor-pointer" @click="openDrawer" />
          <div v-if="$slots.title" class="grow overflow-hidden">
            <slot name="title" />
          </div>
          <div v-if="$slots.actions" class="shrink justify-self-end overflow-hidden">
            <slot name="actions" />
          </div>
        </div>
        <div v-if="$slots.header" class="px-4 py-1 bg-white border-b border-gray-400 overflow-hidden">
          <slot name="header" />
        </div>
      </header>
      <main class="grow p-4 bg-slate-50 overflow-hidden">
        <slot />
      </main>
      <footer
        v-if="$slots.footer"
        class="sticky bottom-0 left-0 right-0 px-4 py-2 bg-white border-t border-gray-400 z-20 overflow-hidden shadow"
      >
        <slot name="footer" />
      </footer>
    </div>
    <div
      v-if="$slots.drawer"
      class="fixed top-0 bottom-0 left-0 right-0 xl:block xl:static bg-black/[.5] z-20"
      :class="{ hidden: !data.showDrawer }"
      @click="closeDrawer"
    >
      <div
        class="sticky top-0 w-fit h-screen overflow-y-auto bg-slate-900 text-white"
        @click="onDrawerClick"
      >
        <div class="flex items-center px-4 w-64 h-14">
          <UIIcon name="menu-open" class="text-4xl xl:hidden cursor-pointer mr-2" @click="closeDrawer" />
          <div class="grow text-lg font-bold">Nuxt3 App</div>
        </div>
        <slot name="drawer" />
      </div>
    </div>
  </div>
</template>
