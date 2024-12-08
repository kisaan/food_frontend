"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import Link from 'next/link'

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    [x: string]: any;
}

const Page = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParams();
    const id = params?.id as string;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/user/items/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Product not found");
                    } else {
                        throw new Error(`Error fetching item: ${response.statusText}`);
                    }
                }
                const details = await response.json();
                setProduct(details.data);
                //console.log('kishan mst...',data.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unexpected error occurred");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <p className='text-center p-20'>Loading...</p>;
    if (error) return <p className='text-center p-20 text-red-500'>{error}</p>;

    return (
        <div className="bg-white">
            <div className="mb-8 lg:text-center">
                <Link
                    href="/items"
                    className="inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                    &larr; Back to Items
                </Link>
            </div>
            <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                <div className="grid gap-4 sm:gap-6 lg:gap-8">
                    <img
                        alt={product?.name}
                        src={`http://localhost:8000/storage/${product?.image}`}
                        className="w-full rounded-lg bg-gray-100"
                    />

                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product?.name}</h2>
                    <p className="mt-4 text-gray-500">{product?.description}</p>
                    <p className="mt-2 text-lg font-semibold text-gray-800">
                        Category: {product?.category?.name || 'Uncategorized'}
                    </p>
                    <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                        <div className="border-t border-gray-200 pt-4">
                            <dt className="font-medium text-gray-900">Price</dt>
                            <dd className="mt-2 text-sm text-gray-500">${product?.price}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Page;
