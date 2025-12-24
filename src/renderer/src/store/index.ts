import { defineStore } from 'pinia'
import { getIssues, updateIssue } from '@renderer/api/gitlab'
import type { Issue } from '@renderer/types'

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    issues: [] as Issue[]
  }),
  actions: {
    async loadIssues(token: string, projectId: string) {
      this.issues = await getIssues(token, projectId)
      localStorage.setItem('issues', JSON.stringify(this.issues))
    },
    async moveIssue(issue: Issue, newState: Issue['state']) {
      issue.state = newState
      await updateIssue(issue)
      localStorage.setItem('issues', JSON.stringify(this.issues))
    },
    useMockData() {
      this.issues = [
        { id: 1, title: '完成登录页', labels: [{ name: '前端', color: '#00b894' }], assignee: '小明', state: 'todo' },
        { id: 2, title: 'API 鉴权', labels: [{ name: '后端', color: '#fdcb6e' }], assignee: '小红', state: 'doing' },
        { id: 3, title: '文档补全', labels: [{ name: '文档', color: '#6c5ce7' }], assignee: '小刚', state: 'done' }
      ]
      localStorage.setItem('issues', JSON.stringify(this.issues))
    }
  }
})
