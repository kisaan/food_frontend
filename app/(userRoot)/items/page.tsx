import React from 'react'
import Items from '@/components/items'
import Filter from '@/components/filter'
import Link from 'next/link'

const page = () => {
  return (
    <div className="bg-white">
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
            <Link href="/" className="text-base/7 font-semibold text-indigo-600">Home</Link>
            <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
               A food ordering system is an application
            </p>
        </div>
        <Filter/>
      <Items/>
    </div>
    </div>
  )
}

export default page