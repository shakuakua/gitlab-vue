<template>
  <div class="board">
    <Column v-for="s in states" :key="s" :state="s" :issues="colIssues(s)" />
  </div>
</template>

<script setup lang="ts">
import { useKanbanStore } from '@renderer/store'
import Column from './Column.vue'
import type { Issue } from '@renderer/types'

const store = useKanbanStore()
const states: Issue['state'][] = ['todo', 'doing', 'done']

function colIssues(state: Issue['state']) {
  return store.issues.filter(i => i.state === state)
}
</script>

<style scoped>
.board{display:flex;height:calc(100vh - 60px);}
</style>
