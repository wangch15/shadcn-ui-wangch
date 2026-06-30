<!-- @fallthroughAttributes true -->
<!-- @strictTemplates true -->

<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "../../../lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
const optionAttrs = { 'data-slot': 'native-select-option' } as Record<string, string>
</script>

<template>
  <option v-bind="optionAttrs" :class="cn('bg-popover text-popover-foreground', props.class)">
    <slot />
  </option>
</template>
