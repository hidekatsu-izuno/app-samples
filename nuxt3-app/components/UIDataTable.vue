<script setup lang="ts">
const props = withDefaults(defineProps<{
  columns?: number,
  wrap?: boolean,
  ellipsis?: boolean,
  tabindex?: number,
  items?: Array<{
    key: string,
    width?: string,
    label?: string,
    halign?: "start" | "center" | "end",
  }>,
  modelValue?: Array<Record<string, any>>,
  footer?: (modelValue:  Array<Record<string, any>>, items: Record<string, any>) => Record<string, any>,
}>(), {
  wrap: false,
  ellipsis: false,
  items: () => [],
  modelValue: () => [],
})

const data = reactive({
  focused: false,
  value: [] as Array<Record<string, any>>,
  widths: [] as Array<string>,
  footerValues: undefined as Record<string, any> | undefined,
  colResize: false,
})

const elRef = ref()

watch(() => props.modelValue, () => {
  data.value = props.modelValue
  data.footerValues = props.footer?.(props.modelValue, props.items)
}, { immediate: true })

watch(() => props.items, () => {
  data.footerValues = props.footer?.(props.modelValue, props.items)
}, { immediate: true })

function onContentCellMouseEnter(event: MouseEvent) {
  if (!props.ellipsis) {
    return
  }

  const target = event.target as HTMLElement
  if (target.scrollWidth > target.offsetWidth) {
    target.setAttribute("title", target.innerText)
  }
}

function onContentCellMouseLeave(event: MouseEvent) {
  if (!props.ellipsis) {
    return
  }

  const target = event.target as HTMLElement
  if (target.hasAttribute("title")) {
    target.removeAttribute("title")
  }
}

function onSeparatorMouseDown(event: MouseEvent) {
  data.colResize = true
  window.addEventListener("mouseup", () => {
    data.colResize = false
  }, { once: true })
}
</script>

<template>
  <div
    ref="elRef"
    class="UIDataTable"
    :data-columns="props.items.length"
    :data-wrap="props.wrap || undefined"
    :data-ellipsis="props.ellipsis || undefined"
    :data-colresize="data.colResize || undefined"
  >
    <div class="UIDataTable-Header">
      <div class="UIDataTable-HeaderRow">
        <template v-for="(item, colIndex) in items">
          <div
            class="UIDataTable-HeaderCell"
            :data-col="colIndex"
            :data-halign="item.halign"
            :data-width="item.width != null ? 'fill' : undefined"
            :style="{
              'flex-basis': item.width ?? '100px',
              width: item.width ?? '100px',
            }"
            @mouseenter="onContentCellMouseEnter"
            @mouseleave="onContentCellMouseLeave"
          ><slot
              name="footerCell"
              :item="item"
              :value="item.label || item.key"
          >{{ item.label || item.key }}</slot></div>
          <div
            class="UIDataTable-HeaderSeparator"
            @mousedown="onSeparatorMouseDown"
          ></div>
        </template>
      </div>
    </div>
    <div class="UIDataTable-Content">
      <div
        class="UIDataTable-ContentRow"
        v-for="(rowValues, rowIndex) in data.value"
      >
        <template v-for="(item, colIndex) in items">
          <div
            class="UIDataTable-ContentCell"
            :data-col="colIndex"
            :data-row="rowIndex"
            :data-halign="item.halign"
            :data-width="item.width != null ? 'fill' : undefined"
            :style="{
              'flex-basis': item.width ?? '100px',
              width: item.width ?? '100px',
            }"
            @mouseenter="onContentCellMouseEnter"
            @mouseleave="onContentCellMouseLeave"

          ><slot
            name="contentCell"
            :rowValues="rowValues"
            :rowIndex="rowIndex"
            :colIndex="colIndex"
            :item="item"
            :value="rowValues?.[item.key]"
          >{{ rowValues?.[item.key] }}</slot></div>
          <div
            class="UIDataTable-ContentSeparator"
            @mousedown="onSeparatorMouseDown"
          ></div>
        </template>
      </div>
    </div>
    <div class="UIDataTable-Footer" v-if="data.footerValues">
      <div class="UIDataTable-FooterRow">
        <template v-for="(item, colIndex) in items">
          <div
            class="UIDataTable-FooterCell"
            :data-col="colIndex"
            :data-halign="item.halign"
            :data-width="item.width != null ? 'fill' : undefined"
            :style="{
              'flex-basis': item.width ?? '100px',
              width: item.width ?? '100px',
            }"
            @mouseenter="onContentCellMouseEnter"
            @mouseleave="onContentCellMouseLeave"
          ><slot
              name="footerCell"
              :rowValues="data.footerValues"
              :item="item"
              :value="data.footerValues[item.key]"
          >{{ data.footerValues[item.key] }}</slot></div>
          <div
            class="UIDataTable-FooterSeparator"
            @mousedown="onSeparatorMouseDown"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
.UIDataTable {
  @apply overflow-auto;
}

.UIDataTable-Header,
.UIDataTable-Content,
.UIDataTable-Footer {
  @apply min-w-fit;
}

.UIDataTable-Header {
  @apply sticky top-0 left-0 right-0;
}

.UIDataTable-Footer {
  @apply sticky bottom-0 left-0 right-0;
}

.UIDataTable-HeaderRow,
.UIDataTable-ContentRow,
.UIDataTable-FooterRow {
  @apply flex flex-row items-stretch
    min-w-fit
    pr-4;
}

.UIDataTable-HeaderRow {
  @apply border-b border-gray-300
    bg-slate-50
    font-bold;
}

.UIDataTable-ContentRow {
  @apply border-b last:border-b-0 border-gray-300
    bg-white;
}

.UIDataTable-FooterRow {
  @apply border-t border-gray-300
    bg-slate-50;
}

.UIDataTable-HeaderCell,
.UIDataTable-ContentCell,
.UIDataTable-FooterCell {
  @apply flex-none
    align-middle
    px-2 py-1
    min-h-[calc(1rem+8px)]
    whitespace-pre-wrap;
}

.UIDataTable-HeaderSeparator,
.UIDataTable-ContentSeparator,
.UIDataTable-FooterSeparator {
  @apply flex-[0_0_3px]
    mx-[-1px]
    px-[1px]
    bg-clip-content
    cursor-col-resize
    select-none;
}

.UIDataTable-HeaderSeparator {
  @apply bg-slate-300;
}

.UIDataTable-ContentSeparator,
.UIDataTable-FooterSeparator {
  @apply bg-slate-100;
}

.UIDataTable[data-colresize="true"] {
  @apply cursor-col-resize;
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

.UIDataTable[data-wrap="true"] {
  .UIDataTable-HeaderRow,
  .UIDataTable-ContentRow,
  .UIDataTable-FooterRow {
    @apply flex-wrap pr-0;
  }

  .UIDataTable-HeaderCell[data-width="fill"],
  .UIDataTable-ContentCell[data-width="fill"],
  .UIDataTable-FooterCell[data-width="fill"] {
    @apply flex-1;
  }
}

.UIDataTable[data-ellipsis="true"] {
  .UIDataTable-HeaderCell,
  .UIDataTable-ContentCell,
  .UIDataTable-FooterCell {
    @apply truncate;
  }
}

.UIDataTable:not([data-ellipsis="true"]) {
  .UIDataTable-HeaderCell,
  .UIDataTable-ContentCell,
  .UIDataTable-FooterCell {
    @apply break-words;
  }
}
</style>
