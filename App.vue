<template>
  <div class="top-bar">
    <input v-model="token" type="password" placeholder="GitLab 私人令牌" />
    <input v-model="projectId" placeholder="项目ID" />
    <button @click="loadBoard">加载看板</button>
    <button @click="useMock">模拟数据</button>
    <ProjectSearchBar />
    <router-view />
  </div>
  <KanbanBoard />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useKanbanStore } from '@renderer/store'
import KanbanBoard from '@renderer/components/KanbanBoard.vue'
import ProjectSearchBar from "./components/ProjectSearchBar.vue"

const store = useKanbanStore()
const token = ref('')
const projectId = ref('')

onMounted(() => {
  token.value = localStorage.getItem('token') ?? ''
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
.top-bar{display:flex;gap:8px;justify-content:center;padding:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.1);}
input{padding:6px 10px;border:1px solid #ccc;border-radius:4px;}
button{padding:6px 14px;border:none;background:#007bff;color:#fff;border-radius:4px;cursor:pointer;}
button:hover{background:#0056b3;}
</style>
