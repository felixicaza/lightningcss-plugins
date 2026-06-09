import type { CustomDeclarationLike, CustomPropertyLike, UnparsedLike } from '../types/index.ts'

export function isObject(value: unknown): value is Record<string, unknown> {
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
  if (prop !== 'unparsed' || !isObject(value)) return prop

  const unparsed = value as unknown as UnparsedLike
  return typeof unparsed.propertyId?.property === 'string' ? unparsed.propertyId.property : prop
}

export function getPropertyValueNode(prop: string, value: unknown): unknown {
  if (prop !== 'unparsed' || !isObject(value)) return value

  const unparsed = value as unknown as UnparsedLike
  return unparsed.value ?? value
}

export function normalizeCustomName(name: unknown): string | null {
  if (typeof name === 'string') return name.startsWith('--') ? name : `--${name}`
  if (isObject(name) && typeof name.ident === 'string') {
    return name.ident.startsWith('--') ? name.ident : `--${name.ident}`
  }
  return null
}

export function collectVarReferences(node: unknown, out: Set<string>): void {
  if (!isObject(node)) return

  if (node.type === 'var') {
    const varName = isObject(node.value) ? normalizeCustomName(node.value.name) : normalizeCustomName(node.name)
    if (varName) out.add(varName)
  }

  if (Array.isArray(node)) {
    for (const item of node) collectVarReferences(item, out)
    return
  }

  for (const value of Object.values(node)) {
    collectVarReferences(value, out)
  }
}

export function collectUsedCustomPropsInAst(node: unknown, shouldConvertProperty: (property: string) => boolean, out: Set<string>): void {
  if (!isObject(node)) return

  if (Array.isArray(node)) {
    for (const item of node) collectUsedCustomPropsInAst(item, shouldConvertProperty, out)
    return
  }

  // Detect declaration-like nodes anywhere in the AST
  if (typeof node.property === 'string' && 'value' in node) {
    const prop = node.property
    const value = node.value
    const effectiveProp = getEffectiveProperty(prop, value)

    if (shouldConvertProperty(effectiveProp)) {
      const valueNode = getPropertyValueNode(prop, value)
      collectVarReferences(valueNode, out)
    }
  }

  for (const value of Object.values(node)) {
    collectUsedCustomPropsInAst(value, shouldConvertProperty, out)
  }
}
