export function validatePositiveInteger(value: number | undefined, name: string) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`Invalid ${name}: must be a valid number.`)
  }

  if (value < 0) {
    throw new Error(`Invalid ${name}: must not be negative.`)
  }

  if (!Number.isInteger(value)) {
    throw new Error(`Invalid ${name}: must not be a decimal.`)
  }
}
