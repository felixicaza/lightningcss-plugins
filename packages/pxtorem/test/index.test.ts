import { describe, expect, it } from 'vitest'
import { composeVisitors, transform } from 'lightningcss'
import pxtorem from '../dist/index'

describe('pxtorem plugin', () => {
  it('should convert pixel to rem', () => {
    const css = 'div { margin: 16px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: true,
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
      minify: true,
      sourceMap: false,
      drafts: {
        customMedia: true
      },
      nonStandard: {
        deepSelectorCombinator: true
      },
      errorRecovery: true,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should convert pixel to rem in media queries', () => {
    const css = '@media (min-width: 768px) { div { margin: 16px; } }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: true,
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
      minify: true,
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
      minify: true,
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
      minify: true,
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
      minify: true,
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
      minify: true,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle custom configuration', () => {
    const css = 'div { margin: 16px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: true,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ rootValue: 8, unitPrecision: 2 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle custom configuration with unitPrecision', () => {
    const css = 'div { margin: 43.3398589px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: true,
      sourceMap: false,
      visitor: composeVisitors([pxtorem({ unitPrecision: 2 })])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })
})
