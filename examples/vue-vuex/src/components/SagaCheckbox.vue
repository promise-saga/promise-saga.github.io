<script setup lang="ts">
import {defineProps} from 'vue';

defineProps({
  flow: { type: Object, required: true },
});
</script>

<template>
  <input
      type="checkbox"
      :checked="flow.isRunning"
      @change="flow.toggle"
  />
</template>
