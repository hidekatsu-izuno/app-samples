<script setup lang="ts">
import Menu from "~/components/v1/CM0001/Menu.vue"

const data = reactive({
  textbox1: "",
  textbox2: "",
  textbox3: "",
  textbox4: "",
  textbox5: "",
  textbox6: "",
  textbox7: "",
  textbox8: "",
  textbox9: "",
  textbox10: "",
  numberbox1: "",
  numberbox2: "",
  datebox1: "",
  datebox2: "",
  textarea1: "",
  textarea2: "",
  selectbox1: "",
  selectbox2: "",
  check1: false,
  check2: false,
  checklist1: [],
  checklist2: [],
  radiolist1: "",
  radiolist2: "",
  fileupload1: undefined as File | undefined,
  fileupload2: undefined as File | undefined,
  multifileupload1: [] as File[],
  multifileupload2: [] as File[],
  page1: 1,
  page2: 1,
  button1: 0,
  button2: 0,
  showMessageBox1: false,
  showMessageBox2: false,
  showMessageBox3: false,
  showMessageBox4: false
})
</script>

<template>
  <Frame>
    <template #headerLeft>
      <h1>コンポーネント一覧</h1>
    </template>
    <template #headerRight>
      Right
    </template>
    <template #headerBottom>
      Bottom
    </template>

    <Card class="mb-4">
      <template #header>
        <h2>テキストボックス (TextBox)</h2>
      </template>
      <div class="grid grid-cols-2 gap-2">
        <TextBox v-model="data.textbox1" label="デフォルト（必須）" required />
        <div class="border">{{ data.textbox1 }}</div>

        <TextBox v-model="data.textbox2" label="デフォルト" />
        <div class="border">{{ data.textbox2 }}</div>

        <TextBox v-model="data.textbox3" label="パスワード（必須）" type="password" required />
        <div class="border">{{ data.textbox3 }}</div>

        <TextBox v-model="data.textbox4" label="パスワード" type="password" />
        <div class="border">{{ data.textbox4 }}</div>

        <TextBox v-model="data.textbox5" label="メールアドレス（必須）" type="email" required />
        <div class="border">{{ data.textbox5 }}</div>

        <TextBox v-model="data.textbox6" label="メールアドレス" type="email" />
        <div class="border">{{ data.textbox6 }}</div>

        <TextBox v-model="data.textbox7" label="電話番号（必須）" type="tel" required />
        <div class="border">{{ data.textbox7 }}</div>

        <TextBox v-model="data.textbox8" label="電話番号" type="tel" />
        <div class="border">{{ data.textbox8 }}</div>

        <TextBox v-model="data.textbox9" label="URL（必須）" type="url" required />
        <div class="border">{{ data.textbox9 }}</div>

        <TextBox v-model="data.textbox10" label="URL" type="url" />
        <div class="border">{{ data.textbox10 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>数値ボックス (NumberBox)</h2>

      <div class="grid grid-cols-2 gap-2">
        <NumberBox v-model="data.textbox1" label="デフォルト（必須）" required />
        <div class="border">{{ data.numberbox1 }}</div>

        <NumberBox v-model="data.textbox2" label="デフォルト" />
        <div class="border">{{ data.numberbox2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>日付ボックス (DateBox)</h2>

      <div class="grid grid-cols-2 gap-2">
        <DateBox v-model="data.datebox1" label="デフォルト（必須）" required />
        <div class="border">{{ data.datebox1 }}</div>

        <DateBox v-model="data.datebox2" label="デフォルト" />
        <div class="border">{{ data.datebox2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>テキストエリア (TextArea)</h2>

      <div class="grid grid-cols-2 gap-2">
        <TextArea v-model="data.textarea1" label="デフォルト（必須）" required />
        <div class="border">{{ data.textarea1 }}</div>

        <TextArea v-model="data.textarea2" label="デフォルト" />
        <div class="border">{{ data.textarea2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>セレクトボックス (SelectBox)</h2>

      <div class="grid grid-cols-2 gap-2">
        <SelectBox v-model="data.selectbox1" label="デフォルト（必須）" required :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" placeholder="---" />
        <div class="border">{{ data.selectbox1 }}</div>

        <SelectBox v-model="data.selectbox2" label="デフォルト" :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" placeholder="---" />
        <div class="border">{{ data.selectbox2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>チェックボックス (Check)</h2>

      <div class="grid grid-cols-2 gap-2">
        <Check v-model="data.check1" label="デフォルト（必須）" required>チェックボックス</Check>
        <div class="border">{{ data.check1 }}</div>

        <Check v-model="data.check2" label="デフォルト">チェックボックス</Check>
        <div class="border">{{ data.check2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>チェックリスト (CheckList)</h2>

      <div class="grid grid-cols-2 gap-2">
        <CheckList v-model="data.checklist1" label="デフォルト（必須）" required :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" />
        <div class="border">{{ data.checklist1 }}</div>

        <CheckList v-model="data.checklist2" label="デフォルト" :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" />
        <div class="border">{{ data.checklist2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>ラジオリスト (RadioList)</h2>

      <div class="grid grid-cols-2 gap-2">
        <RadioList v-model="data.radiolist1" label="デフォルト（必須）" required :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" />
        <div class="border">{{ data.radiolist1 }}</div>

        <RadioList v-model="data.radiolist2" label="デフォルト" :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" />
        <div class="border">{{ data.radiolist2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>ファイル選択 (FileUpload)</h2>

      <div class="grid grid-cols-2 gap-2">
        <FileUpload v-model="data.fileupload1" label="デフォルト（必須）" required />
        <div class="border">{{ data.fileupload1?.name }}</div>

        <FileUpload v-model="data.fileupload2" label="デフォルト" />
        <div class="border">{{ data.fileupload2?.name }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>複数ファイル選択 (MultiFileUpload)</h2>

      <div class="grid grid-cols-2 gap-2">
        <MultiFileUpload v-model="data.multifileupload1" label="デフォルト（必須）" required />
        <div class="border">{{ data.multifileupload1.map(item => item.name) }}</div>

        <MultiFileUpload v-model="data.multifileupload2" label="デフォルト" />
        <div class="border">{{ data.multifileupload2.map(item => item.name) }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>ページング (Paginator)</h2>

      <div class="grid grid-cols-2 gap-2">
        <Paginator v-model="data.page1" />
        <div class="border">{{ data.page1 }}</div>

        <Paginator v-model="data.page2" :totalCount="1000" />
        <div class="border">{{ data.page2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>ボタン (Button)</h2>

      <div class="grid grid-cols-2 gap-2">
        <Button label="デフォルト" @click="data.button1++">ボタン</Button>
        <div class="border">{{ data.button1 }}</div>

        <Button label="アウトライン" type="outline" @click="data.button2++">ボタン</Button>
        <div class="border">{{ data.button2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <h2>リンク (LinkButton)</h2>

      <div class="grid grid-cols-2 gap-2">
        <LinkButton label="デフォルト">リンク</LinkButton>
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

    <MessageBox v-model="data.showMessageBox1" type="ok">あ</MessageBox>
    <MessageBox v-model="data.showMessageBox2" type="ok-cancel">い</MessageBox>
    <MessageBox v-model="data.showMessageBox3" type="yes-no">う</MessageBox>
    <MessageBox v-model="data.showMessageBox4" type="yes-no-cancel">え</MessageBox>

    <template #footer>
      Footer
    </template>
    <template #drawer>
      <Menu />
    </template>
  </Frame>
</template>
