<!-- components/data-table/DataTableFacetedFilter.vue -->
<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { computed } from 'vue'
import { Button } from '../../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverCheckboxItem,
} from '../../ui/popover'
import { Separator } from '../../ui/separator'

type Props = {
  table: Table<any>
  columnId: string
  title: string
  options: Array<{ label: string; value: string; icon?: any }>
}
const props = defineProps<Props>()

const col = computed(() => props.table.getColumn(props.columnId))

const values = computed<string[]>({
  get: () => (col.value?.getFilterValue() as string[]) ?? [],
  set: (v) => {
    col.value?.setFilterValue(v.length > 0 ? v : undefined)
  },
})

const toggle = (val: string) => {
  const set = new Set(values.value)
  if (set.has(val)) {
    set.delete(val)
  } else {
    set.add(val)
  }
  values.value = Array.from(set)
}
</script>

<template>
  <Popover v-if="col">
    <PopoverTrigger as-child>
      <Button variant="outline">{{ title }}</Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-56 max-h-72 overflow-auto p-0">
      <div class="text-xs text-muted-foreground p-2 pl-2.5">
        篩選：{{ title }}
      </div>
      <Separator />
      <div class="p-1">
        <PopoverCheckboxItem v-for="opt in options" :key="opt.value" :model-value="values.includes(opt.value)"
          @update:model-value="() => toggle(opt.value)">
          <span class="truncate">{{ opt.label }}</span>
        </PopoverCheckboxItem>
      </div>
    </PopoverContent>
  </Popover>
</template>
