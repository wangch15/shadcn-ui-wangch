// components/data-table/types.ts
import type { ColumnDef as TSColumnDef } from '@tanstack/vue-table'

export type RowKey = string | number

// 額外 UI 中繼資料：寬度 / 置中 / 是否可排序等
export type ExtraCellMeta = {
  widthClass?: string        // ex: 'w-24'
  cellClass?: string         // ex: 'text-right'
  enableSorting?: boolean    // 預設 true；如需關閉排序
}

export type ColumnDef<TData, TValue = unknown> =
  TSColumnDef<TData, TValue> & { meta?: ExtraCellMeta }

export interface DataTableInitialState {
  pageSize?: number
}

export interface DataTableHookOptions<TData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  rowKey?: keyof TData | ((row: TData) => RowKey)
  initialState?: DataTableInitialState
}
