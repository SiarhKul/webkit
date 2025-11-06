import { z } from 'zod'
import { Roles } from '../../types/enums/index'

export const zUserRequest = z.object({
  firstName: z.string().max(255, 'Too long'),
  lastName: z.string().max(255, 'Too long'),
  email: z.string().email('Must be email'),
  password: z.string().min(5, 'Must be more than 8'),
  role: z.nativeEnum(Roles),
})
