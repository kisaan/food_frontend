"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
//import { CategoryCreate } from "@/components/categoryCreate";
import { ToastContainer } from "react-toastify";

interface Category {
    id: string;
    name: string | null;
}

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchToken = () => {
        return localStorage.getItem("authToken") || "";
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const token = fetchToken();

                const response = await fetch("http://localhost:8000/api/categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    window.location.href = "/login";
                    throw new Error("Failed to fetch categories");
                }

                const data = await response.json();
                console.log('kishan Cate........', data);
                setCategories(data?.data || []);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (categoryId: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            const originalCategories = categories;
            setCategories(categories.filter((category) => category.id !== categoryId));

            try {
                const token = fetchToken();

                const response = await fetch(`http://localhost:8000/api/categories/${categoryId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to delete category");
                }

                toast.success("Category deleted successfully");
            } catch (error) {
                setError(error instanceof Error ? error.message : "An unknown error occurred");
                setCategories(originalCategories);
                toast.error("Failed to delete category");
            }
        }
    };

    if (loading) return <p className="text-center p-20">Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <>
         <ToastContainer />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Manage Categories</h1>
                <Button onClick={() => router.push('/admin/categories/create')} className='mt-4'>Create +</Button>
            </div>
            <div className="flex items-center justify-center p-2 rounded-lg border border-dashed shadow-sm">
                <Table>
                    <TableCaption>A List Of Categories Details.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Id</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category) => (
                                <TableRow key={category.id || "unknown"}>
                                    <TableCell className="font-medium">
                                        {category.id ? parseInt(String(category.id).replace(/\D/g, ""), 10) || "-" : "-"}
                                    </TableCell>
                                    <TableCell>{category.name ?? "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
                                            size="sm"
                                            className="m-1"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDelete(category.id)}
                                            size="sm"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    No categories available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={8}></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </main>
        </>
    );
}
