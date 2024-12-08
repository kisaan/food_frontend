import MobileNav from "@/components/ui/mobile-nav";
import Sidebar from "../../components/ui/sidebar";
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import React from 'react'
import { ModeToggle } from '@/components/ui/mode-toggle';
import { LogoutToggle } from '@/components/ui/logout-toggle';

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <div className='w-full flex-1'>
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder="search courses...." className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3" />
                            </div>
                        </form>
                    </div>
                    <LogoutToggle />
                    <ModeToggle />
                    <MobileNav />
                </header>
                {children}
            </div>
        </div>
    );
}