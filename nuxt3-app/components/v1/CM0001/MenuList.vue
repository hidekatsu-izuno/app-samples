<script setup lang="ts">
import { useHistoryState } from "vue-history-state"
const historyState = useHistoryState()

const data = reactive({
  menus: [
    { text: "ユーザー管理", icon: "alert-circle-outline", path: "/v1/CM0002/search_user" },
  ],
})

const goToPage = (path: string) => {
  historyState.push(path)
}
</script>

<template>
  <div class="p-4 pt-0">
    <ul v-for="(menu, index) in data.menus" :key="index">
      <li
        class="flex flex-row items-center p-2 rounded gap-x-0.5 hover:bg-blue-900 select-none cursor-pointer"
        @click="goToPage(menu.path)"
      >
        <UIIcon :name="menu.icon" />{{ menu.text }}
      </li>
    </ul>
  </div>
</template>
