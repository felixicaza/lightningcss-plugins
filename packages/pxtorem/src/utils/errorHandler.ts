export function validateIsArray(value: (string | RegExp)[], name: string) {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid ${name}: must be an array of strings or RegExp.`)
  }
}

export function validateIsBoolean(value: unknown, name: string): void {
  if (typeof value !== 'boolean') {
    throw new TypeError(`Invalid ${name}: must be a boolean.`)
  }
}

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
