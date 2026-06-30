<script setup lang="ts">
import type { HTMLAttributes } from "vue"
// import { Check } from "lucide-vue-next"
import { Checkbox } from "#/components/ui/checkbox"
import { cn } from "#/lib/utils"

interface Props {
    modelValue?: boolean
    disabled?: boolean
    class?: HTMLAttributes["class"]
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    disabled: false,
})

const emits = defineEmits<{
    "update:modelValue": [value: boolean]
}>()

const handleChange = (value: boolean) => {
    emits("update:modelValue", value)
}
</script>

<template>
    <div :class="cn(
        'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent/50 transition-colors',
        props.class
    )" @click="!disabled && handleChange(!modelValue)">
        <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
            <Checkbox :model-value="modelValue" :disabled="disabled" class="pointer-events-none"
                @update:model-value="(v) => handleChange(v as boolean)" />
        </span>
        <slot />
    </div>
</template>
