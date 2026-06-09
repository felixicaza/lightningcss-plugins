import type { Config, DeclarationLike, StyleSheetLike } from './types/index.ts'

import { createPxToRemWalker } from './utils/conversion.ts'
import { createPropertyMatcher } from './utils/propRules.ts'
import { validateIsNumber, validatePositiveInteger } from './utils/errorHandler.ts'
import { collectUsedCustomPropsInAst, isCustomDeclarationLike, isCustomPropertyLike, normalizeCustomName, getEffectiveProperty, getPropertyValueNode } from './utils/factory.ts'

const defaultConfig: Config = {
  rootValue: 16,
  unitPrecision: 4,
  propList: ['font', 'font-size', 'line-height', 'letter-spacing', 'word-spacing'],
  minValue: 0
}

export default function pxtorem(config: Partial<Config> = {}) {
  const userConfig = { ...defaultConfig, ...config }

  validatePositiveInteger(userConfig.rootValue, 'rootValue')
  validatePositiveInteger(userConfig.unitPrecision, 'unitPrecision')
  validateIsNumber(userConfig.rootValue, 'rootValue')
  validateIsNumber(userConfig.unitPrecision, 'unitPrecision')
  validateIsNumber(userConfig.minValue, 'minValue')

  const shouldConvertProperty = createPropertyMatcher(userConfig.propList)
  const walkAndConvert: (node: unknown) => boolean = createPxToRemWalker({
    rootValue: userConfig.rootValue,
    unitPrecision: userConfig.unitPrecision,
    minValue: userConfig.minValue
  })

  const usedCustomProps = new Set<string>()
  const cache = new Map<string, DeclarationLike>()

  // Pre-scan once (before declaration visitors mutate anything)
  let scanned = false
  const StyleSheet = (sheet: StyleSheetLike) => {
    if (!scanned) {
      collectUsedCustomPropsInAst(sheet, shouldConvertProperty, usedCustomProps)
      scanned = true
    }
    return undefined
  }

  const Declaration = new Proxy({} as Record<string, DeclarationLike>, {
    get(_, prop: string | symbol): DeclarationLike | undefined {
      if (typeof prop !== 'string') return undefined

      let handler = cache.get(prop)
      if (!handler) {
        const created: DeclarationLike = (value) => {
          if (prop === 'custom') {
            let custom = null

            if (isCustomPropertyLike(value)) {
              custom = value
            } else if (isCustomDeclarationLike(value)) {
              custom = value.value
            }

            if (!custom) return undefined

            const customName = normalizeCustomName(custom.name)
            if (!customName) return undefined

            if (!usedCustomProps.has(customName)) return undefined

            const changed = walkAndConvert(custom.value)
            if (!changed) return undefined

            return {
              property: 'custom',
              value: {
                name: customName,
                value: custom.value
              }
            }
          }

          const effectiveProp = getEffectiveProperty(prop, value)
          if (shouldConvertProperty(effectiveProp)) {
            const valueNode = getPropertyValueNode(prop, value)
            const changed = walkAndConvert(valueNode)
            return changed ? value : undefined
          }

          return undefined
        }

        cache.set(prop, created)
        handler = created
      }

      return handler
    }
  })

  return { StyleSheet, Declaration }
}
