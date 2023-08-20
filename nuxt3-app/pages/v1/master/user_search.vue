<script setup lang="ts">
import MenuList from "~/components/v1/common/MenuList.vue"

const dataTable = ref([
  { boolean: false, number: 1, string: "aaa", date: "2020-01-01" },
  { boolean: false, number: 2, string: "bbb", date: "2020-02-01" },
  { boolean: false, number: 3, string: "ccc", date: "2020-03-01" },
  { boolean: false, number: 4, string: "ddd", date: "2020-04-01" },
  { boolean: false, number: 5, string: "eee", date: "2020-05-01" },
  { boolean: false, number: 6, string: "fff", date: "2020-06-01" },
  { boolean: false, number: 7, string: "long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-", date: "2020-06-01" },
])
</script>

<template>
  <UIFrame>
    <template #title>
      <h1 class="font-bold text-xl">ユーザーマスタ検索</h1>
    </template>

    <div class="grid gap-4">
      <UICard>
        <div>head</div>
      </UICard>

      <UICard>
        <UIDataTable
          v-model="dataTable"
          :items="[
            { key: 'string', label: '文字列', width: '400px' },
            { key: 'date', label: '日付', halign: 'center' },
            { key: 'number', label: '数値', halign: 'end', width: '300px' },
          ]"
          :footer="onFooter"
        >
          <template #contentCell="{ item, value }">
            <template v-if="item.key === 'date'">{{
              formatDate(value, 'uuuu/MM/dd')
            }}</template>
          </template>
        </UIDataTable>
      </UICard>
    </div>

    <template #drawer>
      <MenuList />
    </template>
  </UIFrame>
</template>
