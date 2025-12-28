<template>
  <teleport to="body">
    <div v-if="open" class="drawer-mask" @click.self="close">
      <aside class="drawer">
        <header>
          <span class="close" @click="close">&times;</span>
          <h3>{{ issue.title }}</h3>
        </header>
        <section>
          <p v-html="renderedDesc"></p>
          <ProgressBar :done="progress.done" :total="progress.total" />
          <ul class="meta">
            <li>指派人：{{ issue.assignee?.name || '无' }}</li>
            <li>截止：{{ issue.due_date || '无' }}</li>
            <li>标签：<span v-for="l in issue.labels" :key="l" class="label">{{ l }}</span></li>
          </ul>
        </section>
      </aside>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import { parseChecklist } from '@renderer/progress'
import ProgressBar from './ProgressBar.vue'

const props = defineProps<{ issue: any; open: boolean }>()
const emit = defineEmits(['close'])

const close = () => emit('close')
const renderedDesc = computed(() => marked(props.issue.description || ''))
const progress = computed(() => parseChecklist(props.issue.description || ''))
</script>

<style scoped>
.drawer-mask { position: fixed; inset: 0; background: rgba(0,0,0,.3); z-index: 999; }
.drawer { position: fixed; right: 0; top: 0; bottom: 0; width: 420px; background: #fff; box-shadow: -2px 0 8px rgba(0,0,0,.15); display: flex; flex-direction: column; }
header { padding: 12px 16px; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between; }
.close { font-size: 24px; cursor: pointer; }
section { padding: 16px; flex: 1; overflow-y: auto; }
.meta { margin-top: 16px; list-style: none; padding: 0; }
.meta li { margin: 4px 0; }
.label { display: inline-block; background: #eee; padding: 2px 6px; border-radius: 4px; margin-right: 4px; font-size: 12px; }
</style>