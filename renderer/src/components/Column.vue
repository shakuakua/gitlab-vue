<template>
  <div class="column" @drop="onDrop" @dragover.prevent @dragenter.prevent="dragEnter" @dragleave="dragLeave">
    <div class="header">
      <span>{{ colName }}</span>
      <span class="count">{{ issues.length }}</span>
    </div>
    <IssueCard v-for="i in issues" :key="i.id" :issue="i" />
  </div>
</template>

<script setup lang="ts">
import { useKanbanStore } from '@renderer/store'
import IssueCard from './IssueCard.vue'
import type { Issue } from '@renderer/types'

const props =defineProps<{ state: Issue['state']; issues: Issue[] }>()
const store = useKanbanStore()
const colName = { todo: 'To Do', doing: 'In Progress', done: 'Done' }[props.state]!

function onDrop(e: DragEvent) {
  e.preventDefault()
  const target = e.currentTarget as HTMLElement
  target.classList.remove('drag-over')
  const id = Number(e.dataTransfer?.getData('issueId'))
  const issue = store.issues.find(i => i.id === id)
  if (issue) store.moveIssue(issue, props.state)
}
function dragEnter(e: DragEvent) {
  (e.currentTarget as HTMLElement).classList.add('drag-over')
}
function dragLeave(e: DragEvent) {
  (e.currentTarget as HTMLElement).classList.remove('drag-over')
}
</script>

<style scoped>
.column{flex:1;background:#f5f5f5;margin:8px;border-radius:6px;padding:8px;display:flex;flex-direction:column;}
.header{display:flex;justify-content:space-between;margin-bottom:8px;font-weight:600;}
.count{background:#999;color:#fff;font-size:12px;padding:2px 6px;border-radius:10px;}
.drag-over{background:#e0e0e0;}
</style>
