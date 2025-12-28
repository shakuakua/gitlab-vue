<template>
  <div class="board">
    <Column v-for="s in states" :key="s" :state="s" :issues="colIssues(s)" />



    <IssuePreview :issue="previewIssue" :open="!!previewIssue" @close="previewIssue = null" />
    <Column v-for="c in columns" :key="c.id" :column="c" @preview="previewIssue = $event" />



  </div>
</template>

<script setup lang="ts">
import { useKanbanStore } from '@renderer/store'
import type { Issue } from '@renderer/types'



import { ref } from 'vue'
import IssuePreview from './IssuePreview.vue'
import Column from './Column.vue'
const previewIssue = ref<any>(null)



const store = useKanbanStore()
const states: Issue['state'][] = ['todo', 'doing', 'done']

function colIssues(state: Issue['state']) {
  return store.issues.filter(i => i.state === state)
}
</script>

<style scoped>
.board{display:flex;height:calc(100vh - 60px);}
</style>