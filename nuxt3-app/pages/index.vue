<script setup lang="ts">
import { onBackupState, useHistoryState } from "vue-history-state"
import { EmailSchema, UserPasswordSchema } from "~/utils/schemas"
import { HTTPClient } from "~/utils/http"

const historyState = useHistoryState()

const data = reactive(historyState.data || {
  email: "",
  showMessage: false,
  message: "",
})

const emailRef = ref()
const passwordRef = ref()

onBackupState(() => data)

const goChangePasswordPage = () => {
  historyState.push("/change_password")
}

const onLoginButtonClick = async () => {
  let validated
  try {
    validated = await validate({
      email: emailRef,
      password: passwordRef,
    })
  } catch (err) {
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
        <div class="grid grid-cols-1 gap-y-4">
          <UITextBox
            ref="emailRef"
            type="email"
            label="メールアドレス"
            required
            :schema="EmailSchema"
          />
          <UITextBox
            ref="passwirdRef"
            type="password" label="パスワード" name="password" required :schema="UserPasswordSchema" />
          <UILink halign="end" class="text-sm" @click="goChangePasswordPage">
            パスワードを忘れた方はこちら
          </UILink>
          <UIButton halign="center" @click="onLoginButtonClick">
            ログイン
          </UIButton>
        </div>
      </UICard>
      <div class="m-4 mb-8">
        Copyright &copy; Hidekatsu Izuno
      </div>
    </div>
    <UIMessageBox v-model="data.showMessageBox">{{ data.message }}</UIMessageBox>
  </div>
</template>
