import { describe, expect, it } from 'vitest'
import { composeVisitors, transform } from 'lightningcss'
import pxtorem from '../dist/index'

describe('pxtorem plugin', () => {
  it('should convert px to rem', () => {
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

  it('should convert px to rem in media queries', () => {
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

  it('should convert px to rem in keyframes', () => {
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

  it('should convert px to rem in custom properties', () => {
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
})
