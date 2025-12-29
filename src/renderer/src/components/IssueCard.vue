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
.card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 14px;
  margin-bottom: 10px;
  border: var(--border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  cursor: move;
  transition: transform 0.2s, box-shadow 0.2s;
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 8px;
}

.labels {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.label {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  color: #fff;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.assignee {
  font-size: 12px;
  color: var(--text-light);
}
</style>
