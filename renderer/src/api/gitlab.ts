import axios from 'axios'
import type { Issue } from '@renderer/types'

const BASE = 'https://gitlab.com/api/v4'

/** 拉取项目打开的 issues */
export async function getIssues(token: string, projectId: string): Promise<Issue[]> {
  const res = await axios.get<Issue[]>(
    `${BASE}/projects/${projectId}/issues?state=opened`,
    { headers: { 'PRIVATE-TOKEN': token } }
  )
  console.log(res)
  return res.data.map((iss: any) => ({
    id: iss.iid,
    title: iss.title,
    labels: iss.labels.slice(0, 3).map((l: string) => ({ name: l, color: randomColor() })),
    assignee: iss.assignee?.username ?? '未分配',
    state: mapState(iss.labels)
  }))
}

/** 把 issue 的新状态写回 GitLab（通过打标签） */
export async function updateIssue(issue: Issue): Promise<void> {
  const token   = localStorage.getItem('token')!
  const projectId = localStorage.getItem('projectId')!
  // 去掉旧状态标签，追加新状态
  const labels = [
    ...issue.labels.map(l => l.name).filter(l => !['todo','doing','done'].includes(l)),
    issue.state
  ].join(',')
  await axios.put(
    `${BASE}/projects/${projectId}/issues/${issue.id}`,
    { labels },
    { headers: { 'PRIVATE-TOKEN': token } }
  )
}

/* ---------------- helper ---------------- */
function mapState(labels: string[]): Issue['state'] {
  if (labels.includes('doing')) return 'doing'
  if (labels.includes('done')) return 'done'
  return 'todo'
}

function randomColor(): string {
  const colors = ['#00b894','#fdcb6e','#e17055','#6c5ce7','#a29bfe']
  return colors[Math.floor(Math.random() * colors.length)]
}
