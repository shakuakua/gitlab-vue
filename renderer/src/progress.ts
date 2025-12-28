export function parseChecklist(desc: string): { done: number; total: number } {
  const matches = desc.match(/^-\s*\[(x| )\].*$/gim) || []
  const done = matches.filter(l => l.includes('[x]')).length
  return { done, total: matches.length }
}