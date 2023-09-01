<script setup lang="ts">
const loading = useLoadingIndicator()
const historyState = useHistoryState()

const data = useRestorableData({
  mode: "new",
  userId: "",
  userEmail: "",
  userName: "",
  birthDate: "",
  comment: "",
  isDeleted: false,
  revisionNo: 0,

  errorMessage: "",
  showError: false,
}, ({ visited, info }) => {
  if (!visited) {
    if (info?.mode === "register") {
      return {
        mode: info.mode,
        userId: info.userId,
      }
    } else if (info?.mode === "update" || info?.mode === "delete") {
      return fetchURL("/api/v1/master/user_search/find_user", {
        method: "POST",
        body: { userId: info.userId },
      }).then(res => ({
        ...res,
        mode: info.mode,
      }))
    } else {
      throw createError({ statusCode: 400 })
    }
  }
})

const userEmail = ref()
const userName = ref()
const birthDate = ref()
const comment = ref()
const isDeleted = ref()

const alert = ref()

async function onUpdateButtonClick() {
  try {
    loading.show()

    if (data.mode === "register") {
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
    } else if (data.mode === "update") {
      const req = await validate({
        userId: data.userId,
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
    } else if (data.mode === "delete") {
      const req = await validate({
        userId: data.userId,
        revisionNo: data.revisionNo,
      })

      await fetchURL("/api/v1/master/user_search/delete_user", {
        method: "POST",
        body: req,
      })

      historyState.back({ refresh: true })
    } else {
      throw new Error(`Unknown mode: ${data.mode}`)
    }
  } catch (err) {
    loading.hide()
    if (err instanceof BusinessError) {
      alert.value.open(err.message)
    } else {
      throw err
    }
  }
}
</script>

<template>
  <UIFrame backable>
    <template #title>
      <h1 class="font-bold text-xl">ユーザーマスタ{{
        data.mode === "register" ? "登録" :
        data.mode === "delete" ? "削除" :
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
            <UILabel :required="data.mode === 'register'">メールアドレス</UILabel>
            <UITextBox
              ref="userEmail"
              v-model="data.userEmail"
              :required="data.mode === 'register'"
              :readonly="data.mode !== 'register'"
              :schema="EmailSchema"
              class="w-80"
            />
          </div>
          <div>
            <UILabel required>ユーザー名</UILabel>
            <UITextBox
              ref="userName"
              v-model="data.userName"
              :readonly="data.mode === 'delete'"
              :schema="UserNameSchema"
              class="w-80"
            />
          </div>
          <div>
            <UILabel>誕生日</UILabel>
            <div class="flex flex-row items-center gap-2">
              <UIDateBox
                ref="birthDate"
                v-model="data.birthDate"
                :readonly="data.mode === 'delete'"
                class="w-32"
              />
            </div>
          </div>
          <div>
            <UILabel>コメント</UILabel>
            <UITextBox
              ref="comment"
              v-model="data.comment"
              :readonly="data.mode === 'delete'"
              :schema="CommentSchema"
              class="w-80"
            />
          </div>
          <div v-if="data.mode === 'update'">
            <UICheck ref="isDeleted" v-model="data.isDeleted">削除</UICheck>
          </div>
        </div>
        <template #footer>
          <div class="flex flex-row items-center justify-end px-4 py-2">
            <UIButton class="w-40" @click="onUpdateButtonClick">{{
              data.mode === "register" ? "登録" :
              data.mode === "delete" ? "削除" :
              "更新"
            }}</UIButton>
          </div>
        </template>
      </UICard>
    </div>

    <UIAlert ref="alert" type="error">{{ data.errorMessage }}</UIAlert>

    <template #drawer>
      <MenuList />
    </template>
  </UIFrame>
</template>
