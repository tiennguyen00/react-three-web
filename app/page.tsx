'use client'

import Link from 'next/link'

export default function Page() {
  return (
    <div className='flex h-full w-full items-center justify-center space-x-4 bg-slate-600'>
      <Link href='/template' className='bg-red-200 px-4 py-2'>
        <p className='font-bold'>Template</p>
      </Link>
      <Link href='/scroll-with-theatre' className='bg-red-200 px-4 py-2'>
        <p className='font-bold'>Scroll with theatre</p>
      </Link>
      <Link href='/morph-particles' className='bg-red-200 px-4 py-2'>
        <p className='font-bold'>Morph particles</p>
      </Link>
    </div>
  )
}
