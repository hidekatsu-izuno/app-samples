<script setup lang="ts">
import MenuList from "~/components/v1/common/MenuList.vue"

const historyState = useHistoryState()
const loading = useLoadingIndicator()

const data = useRestorableData({
  userEmail: "",
  userName: "",
  birthDateFrom: "",
  birthDateTo: "",
  isDeleted: false,

  pageNo: 1,
  pageSize: 1,
  totalCount: 0,
  searchResult: [] as any[],

  infoMessage: "",
  errorMessage: "",
})

const userEmail = ref()
const userName = ref()
const birthDateFrom = ref()
const birthDateTo = ref()
const isDeleted = ref()

const alert = ref()

onMounted(async () => {
  if (historyState.info?.refresh) {
    await onSearchButtonClick()
  }
  data.infoMessage = historyState.info?.message
})

async function onSearchButtonClick() {
  try {
    const req = await validate({
      userEmail,
      userName,
      birthDateFrom,
      birthDateTo,
      isDeleted,
    })

    loading.start()
    const res = await fetchURL("/api/v1/master/user_search/search_users", {
      method: "POST",
      body: req,
    })
    data.pageNo = res.pageNo
    data.pageSize = res.pageSize
    data.totalCount = res.totalCount
    data.searchResult = res.records
  } catch (err) {
    if (err instanceof BusinessError) {
      alert.value.open(err.message)
    } else {
      throw err
    }
  } finally {
    loading.finish()
  }
}

function onSelectButtonClick(mode: string, userId?: string) {
  historyState.push("./user_update", { mode, userId })
}
</script>

<template>
  <UIFrame backable>
    <template #title>
      <h1 class="font-bold text-xl">ユーザーマスタ検索</h1>
    </template>

    <div class="grid gap-4">
      <UINote v-if="data.infoMessage" type="info">{{ data.infoMessage }}</UINote>

      <UICard>
        <template #header>
          <div class="px-2 py-1">
            <h2 class="font-bold">検索条件</h2>
          </div>
        </template>
        <div class="flex flex-col px-4 py-2 gap-2">
          <div>
            <UILabel>メールアドレス</UILabel>
            <UITextBox ref="userEmail" v-model="data.userEmail" class="w-80" />
          </div>
          <div>
            <UILabel>ユーザー名</UILabel>
            <UITextBox ref="userName" v-model="data.userName" class="w-80" />
          </div>
          <div>
            <UILabel>誕生日</UILabel>
            <div class="flex flex-row gap-2">
              <UIDateBox ref="birthDateFrom" v-model="data.birthDateFrom" class="w-32" />
              <UIText>～</UIText>
              <UIDateBox ref="birthDateTo" v-model="data.birthDateTo" class="w-32" />
            </div>
          </div>
          <div>
            <UICheck ref="isDeleted" v-model="data.isDeleted">削除されたものを含む</UICheck>
          </div>
        </div>
        <template #footer>
          <div class="flex-auto flex flex-row items-center justify-end px-2 py-1">
            <UIButton class="w-40" @click="onSearchButtonClick">検索</UIButton>
          </div>
        </template>
      </UICard>

      <UICard>
        <template #header>
          <div class="flex-auto flex flex-row items-center justify-between px-2 py-1">
            <UIPaginator v-model="data.pageNo" :page-size="data.pageSize" :total-count="data.totalCount" />
            <UIButton @click="() => onSelectButtonClick('register')">追加</UIButton>
          </div>
        </template>
        <UIDataTable
          v-model="data.searchResult"
          :items="[
            { key: 'userId', label: '', width: '160px' },
            { key: 'userEmail', label: 'メールアドレス', width: '300px' },
            { key: 'userName', label: 'ユーザー名', width: '300px' },
            { key: 'isDeleted', label: '削除', halign: 'center', width: '100px', format: (value: any) => value ? '削除' : '' },
          ]"
        >
          <template #contentCell="{ item, value }">
            <template v-if="item.key === 'userId'">
              <div class="flex-auto flex flex-row justify-center gap-2">
                <UIButton size="sm" @click="() => onSelectButtonClick('update', value)">更新</UIButton>
                <UIButton size="sm" @click="() => onSelectButtonClick('delete', value)">削除</UIButton>
              </div>
            </template>
          </template>
        </UIDataTable>
      </UICard>
    </div>

    <UIAlert ref="alert" type="error">{{ data.errorMessage }}</UIAlert>

    <template #drawer>
      <MenuList />
    </template>
  </UIFrame>
</template>
