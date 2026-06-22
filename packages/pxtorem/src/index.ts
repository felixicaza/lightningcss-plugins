import type { Config, DeclarationLike, StyleSheetLike, RuleLike, MediaQueryLike } from './types/index.ts'

import { createPxToRemWalker } from './utils/conversion.ts'
import { createPropertyMatcher, createSelectorMatcher } from './utils/propRules.ts'
import { validateIsArray, validateIsBoolean, validateIsNumber, validatePositiveInteger } from './utils/errorHandler.ts'
import {
  collectUsedCustomPropsInAst,
  isCustomDeclarationLike,
  isCustomPropertyLike,
  normalizeCustomName,
  getEffectiveProperty,
  getPropertyValueNode,
  hasIgnoredSelectorInRule
} from './utils/factory.ts'

const defaultConfig: Config = {
  rootValue: 16,
  unitPrecision: 4,
  propList: ['font', 'font-size', 'line-height', 'letter-spacing', 'word-spacing'],
  minValue: 0,
  ignoreSelectors: [],
  mediaQuery: false
}

export default function pxtorem(config: Partial<Config> = {}) {
  const userConfig = { ...defaultConfig, ...config }

  validatePositiveInteger(userConfig.rootValue, 'rootValue')
  validatePositiveInteger(userConfig.unitPrecision, 'unitPrecision')
  validateIsNumber(userConfig.rootValue, 'rootValue')
  validateIsNumber(userConfig.unitPrecision, 'unitPrecision')
  validateIsNumber(userConfig.minValue, 'minValue')
  validateIsArray(userConfig.propList, 'propList')
  validateIsArray(userConfig.ignoreSelectors, 'ignoreSelectors')
  validateIsBoolean(userConfig.mediaQuery, 'mediaQuery')

  const shouldConvertProperty = createPropertyMatcher(userConfig.propList)
  const shouldIgnoreSelector = createSelectorMatcher(userConfig.ignoreSelectors)

  const walkAndConvert: (node: unknown) => boolean = createPxToRemWalker({
    rootValue: userConfig.rootValue,
    unitPrecision: userConfig.unitPrecision,
    minValue: userConfig.minValue
  })

  const usedCustomProps = new Set<string>()
  const cache = new Map<string, DeclarationLike>()
  const ignoreContextStack: boolean[] = []

  const MediaQuery = (query: MediaQueryLike) => {
    if (!userConfig.mediaQuery) return undefined

    const changed = walkAndConvert(query.condition)
    if (!changed) return

    return query
  }

  // Pre-scan once (before declaration visitors mutate anything)
  let scanned = false
  const StyleSheet = (sheet: StyleSheetLike) => {
    if (!scanned) {
      collectUsedCustomPropsInAst(sheet, shouldConvertProperty, usedCustomProps, {
        shouldIgnoreSelector
      })
      scanned = true
    }
    return undefined
  }

  const Rule = (rule: RuleLike) => {
    const parentIgnored = ignoreContextStack[ignoreContextStack.length - 1] === true
    const currentIgnored = parentIgnored || hasIgnoredSelectorInRule(rule, shouldIgnoreSelector)
    ignoreContextStack.push(currentIgnored)
    return undefined
  }

  const RuleExit = () => {
    ignoreContextStack.pop()
    return undefined
  }

  const Declaration = new Proxy({} as Record<string, DeclarationLike>, {
    get(_, prop: string | symbol): DeclarationLike | undefined {
      if (typeof prop !== 'string') return undefined

      let handler = cache.get(prop)
      if (!handler) {
        const created: DeclarationLike = (value) => {
          const ignoreCurrentDeclaration = ignoreContextStack[ignoreContextStack.length - 1] === true
          if (ignoreCurrentDeclaration) return undefined

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

  return { MediaQuery, StyleSheet, Rule, RuleExit, Declaration }
}
