<script setup lang="ts">
import MenuList from "~/components/v1/common/MenuList.vue"

const userEmail = ref()
const userName = ref()
const birthDateFrom = ref()
const birthDateTo = ref()
const isDeleted = ref()

const pageNo = ref(1)
const pageSize = ref(0)
const totalCount = ref(0)
const searchResult = ref<any[]>([])

async function onSearchButtonClick() {
  const req = await validate({
    userEmail,
    userName,
    birthDateFrom,
    birthDateTo,
    isDeleted,
  })
  const res = await fetchURL("/api/v1/master/user_search/search_users", {
    method: "POST",
    body: req,
  })
  pageNo.value = res.pageNo
  pageSize.value = res.pageSize
  totalCount.value = res.totalCount
  searchResult.value = res.items
}
</script>

<template>
  <UIFrame>
    <template #title>
      <h1 class="font-bold text-xl">ユーザーマスタ検索</h1>
    </template>

    <div class="grid gap-4">
      <UICard>
        <template #header>
          <div class="px-4 py-2">
            <h2 class="font-bold">検索条件</h2>
          </div>
        </template>
        <div class="flex flex-col px-4 py-2 gap-2">
          <div>
            <UILabel>メールアドレス</UILabel>
            <UITextBox ref="userEmail" class="w-80" />
          </div>
          <div>
            <UILabel>ユーザー名</UILabel>
            <UITextBox ref="userName" class="w-80" />
          </div>
          <div>
            <UILabel>誕生日</UILabel>
            <div class="flex flex-row items-center gap-2">
              <UIDateBox ref="birthDateFrom" class="w-32" /><div>～</div><UIDateBox ref="birthDateTo" class="w-32" />
            </div>
          </div>
          <div>
            <UICheck ref="isDeleted">削除されたものを含む</UICheck>
          </div>
        </div>
        <template #footer>
          <div class="flex flex-row items-center justify-end px-4 py-2">
            <UIButton class="w-40" @click="onSearchButtonClick">検索</UIButton>
          </div>
        </template>
      </UICard>

      <UICard>
        <template #header>
          <div class="flex flex-row items-center justify-between px-4 py-2">
            <h2 class="font-bold">検索結果</h2>
            <UIPaginator v-model="pageNo" :page-size="pageSize" :total-count="totalCount" />
          </div>
        </template>
        <UIDataTable
          v-model="searchResult"
          :items="[
            { key: 'userEmail', label: 'メールアドレス', width: '300px' },
            { key: 'userName', label: 'ユーザー名', width: '300px' },
            { key: 'birthDate', label: '誕生日', halign: 'center', width: '300px', format: (value: any) => formatDate(value, 'uuuu/MM/dd') },
            { key: 'comment', label: 'コメント', width: '300px' },
            { key: 'isDeleted', label: '削除', halign: 'center', width: '300px' },
          ]"
        >
          <template #contentCell="{ item, value }">
            <template v-if="item.key === 'date'">{{
              formatDate(value, 'uuuu/MM/dd')
            }}</template>
          </template>
        </UIDataTable>
      </UICard>
    </div>

    <template #drawer>
      <MenuList />
    </template>
  </UIFrame>
</template>
