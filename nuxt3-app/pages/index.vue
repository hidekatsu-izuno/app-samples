<script setup lang="ts">
import { onBackupState, useHistoryState } from "vue-history-state"
import { Validator } from "~/utils/validator"
import { EmailSchema, UserPasswordSchema } from "~/utils/schemas"
import { HTTPClient } from "~/utils/http"

const historyState = useHistoryState()
const validator = new Validator()

const data = reactive(historyState.data || {
  email: "",
  showMessage: false,
  message: "",
})

onBackupState(() => data)

const goChangePasswordPage = () => {
  historyState.push("/change_password")
}

const onLoginButtonClick = async () => {
  const validated = validator.validate()
  if (!validated) {
    data.message = "入力に誤りがあります。"
    data.showMessageBox = true
    return
  }

  try {
    const result = await HTTPClient.post("/api/auth/signin", validated)
    location.href = result.redirect
  } catch (err) {
    data.message = "ログインに失敗しました。"
    data.showMessageBox = true
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 items-center justify-center">
    <div class="w-full max-w-md flex flex-col items-center">
      <h1 class="font-bold text-4xl m-4">
        Nuxt3 Sample App
      </h1>
      <UICard>
        <UIForm class="grid grid-cols-1 gap-y-4" :validator="validator">
          <div>
            <UITextBox
              v-model="data.email"
              type="email"
              label="メールアドレス"
              name="email"
              required
              :schema="EmailSchema"
            />
          </div>
          <div>
            <UITextBox type="password" label="パスワード" name="password" required :schema="UserPasswordSchema" />
          </div>
          <div>
            <UILink halign="end" class="text-sm" @click="goChangePasswordPage">
              パスワードを忘れた方はこちら
            </UILink>
          </div>
          <div>
            <UIButton halign="center" @click="onLoginButtonClick">
              ログイン
            </UIButton>
          </div>
        </UIForm>
      </UICard>
      <div class="m-4 mb-8">
        Copyright &copy; Hidekatsu Izuno
      </div>
    </div>
    <MessageBox v-model="data.showMessageBox" :message="data.message" />
  </div>
</template>
