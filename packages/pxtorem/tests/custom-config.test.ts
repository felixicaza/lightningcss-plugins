import { describe, expect, it } from 'vitest'
import { composeVisitors, transform } from 'lightningcss'

import pxtorem from '../src/index'

describe('custom configs', () => {
  it('should handle custom configuration', () => {
    const css = 'div { margin: 16px; font-size: 24px; } .foo { padding: 8px; line-height: 30px; word-spacing: 5px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ rootValue: 8, unitPrecision: 2, minValue: 10 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should use custom unitPrecision', () => {
    const css = 'div { font-size: 43.3398589px; }'

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
    const css = 'div { margin: 32px; font-size: 64px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ rootValue: 32 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle minimum positive value', () => {
    const css = 'div { margin: 30px; font-size: 60px; } .foo { padding: 8px; line-height: 16px; }'

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
    const css = 'div { margin: -5px; font-size: -10px; } .foo { top: -20px; line-height: -40px; }'

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
    const css = 'div { margin: 0.55px; font-size: 0.55px; } .foo { top: 0.25px; line-height: 0.25px; }'

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
    const css = 'div { margin: 0px; font-size: 0px; } .foo { padding: 10px; line-height: 20px; } .bar { left: 0.25px; } .baz { top: -0.55px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ minValue: 0 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle custom propList', () => {
    const css = 'div { margin: 16px; padding: 8px; font-size: 24px; line-height: 30px; letter-spacing: 5px; word-spacing: 10px; width: 100px; height: 50px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ propList: ['margin', 'padding'] })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle all props', () => {
    const css = 'div { margin: 16px; padding: 8px; font-size: 24px; line-height: 30px; letter-spacing: 5px; word-spacing: 10px; width: 100px; height: 50px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ propList: ['*'] })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle pattern for props', () => {
    const css = 'div { margin-top: 16px; margin-bottom: 17px; margin-right: 18px; margin-left: 19px; padding-top: 8px; padding-bottom: 9px; padding-left: 10px; padding-right: 11px; font-size: 24px; line-height: 30px; letter-spacing: 5px; word-spacing: 10px; width: 100px; height: 50px; background-position-y: 100px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ propList: ['margin*', /^padding/, '*position*'] })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle custom ignoreSelectors', () => {
    const css = 'div { margin: 16px; padding: 8px; font-size: 24px; line-height: 30px; letter-spacing: 5px; word-spacing: 10px; width: 100px; height: 50px; } .foo { margin: 15px; padding: 10px; font-size: 20px; line-height: 32px; letter-spacing: 6px; word-spacing: 8px; width: 100px; height: 50px; } #app { margin: 14px; padding: 9px; font-size: 22px; line-height: 28px; letter-spacing: 4px; word-spacing: 12px; width: 100px; height: 50px; } #bar { margin: 13px; padding: 7px; font-size: 26px; line-height: 26px; letter-spacing: 7px; word-spacing: 9px; width: 100px; height: 50px; } body { margin: 12px; padding: 6px; font-size: 28px; line-height: 24px; letter-spacing: 8px; word-spacing: 7px; width: 100px; height: 50px; } .body { margin: 11px; padding: 5px; font-size: 30px; line-height: 22px; letter-spacing: 9px; word-spacing: 6px; width: 100px; height: 50px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ ignoreSelectors: ['foo', 'bar', /^body/] })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle negation patterns', () => {
    const css = 'div { margin: 16px; padding: 8px; font-size: 24px; line-height: 30px; letter-spacing: 5px; word-spacing: 10px; width: 100px; height: 50px; background-position-y: 100px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ propList: ['*', '!font-size', '!line-*', '!*position*'] })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should throw error for negative rootValue', () => {
    expect(() => pxtorem({ rootValue: -1 })).toThrow('Invalid rootValue: must not be negative.')
  })

  it('should throw error for negative unitPrecision', () => {
    expect(() => pxtorem({ unitPrecision: -1 })).toThrow('Invalid unitPrecision: must not be negative.')
  })
})
