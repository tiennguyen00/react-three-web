import Link from 'next/link'

const Page = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center space-x-3 bg-black/70'>
      <Link href='/yuri/workshops/1' className='rounded-full bg-black/60 p-2 text-white'>
        1
      </Link>
      <Link href='/yuri/workshops/2' className='rounded-full bg-black/60 p-2 text-white'>
        2
      </Link>
    </div>
  )
}

export default Page
