import type { MutableNode, Options } from '../types/index.ts'

import { toFixed, isObject } from './factory.ts'

function convertPxLength(node: MutableNode, options: Options): boolean {
  if (node.unit === 'px' && typeof node.value === 'number' && node.value >= options.minValue) {
    node.unit = 'rem'
    node.value = toFixed(node.value / options.rootValue, options.unitPrecision)
    return true
  }
  return false
}

export function createPxToRemWalker(options: Options) {
  function walkAndConvert(node: unknown): boolean {
    if (!isObject(node)) return false

    if (Array.isArray(node)) {
      let changed = false
      for (const item of node) {
        if (walkAndConvert(item)) changed = true
      }
      return changed
    }

    if (convertPxLength(node, options)) return true

    if (node.type === 'dimension' && isObject(node.value)) {
      if (convertPxLength(node.value, options)) return true
    }

    let changed = false
    for (const value of Object.values(node)) {
      if (walkAndConvert(value)) changed = true
    }

    return changed
  }

  return walkAndConvert
}
