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
  <div class="UIFrame">
    <div class="UIFrame-Body">
      <header class="UIFrame-Header">
        <div class="UIFrame-HeaderContent">
          <UIIcon v-if="$slots.drawer" name="menu" @click="openDrawer" />
          <div v-if="$slots.title" class="UIFrame-HeaderTitle">
            <slot name="title" />
          </div>
          <div v-if="$slots.actions" class="UIFrame-HeaderActions">
            <slot name="actions" />
          </div>
        </div>
        <div v-if="$slots.top" class="UIFrame-HeaderTop">
          <slot name="top" />
        </div>
      </header>
      <main class="UIFrame-Content">
        <slot />
      </main>
      <footer
        v-if="$slots.bottom"
        class="UIFrame-Footer"
      >
        <slot name="bottom" />
      </footer>
    </div>
    <div
      v-if="$slots.drawer"
      class="UIFrame-Drawer"
      :class="{ hidden: !data.showDrawer }"
      @click="closeDrawer"
    >
      <div
        class="UIFrame-DrawerPanel"
        @click="onDrawerClick"
      >
        <div class="UIFrame-DrawerHeader">
          <UIIcon name="menu-open" @click="closeDrawer" />
          <div class="UIFrame-DrawerTitle">Nuxt3 App</div>
        </div>
        <div class="UIFrame-DrawerContent">
          <slot name="drawer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.UIFrame {
  @apply flex flex-row-reverse
    w-full min-h-screen max-w-full
    bg-white;
}

.UIFrame-Body {
  @apply
    flex flex-col grow
    overflow-x-clip;
}

.UIFrame-Header {
  @apply sticky top-0 left-0 right-0
    shadow
    overflow-hidden
    z-20;
}

.UIFrame-HeaderContent {
  @apply flex flex-row items-center gap-2
    border-b border-gray-300
    px-4 h-14
    bg-white;

  .UIIcon {
    @apply xl:hidden
      text-4xl
      cursor-pointer;
  }
}

.UIFrame-HeaderTitle {
  @apply grow
    overflow-hidden;
}

.UIFrame-HeaderActions {
  @apply flex flex-row items-center
    justify-self-end
    overflow-hidden;
}

.UIFrame-HeaderTop {
  @apply px-4 py-1
    border-b border-gray-400 overflow-hidden
    bg-white;
}

.UIFrame-Content {
  @apply grow
    p-4
    bg-slate-50
    overflow-hidden;
}

.UIFrame-Footer {
  @apply sticky bottom-0 left-0 right-0
    shadow
    border-t border-gray-400
    px-4 py-1
    bg-white
    overflow-hidden
    z-20;
}

.UIFrame-Drawer {
  @apply fixed top-0 bottom-0 left-0 right-0 xl:block xl:static
    bg-black/[.5]
    z-20;
}

.UIFrame-DrawerPanel {
  @apply sticky top-0
    w-fit h-screen
    overflow-y-auto
    bg-slate-900
    text-white;
}

.UIFrame-DrawerHeader {
  @apply flex items-center
    px-4
    w-64 h-14;

  .UIIcon {
    @apply xl:hidden
      mr-2
      text-4xl
      cursor-pointer;
  }
}

.UIFrame-DrawerTitle {
  @apply grow
    text-lg font-bold;
}
</style>
