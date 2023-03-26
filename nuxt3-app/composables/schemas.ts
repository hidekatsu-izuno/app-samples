import { z } from "zod"

export const UserIdSchema = z.string().nonempty().email().max(256)
export const PasswordSchema = z.string().nonempty().min(8)

export const LoginSchema = z.object({
  userId: UserIdSchema,
  password: PasswordSchema,
})
