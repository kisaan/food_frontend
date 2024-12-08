import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ItemCreate({ onItemAdded }: { onItemAdded: () => void }) {
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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
                    throw new Error("Failed to fetch categories");
                }

                const data = await response.json();
                console.log('lithu Cate........', data);
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const token = getAuthToken();
        if (!token) {
            toast.error("Authentication required. Please log in.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category_id", categoryId);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await fetch("http://localhost:8000/api/items", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized. Please log in again.");
                }
                throw new Error("Failed to create item");
            }
            toast.success("Item added successfully!", {
                position: "top-right",
                autoClose: 1000,
            });
            setName("");
            setDescription("");
            setPrice("");
            setCategoryId("");
            setImage(null);
            onItemAdded();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create +</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Item</DialogTitle>
                        <DialogDescription>
                            Add a new Item. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Price
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category_id" className="text-right">
                                Category
                            </Label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                                className="col-span-3 border rounded-md p-2"
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {Array.isArray(categories) && categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option>No categories available.</option>
                                )}

                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="text-right">
                                Image
                            </Label>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
function setError(arg0: string) {
    throw new Error("");
}

