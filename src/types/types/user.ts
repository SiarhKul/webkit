import { zUserRequest } from '../../sharable/schemas/user'
import { z } from 'zod'

export type TUserRequest = z.infer<typeof zUserRequest>
