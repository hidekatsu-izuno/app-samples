import { z } from "zod"

export const EmailSchema = z.string().nonempty().email().max(256)
export const UserPasswordSchema = z.string().nonempty().min(8)
export const UserNameSchema = z.string().nonempty().max(1024)
