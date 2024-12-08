"use client";
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const page = () => {
    const router = useRouter();
    return (
        <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
            <div className='flex items-center'>
                <h1 className='text-lg font-semibold md:text-2xl'>Admin Dashboard</h1>
            </div>
            <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm' x-chunk="dashboard-02-chunk-1">
                <div className='flex flex-col items-center gap-1 text-center'>
                    <div className='text-2xl font-bold tracking-tight'>
                        You have no categories
                    </div>
                    <p className='text-sm text-muted-foreground'>You can start listing as soon as you add a categories</p>
                    <Button onClick={() => router.push('/admin/categories')} className='mt-4'>List Categories</Button>
                </div>
            </div>
        </main>
    )
}
export default page