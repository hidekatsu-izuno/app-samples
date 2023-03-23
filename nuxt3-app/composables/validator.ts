export const ValidatorKey: InjectionKey<Validator> = Symbol.for("ValidatorKey")

declare type ValidationResult = {
  name: string
  value: any
} | undefined
declare type ValidationListener = () => ValidationResult

export class Validator {
  private validateListeners = new Array<ValidationListener>()

  on(event: "validate", listener: ValidationListener) {
    if (event === "validate") {
      this.validateListeners.push(listener)
    }
  }

  validate() {
    const results: Record<string, any> = {}
    for (const listener of this.validateListeners) {
      const result = listener()
      if (result) {
        results[result.name] = result.value
      } else {
        return
      }
    }
    return results
  }
}

export function useValidator() {
  return new Validator()
}
