import { type LengthValue, type LengthUnit } from 'lightningcss'
import { validatePositiveInteger } from './utils/errorHandler'
import type { Config } from './contracts/config.type'

const defultConfig: Config = {
  rootValue: 16,
  unitPrecision: 4
}

/**
 * Convert pixel units to rem units.
 * @param {Object} config - The configuration object.
 * @param {number} [config.rootValue=16] - The root value for conversion. (default is 16)
 * @param {number} [config.unitPrecision=4] - The decimal precision for the converted value. (default is 4)
 * @returns {Function} `Length` function to convert pixel values to rem values used by LightningCSS.
 */
function pxtorem(config: Partial<Config> = {}) {
  const { rootValue, unitPrecision } = { ...defultConfig, ...config }

  validatePositiveInteger(rootValue, 'rootValue')
  validatePositiveInteger(unitPrecision, 'unitPrecision')

  const toFixed = (value: number, precision: number): number => {
    const factor = Math.pow(10, precision)

    return Math.round(value * factor) / factor
  }

  return {
    Length({ unit, value }: LengthValue): { unit: LengthUnit, value: number } | undefined {
      if (unit === 'px') {
        return { unit: 'rem', value: toFixed(value / rootValue, unitPrecision) }
      }
    }
  }
}

export default pxtorem
