<template>
  <div class="project-search">
    <input v-model="keyword" placeholder="输入项目名称搜索" @input="onInput" />
    <ul v-if="list.length" class="dropdown">
      <li v-for="p in list" :key="p.id" @click="select(p)">{{ p.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { searchProjects } from '@renderer/api/gitlab'
import { useKanbanStore } from '@renderer/store'

const store = useKanbanStore()

const keyword = ref('')
const list    = ref<{id:number,name:string}[]>([])

let timer: number | null = null
function onInput() {
  console.log('输入了', keyword.value)
  if (timer) clearTimeout(timer)
  timer = window.setTimeout(async () => {
    if (!keyword.value.trim()) { list.value = []; return }
    const token = localStorage.getItem('token')
    if (!token) return
    list.value = await searchProjects(token, keyword.value.trim())
  }, 300)
}

function select(p: {id:number,name:string}) {
  list.value = []
  keyword.value = p.name
  // 通知父组件加载新项目
  store.loadIssues(localStorage.getItem('token')!, String(p.id))
  localStorage.setItem('projectId', String(p.id))
}
</script>

<style scoped>
.project-search{position:relative;display:inline-block;}
input{padding:6px 10px;border:1px solid #ccc;border-radius:4px;width:220px;}
.dropdown{position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #e0e0e0;border-top:none;list-style:none;margin:0;padding:4px 0;max-height:200px;overflow-y:auto;z-index:999;color: #007bff;}
li{padding:6px 10px;cursor:pointer;font-size:14px;}
li:hover{background:#f5f5f5;color: #007bff;}
</style>
