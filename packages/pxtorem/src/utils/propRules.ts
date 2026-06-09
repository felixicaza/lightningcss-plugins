import type { PropRule } from '../types/index.ts'

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function createRule(rawPattern: string | RegExp): PropRule | null {
  const pattern = typeof rawPattern === 'string' ? rawPattern.trim() : rawPattern
  if (!pattern) return null

  const negate = typeof pattern === 'string' && pattern.startsWith('!')
  const body = negate ? (pattern as string).slice(1).trim() : pattern
  if (!body) return null

  if (body === '*') {
    return { negate, test: () => true }
  }

  if (typeof body === 'string' && !body.includes('*')) {
    return { negate, test: (property) => property === body }
  }

  if (body instanceof RegExp) {
    return { negate, test: (property) => body.test(property) }
  }

  const regex = new RegExp(`^${escapeRegex(body).replace(/\\\*/g, '.*')}$`)
  return { negate, test: (property) => regex.test(property) }
}

export function createPropertyMatcher(propList: (string | RegExp)[]): (property: string) => boolean {
  const propRules = propList.map(createRule).filter((rule): rule is PropRule => rule !== null)

  return function(property: string): boolean {
    let matched = false
    for (const rule of propRules) {
      if (rule.test(property)) {
        matched = !rule.negate
      }
    }
    return matched
  }
}
