<!-- components/data-table/DataTable.vue -->
<script setup lang="ts" generic="TData">
import { watch, computed } from 'vue'
import { FlexRender } from '@tanstack/vue-table'
import type { ColumnDef } from './types'
import { useDataTable } from './useDataTable'
import { createSelectColumn } from './utils'

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '#/components/ui/table'
import DataTableToolbar from './DataTableToolbar.vue'
import DataTablePagination from './DataTablePagination.vue'

type RowKey = string | number

const props = defineProps<{
  data: TData[]
  columns: ColumnDef<TData, any>[]
  rowKey?: keyof TData | ((row: TData) => RowKey)
  pageSize?: number
  useCheckbox?: boolean
  onRowClick?: (row: TData) => void
  rowClassName?: (row: TData) => string
  // faceted filters（可選）：每個欄位給一組 options（支援多選）
  facetedFilters?: Array<{
    columnId: string
    title: string
    options: Array<{ label: string; value: string; icon?: any }>
  }>
}>()

// 根據 useCheckbox prop 決定是否添加選擇欄位
const finalColumns = computed(() => {
  if (props.useCheckbox) {
    return [createSelectColumn<TData>(), ...props.columns]
  }
  return props.columns
})

const handleRowClick = (row: TData) => {
  if (!props.onRowClick) return
  props.onRowClick!(row)
}

const dt = useDataTable({
  data: props.data,
  columns: finalColumns.value,
  rowKey: props.rowKey,
  initialState: { pageSize: props.pageSize ?? 20 },
})

// 當 props 改變時，更新 table 資料
watch(() => props.data, (newRows) => {
  dt.setData(newRows)
}, { immediate: true })

watch(() => finalColumns.value, (newColumns) => {
  dt.setColumns(newColumns as any)
}, { immediate: true })

// 產生欄位 id：優先用 columnDef.id，其次 accessorKey
const getColId = (col: any): string => {
  return (col?.columnDef?.id ?? col?.columnDef?.accessorKey ?? '') as string
}

// 暴露 table 與 selection
defineExpose({
  table: dt.table,
  selectedRowIds: dt.rowSelection, // 物件：{ [rowId]: true }
  selectedRows: computed(() => dt.table.getSelectedRowModel().rows.map(row => row.original)), // 選中的原始資料
  rowSelection: dt.rowSelection, // 為了向後相容
})
</script>

<template>
  <div class="space-y-3">
    <!-- Toolbar（全域搜尋、Faceted、欄位可見性） -->
    <DataTableToolbar :table="dt.table" placeholder="搜尋關鍵字…" :faceted-filters="facetedFilters" />

    <div class="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in dt.table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" :class="[
              'select-none',
              typeof (header.column.columnDef.meta as any)?.widthClass === 'string' ? (header.column.columnDef.meta as any)?.widthClass : ''
            ]" @click="() => header.column.getCanSort() && header.column.toggleSorting()">
              <template v-if="!header.isPlaceholder">
                <!-- 具名 header 插槽：#header-<columnId> -->
                <slot :name="`header-${getColId(header.column)}`" v-bind="{ column: header.column }">
                  <!-- fallback：若無插槽，回退到 columnDef.header -->
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                </slot>
                <span v-if="header.column.getCanSort()" class="ml-1 text-xs text-muted-foreground">
                  {{ header.column.getIsSorted() === 'asc' ? '▲' : header.column.getIsSorted() ===
                    'desc' ? '▼' : '' }}
                </span>
              </template>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="dt.pageRows.value.length > 0">
            <TableRow v-for="row in dt.pageRows.value" :key="row.id"
              :data-state="row.getIsSelected() ? 'selected' : undefined" :class="[
                props.onRowClick ? 'cursor-pointer' : 'cursor-default',
                props.rowClassName ? props.rowClassName(row.original) : ''
              ]" @click="handleRowClick(row.original)">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id"
                :class="(cell.column.columnDef.meta as any)?.cellClass">
                <!-- 具名 cell 插槽：#cell-<columnId> -->
                <slot :name="`cell-${getColId(cell.column)}`" v-bind="{
                  row: row.original,
                  cell,
                  value: cell.getValue(),
                  // 若需要也可暴露 raw row/cell for max flexibility
                  _row: row,
                  _column: cell.column
                }">
                  <!-- fallback：若無插槽，回退到 columnDef.cell -->
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </slot>
              </TableCell>
            </TableRow>
          </template>

          <template v-else>
            <TableRow>
              <TableCell :colspan="dt.table.getAllLeafColumns().length"
                class="h-24 text-sm text-center text-muted-foreground">
                無資料
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <DataTablePagination :table="dt.table" />
  </div>
</template>
