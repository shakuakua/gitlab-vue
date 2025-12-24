export interface Label { name: string; color: string }
export interface Issue {
  id: number
  title: string
  labels: Label[]
  assignee: string
  state: 'todo' | 'doing' | 'done'
}
