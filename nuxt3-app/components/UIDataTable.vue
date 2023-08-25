<script setup lang="ts">
const props = withDefaults(defineProps<{
  columns?: number,
  wrap?: boolean,
  ellipsis?: boolean,
  tabindex?: number,
  fix?: { top?: number, bottom?: number, left?: number, right?: number },
  items?: Array<{
    key: string,
    width?: string,
    label?: string,
    halign?: "start" | "center" | "end",
    syncSelector?: boolean,
    format?: (value: any) => string
  }>,
  modelValue?: Array<Record<string, any>>,
  footer?: (modelValue: Array<Record<string, any>>, items: Record<string, any>) => Record<string, any>,
}>(), {
  wrap: false,
  ellipsis: false,
  items: () => [],
  modelValue: () => [],
})

const data = reactive({
  focused: false,
  widths: [] as (string | undefined)[],
  footerRecord: undefined as Record<string, any> | undefined,
  colResize: false,
  rowGroups: [] as ({ area: string, start: number, records?: Record<string, any>[] })[],
})

const elRef = ref()

watch(() => [props.modelValue, props.items, props.fix], () => {
  data.widths = props.items.map(item => item.width)
  data.footerRecord = props.footer?.(props.modelValue, props.items)

  const top = (props.fix?.top != null && props.fix.top > 0)
    ? props.fix.top
    : 0
  const bottom = (props.fix?.bottom != null && props.fix.bottom > 0)
    ? Math.min(props.fix.bottom, props.modelValue.length - top)
    : 0
  data.rowGroups = [
    {
      area: "top",
      start: 0,
      records: top > 0 ? props.modelValue.slice(0, top) : undefined,
    },
    {
      area: "center",
      start: top,
      records: props.modelValue.slice(top, props.modelValue.length - bottom),
    },
    {
      area: "bottom",
      start: props.modelValue.length - bottom,
      records: bottom > 0 ? props.modelValue.slice(props.modelValue.length - bottom, props.modelValue.length) : undefined,
    },
  ]
}, { immediate: true })

function onContentCellMouseEnter(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.scrollWidth > target.offsetWidth) {
    target.setAttribute("title", target.innerText)
  }
}

function onContentCellMouseLeave(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.hasAttribute("title")) {
    target.removeAttribute("title")
  }
}

function onSeparatorMouseDown(event: MouseEvent) {
  const target = event.target as HTMLElement
  const parent = target.closest(".UIDataTable")
  const prev = target.previousElementSibling as HTMLElement | null
  if (!parent || !prev) {
    return
  }

  const col = Number.parseInt(prev?.dataset.col || "", 10)
  if (!Number.isInteger(col)) {
    return
  }

  data.colResize = true

  const width = prev.offsetWidth
  const startX = event.pageX

  const move = (event: MouseEvent) => {
    data.widths[col] = `${width + (event.pageX - startX)}px`
  }

  const finish = (event: MouseEvent) => {
    move(event)
    data.colResize = false

    elRef.value.removeEventListener("mousemove", move)
    elRef.value.removeEventListener("mouseup", finish)
    elRef.value.removeEventListener("mouseleave", finish)
  }

  elRef.value.addEventListener("mousemove", move)
  elRef.value.addEventListener("mouseup", finish)
  elRef.value.addEventListener("mouseleave", finish)
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
    <div
      v-for="(rowGroup, index) in data.rowGroups"
      :key="index"
      class="UIDataTable-ViewArea"
      :data-viewarea="rowGroup.area"
    >
      <div
        v-if="rowGroup.area === 'top'"
        class="UIDataTable-Header"
      >
        <div class="UIDataTable-HeaderRow">
          <template v-for="(item, colIndex) in items" :key="colIndex">
            <div
              class="UIDataTable-HeaderCell"
              :data-col="colIndex"
              :data-key="item.key"
              data-halign="center"
              :data-width="data.widths[colIndex] == null && props.wrap ? 'fill' : undefined"
              :style="{
                width: data.widths[colIndex] ?? '100px',
              }"
              @mouseenter="(event) => props.ellipsis && onContentCellMouseEnter(event)"
              @mouseleave="(event) => props.ellipsis && onContentCellMouseLeave(event)"
            ><slot
              name="headerCell"
              :item="item"
              :value="item.label || item.key"
            ><div class="UIDataTable-CellValue">{{
              item.label ?? item.key
            }}</div></slot></div>
            <div
              class="UIDataTable-HeaderSeparator"
              @mousedown="(event) => !props.wrap && onSeparatorMouseDown(event)"
            />
          </template>
        </div>
      </div>
      <div class="UIDataTable-Content">
        <div
          v-for="(record, rowIndex) in rowGroup.records"
          :key="rowGroup.start + rowIndex"
          class="UIDataTable-ContentRow"
        >
          <template v-for="(item, colIndex) in items" :key="((colIndex << 16) & (rowGroup.start + rowIndex))">
            <div
              class="UIDataTable-ContentCell"
              :data-col="colIndex"
              :data-row="rowGroup.start + rowIndex"
              :data-key="item.key"
              :data-syncselector="item.syncSelector || undefined"
              :data-halign="item.halign"
              :data-width="data.widths[colIndex] == null && props.wrap ? 'fill' : undefined"
              :style="{
                width: data.widths[colIndex] ?? '100px',
              }"
              @mouseenter="(event) => props.ellipsis && onContentCellMouseEnter(event)"
              @mouseleave="(event) => props.ellipsis && onContentCellMouseLeave(event)"
            ><slot
              name="contentCell"
              :record="record"
              :row-index="rowGroup.start + rowIndex"
              :col-index="colIndex"
              :item="item"
              :value="item.format ? item.format(record?.[item.key]) : record?.[item.key]"
            ><div class="UIDataTable-CellValue">{{
              item.format ? item.format(record?.[item.key]) : record?.[item.key]
            }}</div></slot></div>
            <div
              class="UIDataTable-ContentSeparator"
              @mousedown="(event) => !props.wrap && onSeparatorMouseDown(event)"
            />
          </template>
        </div>
      </div>
      <div
        v-if="rowGroup.area === 'bottom' && data.footerRecord"
        class="UIDataTable-Footer"
      >
        <div class="UIDataTable-FooterRow">
          <template v-for="(item, colIndex) in items" :key="colIndex">
            <div
              class="UIDataTable-FooterCell"
              :data-col="colIndex"
              :data-key="item.key"
              :data-halign="item.halign"
              :data-width="data.widths[colIndex] == null && props.wrap ? 'fill' : undefined"
              :style="{
                width: data.widths[colIndex] ?? '100px',
              }"
              @mouseenter="(event) => props.ellipsis && onContentCellMouseEnter(event)"
              @mouseleave="(event) => props.ellipsis && onContentCellMouseLeave(event)"
            ><slot
              name="footerCell"
              :record="data.footerRecord"
              :item="item"
              :value="item.format ? item.format(data.footerRecord[item.key]) : data.footerRecord[item.key]"
            ><div class="UIDataTable-CellValue">{{
              item.format ? item.format(data.footerRecord?.[item.key]) : data.footerRecord?.[item.key]
            }}</div></slot></div>
            <div
              class="UIDataTable-FooterSeparator"
              @mousedown="(event) => !props.wrap && onSeparatorMouseDown(event)"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.UIDataTable {
  @apply flex flex-col
    overflow-auto;
}

.UIDataTable-Header,
.UIDataTable-Content,
.UIDataTable-Footer {
  @apply min-w-fit;
}

.UIDataTable-ViewArea[data-viewarea="top"] {
  @apply sticky top-0 left-0 right-0
    z-[2];
}

.UIDataTable-ViewArea[data-viewarea="center"],
.UIDataTable-Content {
  @apply grow
}

.UIDataTable-ViewArea[data-viewarea="bottom"] {
  @apply sticky bottom-0 left-0 right-0
    border-t border-gray-300
    -mt-[1px]
    z-[2];
}

.UIDataTable-Footer {
  @apply -mt-[1px];
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
  @apply border-b border-gray-300
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
    flex flex-row items-center
    overflow-hidden;
}

.UIDataTable-CellValue {
  @apply px-[0.25em] py-[0.125em]
    min-h-[calc(1rem+0.125em*2)]
    whitespace-pre-wrap
    break-words;
}

.UIDataTable-HeaderSeparator,
.UIDataTable-ContentSeparator,
.UIDataTable-FooterSeparator {
  @apply flex-[0_0_5px]
    mx-[-2px]
    px-[2px]
    bg-slate-300
    bg-clip-content
    cursor-col-resize select-none
    z-[1];
}

.UIDataTable[data-colresize="true"] {
  @apply cursor-col-resize;
}

.UIDataTable-ContentRow:has([data-syncselector="true"] input:checked) {
  @apply bg-blue-100;
}

.UIDataTable-HeaderCell[data-width="fill"],
.UIDataTable-ContentCell[data-width="fill"],
.UIDataTable-FooterCell[data-width="fill"] {
  @apply flex-1;
}

.UIDataTable-HeaderCell[data-halign="start"],
.UIDataTable-ContentCell[data-halign="start"],
.UIDataTable-FooterCell[data-halign="start"] {
  @apply justify-start;
}

.UIDataTable-HeaderCell[data-halign="center"],
.UIDataTable-ContentCell[data-halign="center"],
.UIDataTable-FooterCell[data-halign="center"] {
  @apply justify-center;
}

.UIDataTable-HeaderCell[data-halign="end"],
.UIDataTable-ContentCell[data-halign="end"],
.UIDataTable-FooterCell[data-halign="end"] {
  @apply justify-end;
}

.UIDataTable[data-wrap="true"] {
  @apply overflow-x-hidden;

  .UIDataTable-HeaderRow,
  .UIDataTable-ContentRow,
  .UIDataTable-FooterRow {
    @apply flex-wrap
      mr-[-2px]
      pr-0;
  }

  .UIDataTable-HeaderRow,
  .UIDataTable-ContentRow {
    @apply border-b-0
      mb-[-1px];
  }

  .UIDataTable-FooterRow {
    @apply border-t-0;
  }

  .UIDataTable-HeaderCell,
  .UIDataTable-ContentCell,
  .UIDataTable-FooterCell {
    @apply flex-auto;
  }

  .UIDataTable-HeaderCell,
  .UIDataTable-ContentCell {
    @apply border-b border-slate-300;
  }

  .UIDataTable-FooterCell {
    @apply border-t border-slate-300;
  }

  .UIDataTable-HeaderSeparator,
  .UIDataTable-ContentSeparator,
  .UIDataTable-FooterSeparator {
    @apply cursor-default;
  }
}

.UIDataTable[data-ellipsis="true"] {
  .UIDataTable-CellValue {
    @apply break-normal truncate;
  }
}
</style>
