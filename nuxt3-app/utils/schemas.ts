import { z } from "zod"

export const PositiveIntSchema = z.number().int().nonnegative()
export const DateSchema = z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
export const TimestampSchema = z.string().datetime()
export const EmailSchema = z.string().email().max(256)

export const UserIdSchema = z.string().length(36)
export const PartialEmailSchema = z.string().max(256)
export const UserPasswordSchema = z.string().min(8)
export const UserNameSchema = z.string().max(1024)
export const CommentSchema = z.string().max(1000)

export const PrecisionSchema = z.number().superRefine(decimalCheck(10, 0))
