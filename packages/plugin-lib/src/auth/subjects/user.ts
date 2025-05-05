import { z } from 'zod'

import { userSchema } from '../models/user'

export const userSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('change_password'),
  ]),
  z.literal('User', userSchema),
])

export type UserSubject = z.infer<typeof userSubject>
