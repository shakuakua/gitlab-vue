<template>
  <div class="top-bar">
    <!-- 左侧：项目搜索 -->
    <ProjectSearch />
    <!-- 右侧：Token & 项目ID（老功能保留） -->
    <input v-model="token" type="password" placeholder="GitLab 私人令牌" />
    <input v-model="projectId" placeholder="项目ID（也可搜索后自动填充）" />
    <button @click="loadBoard">加载看板</button>
    <button @click="useMock">模拟数据</button>
  </div>
  <KanbanBoard />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useKanbanStore } from '@renderer/store'
import KanbanBoard from '@renderer/components/KanbanBoard.vue'
import ProjectSearch from '@renderer/components/ProjectSearch.vue'

const store = useKanbanStore()
const token   = ref('')
const projectId = ref('')

onMounted(() => {
  token.value   = localStorage.getItem('token') ?? ''
  projectId.value = localStorage.getItem('projectId') ?? ''
})

function loadBoard() {
  if (!token.value || !projectId.value) return alert('请输入 Token 和项目ID')
  localStorage.setItem('token', token.value)
  localStorage.setItem('projectId', projectId.value)
  store.loadIssues(token.value, projectId.value)
}
function useMock() {
  store.useMockData()
}
</script>

<style scoped>
.top-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  background: var(--bg-card);
  box-shadow: var(--shadow);
  border-bottom: var(--border);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: 100;
}

input {
  padding: 8px 14px;
  border-radius: 12px;
  border: var(--border);
  background: var(--bg-column);
  color: var(--text);
  transition: all 0.3s;
}
input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

button {
  padding: 8px 16px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, var(--primary), #00a085);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px var(--primary-glow);
}
</style>
