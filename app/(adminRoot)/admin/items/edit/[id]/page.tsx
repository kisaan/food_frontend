"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Item {
    id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    image: string | File; 
}

export default function EditItemPage() {
    const [item, setItem] = useState<Item | null>(null);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

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
                    throw new Error("Failed to fetch items");
                }

                const data = await response.json();

                setCategories(data?.data || []);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const getAuthToken = (): string | null => {
        return localStorage.getItem("authToken");
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    throw new Error("Authentication required. Please log in.");
                }

                const response = await fetch(`http://localhost:8000/api/items/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch item data");

                const data = await response.json();

                setItem(data?.data || null);

            } catch (error) {
                setError(error instanceof Error ? error.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id]);

    const handleUpdate = async () => {
        if (!item) return;

        try {
            const token = getAuthToken();
            if (!token) {
                toast.error("Authentication required. Please log in.");
                return;
            }

            const formData = new FormData();
            formData.append("name", item.name);
            formData.append("description", item.description);
            formData.append("price", item.price.toString());
            formData.append("category_id", item.category_id);

            if (item.image instanceof File) {
                formData.append("image", item.image);
            }

            const response = await fetch(`http://localhost:8000/api/items/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || "Failed to update item data");
            }

            toast.success("Item updated successfully");
            router.push("/admin/items");
        } catch (error) {
            setError(error instanceof Error ? error.message : "An unknown error occurred");
            toast.error("Failed to update item");
        }
    };


    if (loading) return <p className="text-center p-20">Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!item) return <p>No item data found.</p>;

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Edit Item</h1>
            </div>
            <div className="p-10 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Name</label>
                        <Input
                            value={item.name || ""}
                            onChange={(e) => setItem({ ...item, name: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Description</label>
                        <Input
                            value={item.description || ""}
                            onChange={(e) => setItem({ ...item, description: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Price</label>
                        <Input
                            type="number"
                            value={item.price || ""}
                            onChange={(e) => setItem({ ...item, price: Number(e.target.value) })}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Category</label>
                        <select
                            value={item.category_id || ""}
                            onChange={(e) => setItem({ ...item, category_id: e.target.value })}
                            className="block w-full px-3 py-2 border rounded-md"
                        >
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))
                            ) : (
                                <option value="">No categories available</option>
                            )}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-1 font-semibold">Image</label>
                        {item.image && (
                            <div className="mb-2">
                                <img
                                    src={`http://localhost:8000/storage/${item.image}`}
                                    alt="Current item"
                                    className="h-32 w-32 object-cover rounded-md"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    setItem({ ...item, image: file }); 
                                }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />

                    </div>

                    <Button onClick={handleUpdate} type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </Button>
                </div>
            </div>
        </main>
    );
}
