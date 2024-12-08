"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InsertItemPage() {
  const [item, setItem] = useState({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    image: null as File | null,
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchToken = () => {
    return localStorage.getItem("authToken") || "";
  };

  useEffect(() => {
    const fetchCategories = async () => {
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
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    };

    fetchCategories();
  }, []);

  const handleInsert = async () => {
    try {
      const token = fetchToken();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("name", item.name);
      formData.append("description", item.description);
      formData.append("price", item.price.toString());
      formData.append("category_id", item.category_id);
      if (item.image) {
        formData.append("image", item.image);
      }

      const response = await fetch("http://localhost:8000/api/items", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to insert item");
      }

      toast.success("Item added successfully!");
      router.push("/admin/items");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <ToastContainer />
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Insert Item</h1>
      </div>
      <div className="p-10 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Name</label>
            <Input
              value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Description</label>
            <Input
              value={item.description}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Price</label>
            <Input
              type="number"
              value={item.price}
              onChange={(e) =>
                setItem({ ...item, price: Number(e.target.value) })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Category</label>
            <select
              value={item.category_id}
              onChange={(e) =>
                setItem({ ...item, category_id: e.target.value })
              }
              className="block w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setItem({ ...item, image: e.target.files[0] });
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <Button onClick={handleInsert} type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </Button>
        </div>
      </div>
    </main>
  );
}
