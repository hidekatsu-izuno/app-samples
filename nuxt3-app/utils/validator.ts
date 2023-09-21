import { z } from "zod"

type JSONValue = null
  | string
  | number
  | boolean
  | JSONArray
  | JSONObject;

interface JSONArray extends Array<JSONValue> {
}

interface JSONObject extends Record<string, JSONValue> {
}

type UnvalidatedJSONValue = null | undefined
  | string
  | number
  | boolean
  | UnvalidatedJSONArray
  | UnvalidatedJSONObject
  | Ref<any>;

interface UnvalidatedJSONArray extends Array<UnvalidatedJSONValue> {
}

interface UnvalidatedJSONObject extends Record<string, UnvalidatedJSONValue> {
}

export function validate(target: undefined): Promise<undefined>;
export function validate(target: null): Promise<null>;
export function validate(target: string): Promise<string>;
export function validate(target: number): Promise<number>;
export function validate(target: Ref<any>): Promise<string | number | null>;
export function validate(target: UnvalidatedJSONArray): Promise<JSONArray>;
export function validate(target: UnvalidatedJSONObject): Promise<JSONObject>;
export function validate(target: UnvalidatedJSONValue): Promise<JSONValue>;
export async function validate(target: UnvalidatedJSONValue) {
  const context = { success: true }
  const result = await validateInternal(context, target)
  if (!context.success) {
    throw new BusinessError("入力に誤りがあります。")
  }
  return result
}

async function validateInternal(context: { success: boolean }, target: UnvalidatedJSONValue) {
  if (target == null) {
    return target
  } else if (isRef(target)) {
    const func = (target.value as any)?.validate
    if (typeof func === "function") {
      try {
        return await func.call(target.value)
      } catch (err) {
        context.success = false
        return null
      }
    }
    return undefined
  }

  const type = typeof target
  if (type === "string" || type === "number" || type === "boolean") {
    return target
  } else if (Array.isArray(target)) {
    const varray = target as UnvalidatedJSONArray
    const array = new Array<JSONValue>(varray.length)
    for (let i = 0; i < target.length; i++) {
      const item = await validateInternal(context, varray[i])
      if (item !== undefined) {
        array[i] = item
      } else {
        array[i] = null
      }
    }
    return array
  } else {
    const vobj = target as UnvalidatedJSONObject
    const obj = {} as JSONObject
    for (const key in vobj) {
      const item = await validateInternal(context, vobj[key])
      if (item !== undefined) {
        obj[key] = item
      }
    }
    return obj
  }
}

export function decimalCheck(precision: number, scale: number = 0) {
  return (arg: number, ctx: z.RefinementCtx) => {
    if (!Number.isFinite(arg)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "入力に誤りがあります。",
      })
      return
    }

    const m = /^[+-]?([0-9]+)(?:[.][0-9]*)?$/.exec(formatNumber(arg))
    if (!m) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "入力に誤りがあります。",
      })
      return
    }

    const ipart = Math.max(m[1].replace(/^0+/, "").length, 1)
    const fpart = Math.max((m[2] ?? "").replace(/0+$/, "").length, 0)

    if (ipart + fpart > precision) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: scale > 0
          ? `整数部${precision - scale}桁以内、小数部${scale}桁以内の数値を入力してください。`
          : `${precision}桁以内の整数を指定してください。`,
      })
      return
    }

    if (scale > 0 && fpart > scale) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `整数部${precision - scale}桁以内、小数部${scale}桁以内の数値を入力してください。`,
      })
    }
  }
}
