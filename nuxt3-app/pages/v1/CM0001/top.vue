<script setup lang="ts">
import Menu from "~/components/v1/CM0001/Menu.vue"

const data = reactive({
  textboxRequired: false,
  textboxDisabled: false,
  textboxReadonly: false,
  textbox1: "",
  textbox2: "",
  textbox3: "",
  textbox4: "",
  textbox5: "",
  numberboxRequired: false,
  numberboxDisabled: false,
  numberboxReadonly: false,
  numberbox1: "",
  numberbox2: "",
  dateboxRequired: false,
  dateboxDisabled: false,
  dateboxReadonly: false,
  datebox1: "",
  datebox2: "",
  textareaRequired: false,
  textareaDisabled: false,
  textareaReadonly: false,
  textarea1: "",
  textarea2: "",
  selectboxRequired: false,
  selectboxDisabled: false,
  selectboxReadonly: false,
  selectbox1: "",
  selectbox2: "",
  checkRequired: false,
  checkDisabled: false,
  checkReadonly: false,
  check1: false,
  check2: false,
  checklistRequired: false,
  checklistDisabled: false,
  checklistReadonly: false,
  checklist1: [],
  checklist2: [],
  radiolistRequired: false,
  radiolistDisabled: false,
  radiolistReadonly: false,
  radiolist1: "",
  radiolist2: "",
  fileuploadRequired: false,
  fileuploadDisabled: false,
  fileuploadReadonly: false,
  fileupload1: undefined as File | undefined,
  fileupload2: undefined as File | undefined,
  multifileuploadRequired: false,
  multifileuploadDisabled: false,
  multifileuploadReadonly: false,
  multifileupload1: [] as File[],
  multifileupload2: [] as File[],
  paginatorDisabled: false,
  paginator1: 1,
  paginator2: 1,
  buttonDisabled: false,
  button1: 0,
  button2: 0,
  linkDisabled: false,
  link1: 0,
  link2: 0,
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
        <div class="flex flex-row gap-1">
          <h2 class="grow">テキストボックス (TextBox)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.textboxRequired" /> required</div>
          <div class="shrink"><input type="checkbox" v-model="data.textboxDisabled" /> disabled</div>
          <div class="shrink"><input type="checkbox" v-model="data.textboxReadonly" /> readonly</div>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-2">
        <TextBox v-model="data.textbox1" label="デフォルト" :required="data.textboxRequired" :disabled="data.textboxDisabled" :readonly="data.textboxReadonly" />
        <div class="border">{{ data.textbox1 }}</div>

        <TextBox v-model="data.textbox2" label="パスワード" type="password" :required="data.textboxRequired" :disabled="data.textboxDisabled" :readonly="data.textboxReadonly" />
        <div class="border">{{ data.textbox2 }}</div>

        <TextBox v-model="data.textbox3" label="メールアドレス" type="email" :required="data.textboxRequired" :disabled="data.textboxDisabled" :readonly="data.textboxReadonly" />
        <div class="border">{{ data.textbox3 }}</div>

        <TextBox v-model="data.textbox4" label="電話番号" type="tel" :required="data.textboxRequired" :disabled="data.textboxDisabled" :readonly="data.textboxReadonly" />
        <div class="border">{{ data.textbox4 }}</div>

        <TextBox v-model="data.textbox5" label="URL" type="url" :required="data.textboxRequired" :disabled="data.textboxDisabled" :readonly="data.textboxReadonly" />
        <div class="border">{{ data.textbox5 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">数値ボックス (NumberBox)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.numberboxRequired" /> required</div>
          <div class="shrink"><input type="checkbox" v-model="data.numberboxDisabled" /> disabled</div>
          <div class="shrink"><input type="checkbox" v-model="data.numberboxReadonly" /> readonly</div>

        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <NumberBox v-model="data.numberbox1" label="デフォルト" :required="data.numberboxRequired" :disabled="data.numberboxDisabled" :readonly="data.numberboxReadonly" />
        <div class="border">{{ data.numberbox1 }}</div>

        <NumberBox v-model="data.numberbox2" label="小数点あり" format="###,##0.0#" :required="data.numberboxRequired" :disabled="data.numberboxDisabled" :readonly="data.numberboxReadonly" />
        <div class="border">{{ data.numberbox2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">日付ボックス (DateBox)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.dateboxRequired" /> required</div>
          <div class="shrink"><input type="checkbox" v-model="data.dateboxDisabled" /> disabled</div>
          <div class="shrink"><input type="checkbox" v-model="data.dateboxReadonly" /> readonly</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <DateBox v-model="data.datebox1" label="デフォルト" :required="data.dateboxRequired" :disabled="data.dateboxDisabled" :readonly="data.dateboxReadonly" />
        <div class="border">{{ data.datebox1 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">テキストエリア (TextArea)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.textareaRequired" /> required</div>
          <div class="shrink"><input type="checkbox" v-model="data.textareaDisabled" /> disabled</div>
          <div class="shrink"><input type="checkbox" v-model="data.textareaReadonly" /> readonly</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <TextArea v-model="data.textarea1" label="デフォルト" :required="data.textareaRequired" :disabled="data.textareaDisabled" :readonly="data.textareaReadonly" />
        <div class="border">{{ data.textarea1 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">セレクトボックス (SelectBox)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.selectboxRequired" /> required</div>
          <div class="shrink"><input type="checkbox" v-model="data.selectboxDisabled" /> disabled</div>
          <div class="shrink"><input type="checkbox" v-model="data.selectboxReadonly" /> readonly</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <SelectBox v-model="data.selectbox1" label="デフォルト" :required="data.selectboxRequired" :disabled="data.selectboxDisabled" :readonly="data.selectboxReadonly"
          :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" placeholder="---" />
        <div class="border">{{ data.selectbox1 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">チェックボックス (Check)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.checkRequired" /> required</div>
          <div class="shrink"><input type="checkbox" v-model="data.checkDisabled" /> disabled</div>
          <div class="shrink"><input type="checkbox" v-model="data.checkReadonly" /> readonly</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <Check v-model="data.check1" label="デフォルト" :required="data.checkRequired" :disabled="data.checkDisabled" :readonly="data.checkReadonly">チェックボックス</Check>
        <div class="border">{{ data.check1 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">チェックリスト (CheckList)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.checklistRequired" /> required</div>
          <div class="shrink"><input type="checkbox" v-model="data.checklistDisabled" /> disabled</div>
          <div class="shrink"><input type="checkbox" v-model="data.checklistReadonly" /> readonly</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <CheckList v-model="data.checklist1" label="デフォルト" :required="data.checklistRequired" :disabled="data.checklistDisabled" :readonly="data.checklistReadonly"
          :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" />
        <div class="border">{{ data.checklist1 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">ラジオリスト (RadioList)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.radiolistRequired" /> required</div>
          <div class="shrink"><input type="checkbox" v-model="data.radiolistDisabled" /> disabled</div>
          <div class="shrink"><input type="checkbox" v-model="data.radiolistReadonly" /> readonly</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <RadioList v-model="data.radiolist1" label="デフォルト" :required="data.radiolistRequired" :disabled="data.radiolistDisabled" :readonly="data.radiolistReadonly"
          :items="[{ value: '1', text: 'AAA' }, { value: '2', text: 'BBB' }]" />
        <div class="border">{{ data.radiolist1 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">ファイル選択 (FileUpload)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.fileuploadRequired" /> required</div>
          <div class="shrink"><input type="checkbox" v-model="data.fileuploadDisabled" /> disabled</div>
          <div class="shrink"><input type="checkbox" v-model="data.fileuploadReadonly" /> readonly</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <FileUpload v-model="data.fileupload1" label="デフォルト" :required="data.fileuploadRequired" :disabled="data.fileuploadDisabled" :readonly="data.fileuploadReadonly" />
        <div class="border">{{ data.fileupload1?.name }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">複数ファイル選択 (MultiFileUpload)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.multifileuploadRequired" /> required</div>
          <div class="shrink"><input type="checkbox" v-model="data.multifileuploadDisabled" /> disabled</div>
          <div class="shrink"><input type="checkbox" v-model="data.multifileuploadReadonly" /> readonly</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <MultiFileUpload v-model="data.multifileupload1" label="デフォルト"  :required="data.multifileuploadRequired" :disabled="data.multifileuploadDisabled" :readonly="data.multifileuploadReadonly" />
        <div class="border">{{ data.multifileupload1.map(item => item.name) }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">ページング (Paginator)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.paginatorDisabled" /> disabled</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <Paginator v-model="data.paginator1" :disabled="data.paginatorDisabled" />
        <div class="border">{{ data.paginator1 }}</div>

        <Paginator v-model="data.paginator2" :disabled="data.paginatorDisabled" :pageSize="50" :totalCount="1000" />
        <div class="border">{{ data.paginator2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">ボタン (Button)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.buttonDisabled" /> disabled</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <Button label="デフォルト" :disabled="data.buttonDisabled" @click="data.button1++">ボタン</Button>
        <div class="border">{{ data.button1 }}</div>

        <Button label="アウトライン" type="outline" :disabled="data.buttonDisabled" @click="data.button2++">ボタン</Button>
        <div class="border">{{ data.button2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">リンク (LinkButton)</h2>
          <div class="shrink"><input type="checkbox" v-model="data.linkDisabled" /> disabled</div>
        </div>
      </template>

      <div class="grid grid-cols-2 gap-2">
        <LinkButton label="デフォルト" :disabled="data.linkDisabled" @click="data.link1++">リンク</LinkButton>
        <div class="border">{{ data.link1 }}</div>

        <LinkButton label="デフォルト" :disabled="data.linkDisabled" @click="data.link2++">リンク</LinkButton>
        <div class="border">{{ data.link2 }}</div>
      </div>
    </Card>

    <Card class="mb-4">
      <template #header>
        <div class="flex flex-row gap-1">
          <h2 class="grow">メッセージボックス</h2>
          <div class="shrink"><input type="checkbox" v-model="data.linkDisabled" /> disabled</div>
        </div>
      </template>
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
