<template>
  <div class="card" draggable="true" @dragstart="onDragStart">
    <div class="title">{{ issue.title }}</div>
    <div class="labels">
      <span v-for="l in issue.labels" :key="l.name" class="label" :style="{background:l.color}">{{ l.name }}</span>
    </div>
    <div class="assignee">👤 {{ issue.assignee }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Issue } from '@renderer/types'

const props=defineProps<{ issue: Issue }>()

function onDragStart(e: DragEvent) {
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('issueId', String(props.issue.id))
}
</script>

<style scoped>
.card{background:#fff;border-radius:6px;padding:10px;margin-bottom:8px;box-shadow:0 1px 3px rgba(0,0,0,.12);cursor:move;}
.title{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:6px;}
.labels{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;}
.label{font-size:12px;color:#fff;padding:2px 6px;border-radius:4px;}
.assignee{font-size:12px;color:#666;}
</style>
