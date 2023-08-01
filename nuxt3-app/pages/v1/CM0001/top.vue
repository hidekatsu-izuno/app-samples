<script setup lang="ts">
import Menu from "~/components/v1/CM0001/Menu.vue"

const data = reactive({
  showMessageBox1: false,
  showMessageBox2: false,
  showMessageBox3: false,
  showMessageBox4: false,
})
</script>

<template>
<Frame>
<template v-slot:headerLeft><h1 class="text-lg">コンポーネント一覧</h1></template>
<template v-slot:headerRight>Right</template>
<template v-slot:headerBottom>Bottom</template>

<Card class="mb-4">
<template v-slot:header>
  <h2>テキストボックス (TextBox)</h2>
</template>
<div class="grid grid-cols-2 gap-2">
  <TextBox label="デフォルト（必須）" required />
  <TextBox label="デフォルト" />

  <TextBox label="パスワード（必須）" type="password" required />
  <TextBox label="パスワード" type="password" />

  <TextBox label="メールアドレス（必須）" type="email" required />
  <TextBox label="メールアドレス" type="email" />

  <TextBox label="電話番号（必須）" type="tel" required />
  <TextBox label="電話番号" type="tel" />

  <TextBox label="URL（必須）" type="url" required />
  <TextBox label="URL" type="url" />
</div>
</Card>

<Card class="mb-4">
<h2>数値ボックス (NumberBox)</h2>

<div class="grid grid-cols-2 gap-2">
  <NumberBox label="デフォルト（必須）" required />
  <NumberBox label="デフォルト" />
</div>
</Card>

<Card class="mb-4">
<h2>日付ボックス (DateBox)</h2>

<div class="grid grid-cols-2 gap-2">
  <DateBox label="デフォルト（必須）" required />
  <DateBox label="デフォルト" />
</div>
</Card>

<Card class="mb-4">
<h2>テキストエリア (TextArea)</h2>

<div class="grid grid-cols-2 gap-2">
  <TextArea label="デフォルト（必須）" required />
  <TextArea label="デフォルト" />
</div>
</Card>

<Card class="mb-4">
<h2>セレクトボックス (SelectBox)</h2>

<div class="grid grid-cols-2 gap-2">
  <SelectBox label="デフォルト（必須）" required :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" placeholder="---" />
  <SelectBox label="デフォルト" :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" placeholder="---" />
</div>
</Card>

<Card class="mb-4">
<h2>チェックボックス (Check)</h2>

<div class="grid grid-cols-2 gap-2">
  <Check label="デフォルト（必須）" required>チェックボックス</Check>
  <Check label="デフォルト">チェックボックス</Check>
</div>
</Card>

<Card class="mb-4">
<h2>チェックリスト (CheckList)</h2>

<div class="grid grid-cols-2 gap-2">
  <CheckList label="デフォルト（必須）" required :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" />
  <CheckList label="デフォルト" :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" />
</div>
</Card>

<Card class="mb-4">
<h2>ラジオリスト (RadioList)</h2>

<div class="grid grid-cols-2 gap-2">
  <RadioList label="デフォルト（必須）" required :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" />
  <RadioList label="デフォルト" :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" />
</div>
</Card>

<Card class="mb-4">
<h2>ファイル選択 (FileUpload)</h2>

<div class="grid grid-cols-2 gap-2">
  <FileUpload label="デフォルト（必須）" required />
  <FileUpload label="デフォルト" />
</div>
</Card>

<Card class="mb-4">
<h2>複数ファイル選択 (MultiFileUpload)</h2>

<div class="grid grid-cols-2 gap-2">
  <MultiFileUpload label="デフォルト（必須）" required />
  <MultiFileUpload label="デフォルト" />
</div>
</Card>

<Card class="mb-4">
<h2>ボタン (Button)</h2>

<div class="grid grid-cols-2 gap-2">
  <Button label="デフォルト">ボタン</Button>
  <Button label="アウトライン" type="outline">ボタン</Button>
</div>
</Card>

<Card class="mb-4">
<h2>リンク (Button)</h2>

<div class="grid grid-cols-2 gap-2">
  <LinkButton label="デフォルト">リンク</LinkButton>
</div>
</Card>

<Card class="mb-4">
<h2>ページング (Paginator)</h2>

<div class="grid grid-cols-2 gap-2">
  <Paginator />
  <Paginator :maxSize="1000" />
</div>
</Card>

<Card class="mb-4">
<h2>メッセージボックス</h2>
<div class="grid grid-cols-4 gap-2">
  <Button @click="data.showMessageBox1 = true">OK</Button>
  <Button @click="data.showMessageBox2 = true">OK/CANCEL</Button>
  <Button @click="data.showMessageBox3 = true">YES/NO</Button>
  <Button @click="data.showMessageBox4 = true">YES/NO/CANCEL</Button>
</div>
</Card>

<template v-slot:footer>Footer</template>
<template v-slot:drawer><Menu /></template>
</Frame>
<MessageBox type="ok" v-model="data.showMessageBox1">あ</MessageBox>
<MessageBox type="ok-cancel" v-model="data.showMessageBox2">い</MessageBox>
<MessageBox type="yes-no" v-model="data.showMessageBox3">う</MessageBox>
<MessageBox type="yes-no-cancel" v-model="data.showMessageBox4">え</MessageBox>
</template>
