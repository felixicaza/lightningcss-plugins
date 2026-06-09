import { describe, expect, it } from 'vitest'
import { composeVisitors, transform } from 'lightningcss'

import pxtorem from '../src/index'

describe('pxtorem plugin', () => {
  it('should convert pixel to rem using default configuration', () => {
    const css = 'div { margin: 16px; font-size: 24px; }'

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
    const css = 'div { margin: 1em; width: 100%; height: 50vh; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should convert pixel to rem inside media queries', () => {
    const css = '@media (min-width: 768px) { div { margin: 16px; font-size: 24px; } }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should convert pixel to rem inside keyframes', () => {
    const css = '@keyframes fadeIn { from { margin: 16px; font-size: 24px; } to { margin: 32px; font-size: 48px; } }'

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
    const css = ':root { --m: 16px; --fs: 24px; --lh: 30px; } div { margin: var(--m); font-size: var(--fs); line-height: var(--lh); }'

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
    const css = 'div { margin: 16px 32px; font: italic small-caps bold 15px/30px Georgia, serif; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle css nesting', () => {
    const css = 'div { & > span { margin: 16px; font-size: 24px; } }'

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
    const css = 'div { font-size: 43.3398589px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })

  it('should handle extreme pixel values', () => {
    const css = 'div { margin: 10000px; font-size: 20000px; }'

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
    const css = 'div { margin: 0.001px; font-size: 0.002px; }'

    const output = transform({
      filename: 'input.css',
      code: Buffer.from(css),
      minify: false,
      sourceMap: false,
      visitor: composeVisitors([pxtorem()])
    }).code.toString()

    expect(output).toMatchSnapshot()
  })
})
