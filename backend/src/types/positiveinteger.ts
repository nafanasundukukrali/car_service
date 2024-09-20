export type PositiveInteger = number & { __isPositiveInteger: true };

export function createPositiveInteger(value: number): PositiveInteger {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Value must be a positive integer');
    }
    return value as PositiveInteger;
  }
  