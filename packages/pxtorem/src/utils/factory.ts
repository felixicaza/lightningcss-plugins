import type { CustomDeclarationLike, CustomPropertyLike, UnparsedLike, MutableNode as UnknownRecord } from '../types/index.ts'

const COMBINATOR_TEXT: Record<string, string> = {
  child: ' > ',
  descendant: ' ',
  'next-sibling': ' + ',
  'later-sibling': ' ~ '
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function selectorComponentToText(component: unknown): string {
  if (!isObject(component) || typeof component.type !== 'string') return ''

  switch (component.type) {
    case 'class':
      return typeof component.name === 'string' ? `.${component.name}` : ''
    case 'id':
      return typeof component.name === 'string' ? `#${component.name}` : ''
    case 'type':
      return typeof component.name === 'string' ? component.name : ''
    case 'universal':
      return '*'
    case 'nesting':
      return '&'
    case 'combinator':
      return typeof component.value === 'string' ? (COMBINATOR_TEXT[component.value] ?? ' ') : ' '
    case 'attribute':
      return typeof component.name === 'string' ? `[${component.name}]` : '[]'
    case 'pseudo-class':
      if (typeof component.kind === 'string') return `:${component.kind}`
      if (typeof component.name === 'string') return `:${component.name}`
      return ':'
    case 'pseudo-element':
      if (typeof component.kind === 'string') return `::${component.kind}`
      if (typeof component.name === 'string') return `::${component.name}`
      return '::'
    default:
      return ''
  }
}

function selectorToText(selector: unknown): string {
  if (!Array.isArray(selector)) return ''
  return selector.map(selectorComponentToText).join('')
}

function pushSelectorTexts(raw: unknown, out: string[]): void {
  if (!Array.isArray(raw)) return

  for (const item of raw) {
    if (isNonEmptyString(item)) {
      out.push(item)
      continue
    }

    const text = selectorToText(item)
    if (text.trim()) out.push(text)
  }
}

function extractSelectorTextsFromRuleLike(node: UnknownRecord): string[] {
  const out: string[] = []

  if (node.type === 'style' && isObject(node.value)) {
    pushSelectorTexts(node.value.selectors, out)
  }

  if ('selectors' in node) {
    pushSelectorTexts(node.selectors, out)
  }

  return out
}

function toUnparsedLike(value: unknown): UnparsedLike | null {
  return isObject(value) ? (value as unknown as UnparsedLike) : null
}

export function hasIgnoredSelectorInRule(
  node: unknown,
  shouldIgnoreSelector: (selector: string) => boolean
): boolean {
  if (!isObject(node)) return false
  return extractSelectorTextsFromRuleLike(node).some(shouldIgnoreSelector)
}

export function isObject(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

export function toFixed(value: number, precision: number): number {
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

export function isCustomPropertyLike(value: unknown): value is CustomPropertyLike {
  return isObject(value) && typeof value.name !== 'undefined' && Array.isArray(value.value)
}

export function isCustomDeclarationLike(value: unknown): value is CustomDeclarationLike {
  return isObject(value) && value.property === 'custom' && isCustomPropertyLike(value.value)
}

export function getEffectiveProperty(prop: string, value: unknown): string {
  if (prop !== 'unparsed') return prop
  const unparsed = toUnparsedLike(value)
  if (!unparsed) return prop

  return typeof unparsed.propertyId?.property === 'string' ? unparsed.propertyId.property : prop
}

export function getPropertyValueNode(prop: string, value: unknown): unknown {
  if (prop !== 'unparsed') return value
  const unparsed = toUnparsedLike(value)
  if (!unparsed) return value

  return unparsed.value ?? value
}

export function normalizeCustomName(name: unknown): string | null {
  if (typeof name === 'string') {
    return name.startsWith('--') ? name : `--${name}`
  }

  if (isObject(name) && typeof name.ident === 'string') {
    return name.ident.startsWith('--') ? name.ident : `--${name.ident}`
  }

  return null
}

export function collectVarReferences(node: unknown, out: Set<string>): void {
  if (Array.isArray(node)) {
    for (const item of node) collectVarReferences(item, out)
    return
  }

  if (!isObject(node)) return

  if (node.type === 'var') {
    const varName = isObject(node.value) ? normalizeCustomName(node.value.name) : normalizeCustomName(node.name)
    if (varName) out.add(varName)
  }

  for (const value of Object.values(node)) {
    collectVarReferences(value, out)
  }
}

export function collectUsedCustomPropsInAst(
  node: unknown,
  shouldConvertProperty: (property: string) => boolean,
  out: Set<string>,
  options?: {
    shouldIgnoreSelector?: (selector: string) => boolean
  }
): void {
  const shouldIgnoreSelector = options?.shouldIgnoreSelector

  function walk(current: unknown, inIgnoredSelector: boolean): void {
    if (Array.isArray(current)) {
      for (const item of current) walk(item, inIgnoredSelector)
      return
    }

    if (!isObject(current)) return

    const currentIgnored =
      inIgnoredSelector ||
      (shouldIgnoreSelector ? hasIgnoredSelectorInRule(current, shouldIgnoreSelector) : false)

    if (!currentIgnored && typeof current.property === 'string' && 'value' in current) {
      const prop = current.property
      const value = current.value
      const effectiveProp = getEffectiveProperty(prop, value)

      if (shouldConvertProperty(effectiveProp)) {
        collectVarReferences(getPropertyValueNode(prop, value), out)
      }
    }

    for (const value of Object.values(current)) {
      walk(value, currentIgnored)
    }
  }

  walk(node, false)
}
