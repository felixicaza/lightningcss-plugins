export function validateIsNumber(value: number, name: string) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`Invalid ${name}: must be a valid number.`)
  }
}

export function validatePositiveInteger(value: number, name: string) {
  if (value < 0) {
    throw new Error(`Invalid ${name}: must not be negative.`)
  }

  if (!Number.isInteger(value)) {
    throw new Error(`Invalid ${name}: must not be a decimal.`)
  }
}
