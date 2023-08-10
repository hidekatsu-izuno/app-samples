<script setup lang="ts">
const props = withDefaults(defineProps<{
  columns?: number,
  wrap?: boolean
  tabindex?: number,
  items?: Array<{
    key: string,
    label?: string,
    halign?: "start" | "center" | "end",
    width?: string,
  }>,
  modelValue?: Array<Record<string, any>>,
  footer?: (modelValue:  Array<Record<string, any>>, items: Record<string, any>) => Record<string, any>,
}>(), {
  wrap: false,
  items: () => [],
  modelValue: () => [],
})

const data = reactive({
  focused: false,
  value: [] as Record<string, any>[],
  widthes: [] as string[],
  footerValues: undefined as Record<string, any> | undefined,
})

watch(() => props.modelValue, () => {
  data.value = props.modelValue
  data.footerValues = props.footer?.(props.modelValue, props.items)
}, { immediate: true })

watch(() => props.items, () => {
  data.footerValues = props.footer?.(props.modelValue, props.items)
}, { immediate: true })

function onMouseEnter(event: MouseEvent) {
  if (props.wrap) {
    return
  }

  const target = event.target as HTMLElement
  if (target.scrollWidth > target.offsetWidth) {
    target.setAttribute("title", target.innerText)
  }
}

function onMouseLeave(event: MouseEvent) {
  if (props.wrap) {
    return
  }

  const target = event.target as HTMLElement
  if (target.hasAttribute("title")) {
    target.removeAttribute("title")
  }
}
</script>

<template>
  <div
    class="UIDataTable"
    :data-columns="props.items.length"
    :data-wrap="props.wrap || undefined"
  >
    <div class="UIDataTable-Header">
      <div class="UIDataTable-HeaderRow">
        <template v-for="(item, colIndex) in items" :key="colIndex">
          <div
            v-if="colIndex > 0"
            class="UIDataTable-HeaderSeparator"
          ></div>
          <div
            class="UIDataTable-HeaderCell"
            :data-halign="item.halign"
            :style="{ width: item.width }"
          ><slot
              name="footerCell"
              :item="item"
              :value="item.label || item.key"
          >{{ item.label || item.key }}</slot></div>
        </template>
      </div>
    </div>
    <div class="UIDataTable-Content">
      <div
        class="UIDataTable-ContentRow"
        v-for="(rowValues, rowIndex) in data.value"
        :key="rowIndex"
      >
        <template v-for="(item, colIndex) in items" :key="colIndex">
          <div
            v-if="colIndex > 0"
            class="UIDataTable-ContentSeparator"
          ></div>
          <div
            class="UIDataTable-ContentCell"
            :data-halign="item.halign"
            :style="{ width: item.width }"
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave"

          ><slot
            name="contentCell"
            :rowValues="rowValues"
            :rowIndex="rowIndex"
            :colIndex="colIndex"
            :item="item"
            :value="rowValues?.[item.key]"
          >{{ rowValues?.[item.key] }}</slot></div>
        </template>
      </div>
    </div>
    <div class="UIDataTable-Footer" v-if="data.footerValues">
      <div class="UIDataTable-FooterRow">
        <template v-for="(item, colIndex) in items" :key="colIndex">
          <div
            v-if="colIndex > 0"
            class="UIDataTable-FooterSeparator"
          ></div>
          <div
            class="UIDataTable-FooterCell"
            :data-halign="item.halign"
            :style="{ width: item.width }"
          ><slot
              name="footerCell"
              :rowValues="data.footerValues"
              :item="item"
              :value="data.footerValues[item.key]"
          >{{ data.footerValues[item.key] }}</slot></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.UIDataTable {
  @apply overflow-auto;
}

.UIDataTable-HeaderRow,
.UIDataTable-ContentRow,
.UIDataTable-FooterRow {
  @apply flex flex-row items-stretch
    border-b border-gray-300;
}

.UIDataTable-HeaderRow {
  @apply bg-slate-50
    font-bold;
}

.UIDataTable-ContentRow {
  @apply bg-white;
}

.UIDataTable-FooterRow {
  @apply bg-slate-50;
}

.UIDataTable-HeaderCell,
.UIDataTable-ContentCell,
.UIDataTable-FooterCell {
  @apply flex-auto
    align-middle
    overflow-hidden
    px-2 py-1
    whitespace-pre-wrap;
  min-height: 1rem;
}

.UIDataTable-HeaderSeparator,
.UIDataTable-ContentSeparator,
.UIDataTable-FooterSeparator {
  @apply w-[1px]
    cursor-col-resize;
}

.UIDataTable-HeaderSeparator {
  @apply bg-slate-300;
}

.UIDataTable-ContentSeparator,
.UIDataTable-FooterSeparator {
  @apply bg-slate-100;
}

.UIDataTable-HeaderCell[data-halign="center"],
.UIDataTable-ContentCell[data-halign="center"],
.UIDataTable-FooterCell[data-halign="center"] {
  @apply text-center;
}

.UIDataTable-HeaderCell[data-halign="end"],
.UIDataTable-ContentCell[data-halign="end"],
.UIDataTable-FooterCell[data-halign="end"] {
  @apply text-right;
}

.UIDataTable:not([data-wrap="true"]) {
  .UIDataTable-HeaderCell,
  .UIDataTable-ContentCell,
  .UIDataTable-FooterCell {
    @apply truncate;
  }
}
</style>
