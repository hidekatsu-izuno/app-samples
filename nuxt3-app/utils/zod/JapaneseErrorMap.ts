import { z, ZodErrorMap } from "zod"

export const JapaneseErrorMap: ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "undefined") {
        return { message: "必須入力です。" }
      } else {
        return { message: `${issue.expected}が予想されましたが、実際には${issue.received}でした。` }
      }
    case z.ZodIssueCode.unrecognized_keys:
      return {
        message: `オブジェクトに認識できないキーが含まれています：${issue.keys
          .map((k) => `'${k}'`)
          .join(", ")}`
      }
    case z.ZodIssueCode.invalid_union:
      return { message: `Invalid input` }
    case z.ZodIssueCode.invalid_union_discriminator:
      return {
        message: `Invalid discriminator value. Expected ${issue.options
          .map((val) => (typeof val === "string" ? `'${val}'` : val))
          .join(" | ")}`
      }
    case z.ZodIssueCode.invalid_enum_value:
      return {
        message: `次の値のいずれかを入力してください：${issue.options
          .map((val) => (typeof val === "string" ? `'${val}'` : val))
          .join(" | ")}`
      }
    case z.ZodIssueCode.invalid_arguments:
      return { message: `関数の引数が不正です。` }
    case z.ZodIssueCode.invalid_return_type:
      return { message: `関数の戻り値が不正です。` }
    case z.ZodIssueCode.invalid_date:
      return { message: `日付の入力に誤りがあります。` }
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "url") {
        return { message: `URLの書式に誤りがあります。` }
      } else if (issue.validation === "email") {
        return { message: `メールアドレスの書式に誤りがあります。` }
      } else if (issue.validation !== "regex") {
        return { message: `Invalid ${issue.validation}` }
      } else {
        return { message: "入力に誤りがあります。" }
      }
    case z.ZodIssueCode.too_small:
      if (issue.type === "array") {
        return { message: `${issue.minimum}${issue.inclusive ? `以上の` : `より大きい`}要素数の配列を指定する必要があります。` }
      } else if (issue.type === "string") {
        return { message: `${issue.minimum}文字${issue.inclusive ? `以上` : `より多く`}入力する必要があります。` }
      } else if (issue.type === "number") {
        return { message: `${issue.minimum}${issue.inclusive ? `以上の` : `より大きい`}値を入力する必要があります。` }
      } else {
        return { message: "Invalid input" }
      }
    case z.ZodIssueCode.too_big:
      if (issue.type === "array") {
        return { message: `${issue.maximum}${issue.inclusive ? `以下の` : `未満の`}要素数の配列を指定する必要があります。` }
      } else if (issue.type === "string") {
        return { message: `${issue.maximum}文字${issue.inclusive ? `以下で` : `より少なく`}入力する必要があります。` }
      } else if (issue.type === "number") {
        return { message: `${issue.maximum}${issue.inclusive ? `以下の` : `未満の`}値を入力する必要があります。` }
      } else {
        return { message: "Invalid input" }
      }
    case z.ZodIssueCode.custom:
      return { message: `Invalid input` }
    case z.ZodIssueCode.invalid_intersection_types:
      return { message: `Intersection results could not be merged` }
    case z.ZodIssueCode.not_multiple_of:
      return { message: `数値は${issue.multipleOf}の倍数である必要があります。` }
  }

  return { message: ctx.defaultError }
}
