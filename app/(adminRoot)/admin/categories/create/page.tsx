"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateCategoryPage() {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getAuthToken = (): string | null => {
    return localStorage.getItem("authToken");
  };

  const handleCreate = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      setLoading(true);

      const response = await fetch("http://localhost:8000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        window.location.href = "/login";
        throw new Error("Failed to create category");
      }
      setName(""); 
      toast.success("Category added successfully!");
      router.push("/admin/categories"); 
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
        <h1 className="text-lg font-semibold md:text-2xl">Create Category</h1>
      </div>
      <div className="p-10 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Category Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <Button onClick={handleCreate} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </main>
  );
}
