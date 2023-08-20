<script setup lang="ts">
const historyState = useHistoryState()
const info = historyState.info

const userEmail = ref()
const userName = ref()
const birthDate = ref()
const comment = ref()
const isDeleted = ref()

function onUpdateButtonClick() {
}
</script>

<template>
  <UIFrame>
    <template #title>
      <h1 class="font-bold text-xl">ユーザーマスタ{{
        info.mode === "register" ? "登録" :
        info.mode === "delete" ? "削除" :
        "更新"
      }}</h1>
    </template>

    <div class="grid gap-4">
      <UICard>
        <template #header>
          <div class="px-4 py-2">
            <h2 class="font-bold">ユーザー情報</h2>
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
              <UIDateBox ref="birthDate" class="w-32" />
            </div>
          </div>
          <div>
            <UILabel>コメント</UILabel>
            <UITextBox ref="comment" class="w-80" />
          </div>
          <div>
            <UICheck ref="isDeleted">削除</UICheck>
          </div>
        </div>
        <template #footer>
          <div class="flex flex-row items-center justify-end px-4 py-2">
            <UIButton class="w-40" @click="onUpdateButtonClick">{{
              info.mode === "register" ? "登録" :
              info.mode === "delete" ? "削除" :
              "更新"
            }}</UIButton>
          </div>
        </template>
      </UICard>
    </div>

    <template #drawer>
      <MenuList />
    </template>
  </UIFrame>
</template>
