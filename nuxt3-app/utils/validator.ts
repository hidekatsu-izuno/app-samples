export declare type ValidatorListener = {
  name: string,
  listener: () => any,
}

export class Validator {
  private listeners: Record<string, Array<ValidatorListener>> = {
    validate: [],
    clear: []
  }

  on(event: "validate" | "clear", name: string, listener: () => any): void {
    this.listeners[event].push({
      name,
      listener
    })
  }

  validate(name?: string) {
    const results: Record<string, any> = {}
    let hasError = false
    for (const item of this.listeners.validate) {
      if (!name || item.name === name) {
        const result = item.listener()
        if (result !== undefined) {
          results[item.name] = result
        } else {
          hasError = true
        }
      }
    }
    if (hasError) {
      return
    }
    return results
  }

  clear(name?: string) {
    for (const item of this.listeners.clear) {
      if (!name || item.name === name) {
        item.listener()
      }
    }
  }
}

export const ValidatorKey: InjectionKey<Validator> = Symbol.for("ValidatorKey")
