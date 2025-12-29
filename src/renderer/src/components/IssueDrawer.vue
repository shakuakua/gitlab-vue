<template>
  <teleport to="body">
    <div v-if="visible" class="drawer-mask" @click="close"></div>
    <transition name="slide">
      <div v-if="visible" class="drawer">
        <div class="header">
          <span class="title">任务详情</span>
          <button class="close" @click="close">✕</button>
        </div>
        <div class="body">
          <h3>{{ issue.title }}</h3>
          <p class="info">负责人：{{ issue.assignee }}</p>

          <!-- 进度可视化 -->
          <div class="progress-block">
            <span>完成进度</span>
            <div class="bar">
              <div class="fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="percent">{{ progress }}%</span>
          </div>

          <!-- 标签 -->
          <div class="labels">
            <span v-for="l in issue.labels" :key="l.name" class="label" :style="{background:l.color}">{{ l.name }}</span>
          </div>

          <!-- 快速操作 -->
          <div class="actions">
            <button @click="setProgress(0)">重置</button>
            <button @click="setProgress(50)">50%</button>
            <button @click="setProgress(100)">完成</button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Issue } from '@renderer/types'

const props = defineProps<{ issue: Issue; visible: boolean }>()
const emit  = defineEmits<{ (e: 'close'): void; (e: 'update:progress', p: number): void }>()

/* 本地进度值（0/50/100） */
const progress = ref(0)

/* 初始化：如果标签里已含进度，直接读 */
watch(() => props.issue, () => {
    // 添加安全检查，防止 props.issue 或 props.issue.labels 为 undefined
  if (!props.issue || !props.issue.labels) {
    progress.value = 0
    return
  }
  const pTag = props.issue.labels.find(l => l.name.match(/^\d+%$/))
  progress.value = pTag ? parseInt(pTag.name) : 0
}, { immediate: true })


/* 关闭抽屉 */
function close() {
  emit('close')
}

/* 用户点快捷按钮 */
function setProgress(p: number) {
  progress.value = p
  // 把进度写成标签，同步回 GitLab
  const newLabels = props.issue.labels.filter(l => !l.name.match(/^\d+%$/)).map(l => l.name)
  if (p > 0) newLabels.push(`${p}%`)
  // 通过父组件调用 store 更新
  emit('update:progress', p)
}
</script>

<style scoped>
.drawer-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  z-index: 998;
  animation: maskIn 0.3s ease;
}
@keyframes maskIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 380px;
  height: 100%;
  background: var(--bg-card);
  border-left: var(--border);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(16px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: var(--border);
}
.header .title {
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-light);
  cursor: pointer;
  transition: color 0.2s;
}
.close:hover {
  color: var(--text);
}

.body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
}

.info {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--text-light);
}

.progress-block {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}
.progress-block span:first-child {
  font-size: 14px;
  font-weight: 500;
}
.bar {
  flex: 1;
  height: 10px;
  background: var(--bg-column);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}
.fill {
  height: 100%;
  background: linear-gradient(90deg, var(--neon-doing), var(--neon-done));
  border-radius: 999px;
  transition: width 0.4s ease;
  box-shadow: 0 0 10px var(--neon-doing);
}
.percent {
  font-size: 12px;
  color: var(--text-light);
  min-width: 36px;
  text-align: right;
}

.labels {
  margin: 16px 0;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.label {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  color: #fff;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.actions {
  margin-top: 24px;
  display: flex;
  gap: 8px;
}
.actions button {
  flex: 1;
  padding: 8px 0;
  border: 1px solid var(--border);
  background: var(--bg-column);
  color: var(--text);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}
.actions button:hover {
  border-color: var(--primary);
  color: var(--primary);
}
</style>
