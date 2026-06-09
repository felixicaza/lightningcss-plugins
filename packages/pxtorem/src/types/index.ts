import type { CustomProperty, Declaration, UnparsedProperty, StyleSheet } from 'lightningcss'

export type StyleSheetLike = StyleSheet
export type UnparsedLike = UnparsedProperty
export type CustomPropertyLike = CustomProperty
export type CustomDeclarationLike = Extract<Declaration, { property: 'custom' }>
export type DeclarationLike = (value: Declaration) => Declaration | undefined

export type MutableNode = Record<string, unknown>

export interface PropRule {
  negate: boolean;
  test: (property: string) => boolean;
}

export interface Options {
  /**
   * Root font size used to convert px to rem.
   * @default 16
   */
  rootValue: number

  /**
   * Number of decimal places in generated rem values.
   * @default 4
   */
  unitPrecision: number

  /**
   * Minimum pixel value to convert.
   * @default 0
   */
  minValue: number
}

export interface Config extends Options {
  /**
   * CSS properties eligible for px to rem conversion.
   * Supports property names and regular expressions.
   * @see https://github.com/felixicaza/lightningcss-plugins/blob/main/packages/pxtorem#options-object--opcional
   * @default ['font', 'font-size', 'line-height', 'letter-spacing', 'word-spacing']
   */
  propList: (string | RegExp)[]
}
