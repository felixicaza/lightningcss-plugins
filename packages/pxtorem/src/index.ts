import { type LengthValue, type LengthUnit } from 'lightningcss'

export default () => {
  return {
    Length({ unit, value }: LengthValue): { unit: LengthUnit, value: number } | undefined {
      if (unit === 'px') {
        return { unit: 'rem', value: value / 16 }
      }
    }
  }
}
