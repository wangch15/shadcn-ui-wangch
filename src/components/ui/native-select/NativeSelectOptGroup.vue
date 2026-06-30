<!-- @fallthroughAttributes true -->
<!-- @strictTemplates true -->

<script setup lang="ts">
const optGroupAttrs = { 'data-slot': 'native-select-optgroup' } as Record<string, string>
</script>

<template>
  <optgroup v-bind="optGroupAttrs">
    <slot />
  </optgroup>
</template>
