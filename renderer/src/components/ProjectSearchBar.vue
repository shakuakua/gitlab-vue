<template>
  <div class="search-bar">
    <input
      v-model="query"
      @input="onSearch"
      placeholder="搜索 GitLab 项目..."
      class="search-input"
    />
    <ul v-if="results.length" class="search-results">
      <li v-for="project in results" :key="project.id">
        <strong>{{ project.name }}</strong> - {{ project.path_with_namespace }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const query = ref('')
const results = ref<any[]>([])

let timer: any = null

const onSearch = () => {
  clearTimeout(timer)
  timer = setTimeout(async () => {
    if (!query.value.trim()) {
      results.value = []
      return
    }

    try {
      // 替换为你的 GitLab 地址和 token
      const baseURL = 'https://gitlab.example.com'
      const token = 'glpat-YOUR_PRIVATE_TOKEN'

      const res = await axios.get(`${baseURL}/api/v4/projects`, {
        headers: { 'PRIVATE-TOKEN': token },
        params: {
          search: query.value,
          per_page: 10
        }
      })

      results.value = res.data
    } catch (error) {
      console.error('搜索失败', error)
      results.value = []
    }
  }, 300)
}
</script>

<style scoped>
.search-bar {
  padding: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}
.search-input {
  width: 100%;
  max-width: 400px;
  padding: 6px 10px;
  font-size: 14px;
}
.search-results {
  margin-top: 8px;
  list-style: none;
  padding-left: 0;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
}
.search-results li {
  padding: 6px 10px;
  cursor: pointer;
}
.search-results li:hover {
  background: #eee;
}
</style>