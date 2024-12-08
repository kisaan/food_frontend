"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Category {
  id: string;
  name: string;
}

export default function EditCategoryPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const getAuthToken = (): string | null => {
    return localStorage.getItem("authToken"); 
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Authentication required. Please log in.");
        }

        const response = await fetch(`http://localhost:8000/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch category data");

        const data = await response.json();
        setCategory(data?.data || []);
        toast.success('category update successful!', {
            position: "top-right",
            autoClose: 1000, 
          });
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!category) return;

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          name: category.name,
        }),
      });

      if (!response.ok) {
        window.location.href = "/login";
        throw new Error("Failed to update category data");
      }
      toast.success("Category updated successfully");
      router.push("/admin/categories");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      toast.error("Failed to update category");
    }
  };

  if (loading) return <p className="text-center p-20">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!category) return <p>No category data found.</p>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Edit Category</h1>
      </div>
      <div className="p-10 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Category Name</label>
            <Input
              value={category.name || ""}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
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
