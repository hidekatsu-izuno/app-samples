import { z } from "zod"

export const EmailSchema = z.string().email().max(256)
export const UserPasswordSchema = z.string().min(8)
export const UserNameSchema = z.string().max(1024)
