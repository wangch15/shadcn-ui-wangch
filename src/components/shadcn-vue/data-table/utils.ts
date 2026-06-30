// components/data-table/utils.ts
import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Checkbox } from '#/components/ui/checkbox'
import type { FilterFn, SortingFn } from '@tanstack/vue-table'

// 簡化的模糊過濾函數（不依賴外部庫）
export const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  const cellValue = String(row.getValue(columnId) || '').toLowerCase()
  const searchValue = String(value || '').toLowerCase()
  return cellValue.includes(searchValue)
}

// 多選值（string[]）過濾：欄位值需在所選清單內
export const multiSelectFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const cellValue = String(row.getValue(columnId) ?? '')
  if (Array.isArray(filterValue)) {
    return filterValue.length === 0 ? true : filterValue.includes(cellValue)
  }
  if (filterValue == null || filterValue === '') return true
  return String(filterValue) === cellValue
}

// 簡化的模糊排序函數
export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  const aValue = String(rowA.getValue(columnId) || '')
  const bValue = String(rowB.getValue(columnId) || '')
  return aValue.localeCompare(bValue)
}

// 日期時間排序（值為可被 new Date() 解析的字串）
export const dateTimeSort: SortingFn<any> = (rowA, rowB, columnId) => {
  const a = new Date(String(rowA.getValue(columnId) || '')).getTime()
  const b = new Date(String(rowB.getValue(columnId) || '')).getTime()
  return a - b
}

/**
 * 創建一個選擇欄位的 column 定義
 * 根據 shadcn-vue 官方實現方式
 */
export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      modelValue: table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': (value: any) => table.toggleAllPageRowsSelected(!!value),
      ariaLabel: 'Select all',
      onClick: (event: Event) => event.stopPropagation(),
    }),
    cell: ({ row }) => h(Checkbox, {
      modelValue: row.getIsSelected(),
      'onUpdate:modelValue': (value: any) => row.toggleSelected(!!value),
      ariaLabel: 'Select row',
      onClick: (event: Event) => event.stopPropagation(),
    }),
    enableSorting: false,
    enableHiding: false,
  }
}

