'use client';
import {
  Bell,
  Book,
  Home,
  LineChart,
  Package,
  Package2,
  Users,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

export default function Sidebar() {
  const [activeLink, setActiveLink] = useState("/user/courses");

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span>User Dashboard</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {/** Dashboard link */}
            <Link
              href="/admin"
              onClick={() => setActiveLink("/admin")}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeLink === "/admin"
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            {/** My Courses link */}
            <Link
              href="/admin/categories"
              onClick={() => setActiveLink("/admin/categories")}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeLink === "/admin/categories"
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Book className="h-4 w-4" />
              Item Category
            </Link>
            {/** Courses link */}
            <Link
              href="/admin/items"
              onClick={() => setActiveLink("/admin/items")}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeLink === "/admin/items"
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Package className="h-4 w-4" />
              Items
            </Link>
            {/** Profile link */}
            <Link
              href="/user/profile"
              onClick={() => setActiveLink("/user/profile")}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                activeLink === "/user/profile"
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Users className="h-4 w-4" />
              Profile
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4 text-center">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </aside>
  );
}
