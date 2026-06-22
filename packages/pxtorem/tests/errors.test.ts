import { describe, expect, it } from 'vitest'

import { validateIsArray, validatePositiveInteger, validateIsNumber } from '../src/utils/errorHandler'

describe('validate errors', () => {
  it('`propList` should throw error for non-array value', () => {
    // @ts-expect-error - Testing non-array value
    expect(() => validateIsArray('not an array', 'propList')).toThrow('Invalid propList: must be an array of strings or RegExp.')
  })

  it('`propList` should pass for valid array value', () => {
    expect(() => validateIsArray(['font-size', /line-height/], 'propList')).not.toThrow()
  })

  it('`ignoreSelectors` should throw error for non-array value', () => {
    // @ts-expect-error - Testing non-array value
    expect(() => validateIsArray('not an array', 'ignoreSelectors')).toThrow('Invalid ignoreSelectors: must be an array of strings or RegExp.')
  })

  it('`ignoreSelectors` should pass for valid array value', () => {
    expect(() => validateIsArray(['.no-convert', /ignore-this/], 'ignoreSelectors')).not.toThrow()
  })

  it('`rootValue` should throw error for negative value', () => {
    expect(() => validatePositiveInteger(-1, 'rootValue')).toThrow('Invalid rootValue: must not be negative.')
  })

  it('`unitPrecision` should throw error for decimal value', () => {
    expect(() => validatePositiveInteger(1.5, 'unitPrecision')).toThrow('Invalid unitPrecision: must not be a decimal.')
  })

  it('`minValue` should pass for valid integer value', () => {
    expect(() => validatePositiveInteger(1, 'minValue')).not.toThrow()
  })

  it('`rootValue` should throw error for non-number value', () => {
    // @ts-expect-error - Testing non-number value
    expect(() => validateIsNumber('10', 'rootValue')).toThrow('Invalid rootValue: must be a valid number.')
  })

  it('`unitPrecision` should pass for valid number value', () => {
    expect(() => validateIsNumber(1, 'unitPrecision')).not.toThrow()
  })

  it('`rootValue` should pass for valid negative number value', () => {
    expect(() => validateIsNumber(-10, 'rootValue')).not.toThrow()
  })

  it('`minValue` should pass for valid float number value', () => {
    expect(() => validateIsNumber(10.50, 'minValue')).not.toThrow()
  })
})
