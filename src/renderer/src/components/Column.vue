<template>
  <div class="column" @drop="onDrop" @dragover.prevent @dragenter.prevent="dragEnter" @dragleave="dragLeave">
    <div class="header">
      <span>{{ colName }}</span>
      <span class="count">{{ issues.length }}</span>
    </div>
    <IssueCard v-for="i in issues" :key="i.id" :issue="i" @click="openDrawer(i)" />
  </div>
    <IssueDrawer
    :issue="drawerIssue"
    :visible="drawerVisible"
    @close="closeDrawer"
    @update:progress="updateProgress"
  />
</template>

<script setup lang="ts">
import { useKanbanStore } from '@renderer/store'
import IssueCard from './IssueCard.vue'
import type { Issue } from '@renderer/types'
import IssueDrawer from './IssueDrawer.vue'  // 引入
import { ref } from 'vue'

const drawerVisible = ref(false)
const drawerIssue = ref<Issue>({} as Issue)

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

function openDrawer(issue: Issue) {
  drawerIssue.value = issue
  drawerVisible.value = true
}
function closeDrawer() {
  drawerVisible.value = false
}
/* 进度变化后同步回 store 和 GitLab */
async function updateProgress(p: number) {
  // 1. 改本地标签
  const issue = drawerIssue.value
  issue.labels = issue.labels.filter(l => !l.name.match(/^\d+%$/))
  if (p > 0) issue.labels.push({ name: `${p}%`, color: '#007bff' })
  // 2. 写回 GitLab（复用已有的 updateIssue）
  await store.moveIssue(issue, issue.state) // 内部会调用 updateIssue
}
</script>

<style scoped>
.column {
  flex: 1;
  margin: 8px;
  padding: 12px;
  background: var(--bg-column);
  border-radius: var(--radius);
  border: var(--border);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  transition: background 0.3s;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.5px;
  color: var(--text);
  position: relative;
}

/* 霓虹列名 */
.header span:first-child {
  position: relative;
}
.header span:first-child::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  height: 3px;
  width: 100%;
  border-radius: 2px;
  background: var(--neon-todo);
}
.column[data-state='doing'] .header span:first-child::after {
  background: var(--neon-doing);
}
.column[data-state='done'] .header span:first-child::after {
  background: var(--neon-done);
}

.count {
  background: var(--bg-card);
  color: var(--text-light);
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 8px;
}

.drag-over {
  background: var(--primary-glow);
  border: 1px solid var(--primary);
}
</style>
