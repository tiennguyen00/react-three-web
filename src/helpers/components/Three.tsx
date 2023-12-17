'use client'

import { r3f } from '@/helpers/global'
import { PropsWithChildren } from 'react'

export const Three = ({ children }: PropsWithChildren) => {
  return <r3f.In>{children}</r3f.In>
}
