import { type LengthValue, type LengthUnit } from 'lightningcss'
import { type Config } from './contracts/config.type'

import { validateIsNumber, validatePositiveInteger } from './utils/errorHandler'

const defultConfig: Config = {
  rootValue: 16,
  unitPrecision: 4,
  minValue: 0
}

/**
 * Convert pixel units to rem units.
 * @param {Object} config - The configuration object.
 * @param {number} [config.rootValue=16] - The root value for conversion. (default is 16)
 * @param {number} [config.unitPrecision=4] - The decimal precision for the converted value. (default is 4)
 * @param {number} [config.minValue=0] - The minimum value to be converted. (default is 0)
 * @returns {Function} `Length` function to convert pixel values to rem values used by LightningCSS.
 */
function pxtorem(config: Partial<Config> = {}) {
  const { rootValue, unitPrecision, minValue } = { ...defultConfig, ...config }

  validatePositiveInteger(rootValue, 'rootValue')
  validatePositiveInteger(unitPrecision, 'unitPrecision')
  validateIsNumber(rootValue, 'rootValue')
  validateIsNumber(unitPrecision, 'unitPrecision')
  validateIsNumber(minValue, 'minValue')

  const toFixed = (value: number, precision: number): number => {
    const factor = Math.pow(10, precision)

    return Math.round(value * factor) / factor
  }

  return {
    Length({ unit, value }: LengthValue): { unit: LengthUnit, value: number } {
      if (unit === 'px' && value >= minValue) {
        return { unit: 'rem', value: toFixed(value / rootValue, unitPrecision) }
      } else {
        return { unit, value }
      }
    }
  }
}

export default pxtorem
