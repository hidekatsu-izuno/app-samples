<script setup lang="ts">
import { onBackupState, useHistoryState } from "vue-history-state"
import { EmailSchema, UserPasswordSchema } from "~/utils/schemas"

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
  try {
    const data = await validate({
      email: emailRef,
      password: passwordRef,
    })

    try {
      const result = await fetchURL("/api/auth/signin", {
        method: "POST",
        data,
      })
      location.href = result.redirect
    } catch (err) {
      data.message = "ログインに失敗しました。"
      data.showMessageBox = true
    }
  } catch (err) {
    data.message = "入力に誤りがあります。"
    data.showMessageBox = true
  }
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-50 items-center justify-center">
    <div class="w-full max-w-md">
      <h1 class="m-4 font-bold text-4xl text-center">
        Nuxt3 Sample App
      </h1>
      <UICard>
        <div class="grid grid-cols-1 gap-y-4 p-6">
          <UITextBox
            ref="emailRef"
            type="email"
            label="メールアドレス"
            required
            :schema="EmailSchema"
          />
          <UITextBox
            ref="passwordRef"
            type="password"
            label="パスワード"
            name="password"
            required
            :schema="UserPasswordSchema"
          />
          <UILink halign="end" class="text-sm" @click="goChangePasswordPage">
            パスワードを忘れた方はこちら
          </UILink>
          <UIButton halign="center" @click="onLoginButtonClick">
            ログイン
          </UIButton>
        </div>
      </UICard>
      <div class="m-4 mb-8 text-center">
        Copyright &copy; Hidekatsu Izuno
      </div>
    </div>
    <UIMessageBox v-model="data.showMessageBox">{{ data.message }}</UIMessageBox>
  </div>
</template>
