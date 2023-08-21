<script setup lang="ts">
const historyState = useHistoryState()
const info = historyState.info || {}

const data = reactive({
  userId: "",
  userEmail: "",
  userName: "",
  birthDate: "",
  comment: "",
  isDeleted: false,
  revisionNo: 0,

  showError: false,
})

const userEmail = ref()
const userName = ref()
const birthDate = ref()
const comment = ref()
const isDeleted = ref()

onMounted(async () => {
  if (info.mode !== "register") {
    const res = await fetchURL("/api/v1/master/user_search/find_user", {
      method: "POST",
      body: { userId: info.userId },
    })
    if (!res) {
      throw createError({ statusCode: 404 })
    }

    data.userId = res.userId
    data.userEmail = res.userEmail
    data.userName = res.userName
    data.birthDate = res.birthDate || ""
    data.comment = res.comment || ""
    data.isDeleted = res.isDeleted
    data.revisionNo = res.revisionNo
  }
})

async function onUpdateButtonClick() {
  try {
    if (info.mode === "register") {
      const req = await validate({
        userEmail,
        userName,
        birthDate,
        comment,
      })

      await fetchURL("/api/v1/master/user_search/register_user", {
        method: "POST",
        body: req,
      })

      historyState.back({ refresh: true })
    } else if (info.mode === "update") {
      const req = await validate({
        userId: info.userId,
        userEmail,
        userName,
        birthDate,
        comment,
        revisionNo: data.revisionNo,
      })

      await fetchURL("/api/v1/master/user_search/update_user", {
        method: "POST",
        body: req,
      })

      historyState.back({ refresh: true })
    } else if (info.mode === "delete") {
      const req = await validate({
        userId: info.userId,
        revisionNo: data.revisionNo,
      })

      await fetchURL("/api/v1/master/user_search/delete_user", {
        method: "POST",
        body: req,
      })

      historyState.back({ refresh: true })
    } else {
      throw new Error(`Unknown mode: ${info.mode}`)
    }
  } catch {
    data.showError = true
  }
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
            <UILabel :required="info.mode === 'register'">メールアドレス</UILabel>
            <UITextBox
              ref="userEmail"
              v-model="data.userEmail"
              :required="info.mode === 'register'"
              :readonly="info.mode !== 'register'"
              class="w-80"
            />
          </div>
          <div>
            <UILabel required>ユーザー名</UILabel>
            <UITextBox ref="userName" v-model="data.userName" :readonly="info.mode === 'delete'" class="w-80" />
          </div>
          <div>
            <UILabel>誕生日</UILabel>
            <div class="flex flex-row items-center gap-2">
              <UIDateBox ref="birthDate" v-model="data.birthDate" :readonly="info.mode === 'delete'" class="w-32" />
            </div>
          </div>
          <div>
            <UILabel>コメント</UILabel>
            <UITextBox ref="comment" v-model="data.comment" :readonly="info.mode === 'delete'" class="w-80" />
          </div>
          <div v-if="info.mode === 'update'">
            <UICheck ref="isDeleted" v-model="data.isDeleted">削除</UICheck>
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

    <UIMessageBox v-model="data.showError" type="error">{{
      info.mode === "register" ? "登録" :
      info.mode === "delete" ? "削除" :
      "更新"
    }}に失敗しました。</UIMessageBox>

    <template #drawer>
      <MenuList />
    </template>
  </UIFrame>
</template>
