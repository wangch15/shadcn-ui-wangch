<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button variant="outline" :class="cn(
        'justify-start text-left font-normal',
        !localValue && 'text-muted-foreground',
        btnClass,
      )">
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ localValue ? df.format(localValue.toDate(getLocalTimeZone())) : placeholder }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="localValue" initial-focus />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { DateValue } from "@internationalized/date"
import {
  DateFormatter,
  CalendarDate,
  getLocalTimeZone,
} from "@internationalized/date"
import { CalendarIcon } from "lucide-vue-next"
import { computed, watch, ref } from "vue"
import dayjs from "dayjs"

import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { Calendar } from "../../ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"

const df = new DateFormatter("zh-TW", {
  dateStyle: "long",
})

// 支援字串或 DateValue 類型
const modelValue = defineModel<string | DateValue | undefined>()

// 控制 popover 的開啟狀態
const isOpen = ref(false)

const props = defineProps({
  btnClass: {
    type: [String, Object, Array],
    default: '',
  },
  placeholder: {
    type: String,
    default: '請選擇日期',
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
})

// 內部使用的 DateValue
const localValue = computed({
  get: () => {
    if (!modelValue.value) return undefined

    // 如果已經是 DateValue，直接返回
    if (typeof modelValue.value === 'object' && 'calendar' in modelValue.value) {
      return modelValue.value as DateValue
    }

    // 如果是字串，轉換為 CalendarDate
    if (typeof modelValue.value === 'string') {
      try {
        const parsed = dayjs(modelValue.value, props.format)
        if (parsed.isValid()) {
          return new CalendarDate(parsed.year(), parsed.month() + 1, parsed.date())
        }
      } catch {
        console.warn('Invalid date format:', modelValue.value)
      }
    }

    return undefined
  },
  set: (newValue: DateValue | undefined) => {
    if (!newValue) {
      modelValue.value = undefined
      return
    }

    // 轉換為字串格式
    const year = newValue.year
    const month = String(newValue.month).padStart(2, '0')
    const day = String(newValue.day).padStart(2, '0')
    const dateString = `${year}-${month}-${day}`

    // 如果原始格式不是 YYYY-MM-DD，需要轉換
    if (props.format !== 'YYYY-MM-DD') {
      try {
        const parsed = dayjs(dateString, 'YYYY-MM-DD')
        modelValue.value = parsed.format(props.format)
      } catch {
        modelValue.value = dateString
      }
    } else {
      modelValue.value = dateString
    }
  }
})

// 監聽外部 modelValue 變化，同步到 localValue
watch(() => modelValue.value, () => {
  // localValue 是 computed，會自動更新
}, { immediate: true })

// 監聽 localValue 變化，當選擇日期後自動關閉 popover
watch(localValue, (newValue) => {
  if (newValue) {
    // 延遲關閉，讓用戶看到選擇的日期
    setTimeout(() => {
      isOpen.value = false
    }, 100)
  }
})
</script>
