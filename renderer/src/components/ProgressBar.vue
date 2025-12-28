<template>
  <div class="progress-bar" v-if="total">
    <div class="bar" :style="{ width: percent + '%' }" />
    <span class="text">{{ done }}/{{ total }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ done: number; total: number }>()
const percent = computed(() => (props.total ? Math.round((props.done / props.total) * 100) : 0))
</script>

<style scoped>
.progress-bar { position: relative; height: 14px; background: #e4e4e4; border-radius: 6px; overflow: hidden; font-size: 12px; }
.bar { height: 100%; background: #52c41a; transition: width .2s; }
.text { position: absolute; inset: 0; text-align: center; line-height: 14px; color: #333; }
</style>