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

type VJSONValue = null | undefined
  | string
  | number
  | boolean
  | VJSONArray
  | VJSONObject
  | Ref<any>;

interface VJSONArray extends Array<VJSONValue> {
}

interface VJSONObject extends Record<string, VJSONValue> {
}

export function validate(target: undefined): Promise<undefined>;
export function validate(target: null): Promise<null>;
export function validate(target: string): Promise<string>;
export function validate(target: number): Promise<number>;
export function validate(target: Ref<any>): Promise<string | number | null>;
export function validate(target: VJSONArray): Promise<JSONArray>;
export function validate(target: VJSONObject): Promise<JSONObject>;
export function validate(target: VJSONValue): Promise<JSONValue>;
export async function validate(target: VJSONValue) {
  const context = { success: true }
  const result = await validateInternal(context, target)
  if (!context.success) {
    throw createError({ message: "入力に誤りがあります。", statusCode: 400 })
  }
  return result
}

async function validateInternal(context: { success: boolean }, target: VJSONValue) {
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
    const varray = target as VJSONArray
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
    const vobj = target as VJSONObject
    const obj = {} as JSONObject
    for (let key in vobj) {
      const item = await validateInternal(context, vobj[key])
      if (item !== undefined) {
        obj[key] = item
      }
    }
    return obj
  }
}

export interface Schema {
  get required(): boolean
}

export class ObjectSchema implements Schema {
  constructor(
    public required: boolean,
    public type: Record<string, Schema> | undefined,
    public strict: boolean,
  ) {

  }
}

export declare type ArraySchema = Schema & {
  type?: Schema[],
  minLength: number,
  maxLength?: number,
}

export declare type StringSchema = Schema &  {
  type?: "email" | "url" | "tel" | "date",
  format?: string,
  minLength?: number,
  maxLength?: number,
  in?: string[],
}

export declare type NumberSchema = Schema &  {
  type?: "integer" | "int8" | "uint8" | "int16" | "uint16" | "int32" | "uint32",
  precision?: number,
  scale?: number,
  gt?: number,
  ge?: number,
  lt?: number,
  le?: number,
  in?: number[],
}

export declare type BooleanSchema = Schema & {
}

export const schema = {
  object(options?: {
    required?: boolean,
    type?: Record<string, Schema>,
    strict?: boolean,
  }): ObjectSchema {
    return {
      required: options?.required ?? false,
      type: options?.type,
      strict: options?.required ?? false,
    }
  },

  array(options?: {
    schema?: Schema,
    required: boolean,
    minLength?: number,
    maxLength?: number
  }): Schema {
    return {} as Schema
  },

  string(options?: {
    required: boolean,
    minLength?: number,
    maxLength?: number,
  }): Schema {
    return {} as Schema
  },

  number(options?: {
    required: boolean,
    minValue?: number,
    maxValue?: number,
  }): Schema {
    return {} as Schema
  },

  boolean(options?: {
    required: boolean,
  }): Schema {
    return {} as Schema
  },
}
