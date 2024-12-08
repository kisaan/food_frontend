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
import { ToastContainer } from "react-toastify";

interface Item {
    id: string;
    name: string | null;
    price: string | null;
    description: string | null;
    image: string | null;
}

export default function UsersPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const fetchToken = () => {
        return localStorage.getItem("authToken") || "";
    };

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const token = fetchToken();

                const response = await fetch("http://localhost:8000/api/items", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    window.location.href = "/login";
                    throw new Error("Failed to fetch items");
                }

                const data = await response.json();
                console.log('kishan Items........', data);
                setItems(data?.data || []);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleDelete = async (itemId: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            const originalItems = items;
            setItems(items.filter((item) => item.id !== itemId));

            try {
                const token = fetchToken();

                const response = await fetch(`http://localhost:8000/api/items/${itemId}`, {
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
                setItems(originalItems);
                toast.error("Failed to delete item");
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
                    <h1 className="text-lg font-semibold md:text-2xl">Manage Items</h1>
                    <Button onClick={() => router.push('/admin/items/create')} className='mt-4'>Create +</Button>
                </div>
                <div className="flex items-center justify-center p-2 rounded-lg border border-dashed shadow-sm">
                    <Table>
                        <TableCaption>A List Of Items Details.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Id</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(items) && items.length > 0 ? (
                                items.map((item) => (
                                    <TableRow key={item.id || "unknown"}>
                                        <TableCell className="font-medium">
                                            {item.id ? parseInt(String(item.id).replace(/\D/g, ""), 10) || "-" : "-"}
                                        </TableCell>
                                        <TableCell><img
                                            alt={item.name ?? "-"}
                                            src={`http://localhost:8000/storage/${item.image}`}
                                            className="inline-block size-10 rounded-full ring-2 ring-white"
                                        /></TableCell>
                                        <TableCell>{item.name ?? "-"}</TableCell>
                                        <TableCell>{item.name ?? "-"}</TableCell>
                                        <TableCell>{item.description ?? "-"}</TableCell>
                                        <TableCell>{item.price ?? "-"}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                onClick={() => router.push(`/admin/items/edit/${item.id}`)}
                                                size="sm"
                                                className="m-1"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleDelete(item.id)}
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
                                        No items available.
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
