import { describe, expect, it } from 'vitest'
import { composeVisitors, transform } from 'lightningcss'
import pxtorem from '../src/index'
import { validatePositiveInteger } from '../src/utils/errorHandler'

describe('pxtorem plugin', () => {
  it('should convert pixel to rem using default configuration', () => {
    const css = 'div { margin: 16px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should not convert other units', () => {
    const css = 'div { margin: 1em; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should convert pixel to rem in media queries', () => {
    const css = '@media (min-width: 768px) { div { margin: 16px; } }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should convert pixel to rem in keyframes', () => {
    const css = '@keyframes fadeIn { from { margin: 16px; } to { margin: 32px; } }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should convert pixel to rem in custom properties', () => {
    const css = ':root { --margin: 16px; } div { margin: var(--margin); }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle multiple pixel values', () => {
    const css = 'div { margin: 16px 32px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle nested selectors', () => {
    const css = 'div { & > span { margin: 16px; } }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle float pixel units', () => {
    const css = 'div { margin: 43.3398589px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle custom configuration', () => {
    const css = 'div { margin: 16px; } .foo { padding: 8px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ rootValue: 8, unitPrecision: 2, minValue: 10 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle custom configuration with unitPrecision', () => {
    const css = 'div { margin: 43.3398589px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ unitPrecision: 2 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should use custom rootValue', () => {
    const css = 'div { margin: 32px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ rootValue: 32 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle extreme pixel values', () => {
    const css = 'div { margin: 10000px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle very small pixel values', () => {
    const css = 'div { margin: 0.001px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle minimum positive value', () => {
    const css = 'div { margin: 30px; } .foo { padding: 8px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ minValue: 10 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle minimum negative value', () => {
    const css = 'div { margin: -5px; } .foo { top: -20px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ minValue: -10 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle minimum float value', () => {
    const css = 'div { margin: 0.55px; } .foo { top: 0.25px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ minValue: 0.5 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle minimum zero value', () => {
    const css = 'div { margin: 0px; } .foo { padding: 10px; } .bar { left: 0.25px; } .baz { top: -0.55px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ minValue: 0 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should throw error for negative rootValue', () => {
    expect(() => pxtorem({ rootValue: -1 })).toThrowError('Invalid rootValue: must not be negative.')
  })

  it('should throw error for negative unitPrecision', () => {
    expect(() => pxtorem({ unitPrecision: -1 })).toThrowError('Invalid unitPrecision: must not be negative.')
  })
})

describe('validatePositiveInteger', () => {
  it('should throw error for undefined value', () => {
    expect(() => validatePositiveInteger(undefined, 'rootValue')).toThrowError('Invalid rootValue: must be a valid number.')
  })

  it('should throw error for NaN value', () => {
    expect(() => validatePositiveInteger(NaN, 'rootValue')).toThrowError('Invalid rootValue: must be a valid number.')
  })

  it('should throw error for negative value', () => {
    expect(() => validatePositiveInteger(-1, 'rootValue')).toThrowError('Invalid rootValue: must not be negative.')
  })

  it('should throw error for decimal value', () => {
    expect(() => validatePositiveInteger(1.5, 'rootValue')).toThrowError('Invalid rootValue: must not be a decimal.')
  })

  it('should pass for valid integer value', () => {
    expect(() => validatePositiveInteger(1, 'rootValue')).not.toThrow()
  })
})
