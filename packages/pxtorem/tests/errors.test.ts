import { describe, expect, it } from 'vitest'

import { validatePositiveInteger, validateIsNumber } from '../src/utils/errorHandler'

describe('validate errors', () => {
  it('should throw error for negative value', () => {
    expect(() => validatePositiveInteger(-1, 'rootValue')).toThrow('Invalid rootValue: must not be negative.')
  })

  it('should throw error for decimal value', () => {
    expect(() => validatePositiveInteger(1.5, 'unitPrecision')).toThrow('Invalid unitPrecision: must not be a decimal.')
  })

  it('should pass for valid integer value', () => {
    expect(() => validatePositiveInteger(1, 'minValue')).not.toThrow()
  })

  it('should throw error for non-number value', () => {
    // @ts-expect-error - Testing non-number value
    expect(() => validateIsNumber('10', 'rootValue')).toThrow('Invalid rootValue: must be a valid number.')
  })

  it('should pass for valid number value', () => {
    expect(() => validateIsNumber(1, 'unitPrecision')).not.toThrow()
  })

  it('should pass for valid negative number value', () => {
    expect(() => validateIsNumber(-10, 'rootValue')).not.toThrow()
  })

  it('should pass for valid float number value', () => {
    expect(() => validateIsNumber(10.50, 'minValue')).not.toThrow()
  })
})
