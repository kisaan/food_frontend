"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'

interface Product {
    [x: string]: any;
    id: number;
    name: string;
    description: string;
    image: string;
    price: string;
}
const Page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/items');
                if (!response.ok) {
                    throw new Error(`Error fetching products: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Items list test...........', data)
                setProducts(data.items?.data || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);
    return (
        <>
            {loading ? (
                <p className="text-center p-10">Loading Items...</p>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-lg"
                            >
                                <img
                                    alt={product.name}
                                    src={`http://localhost:8000/storage/${product.image}`}
                                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-40"
                                />
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-700">
                                            <Link href={`/items/details/${product.id}`}>
                                                <span aria-hidden="true" className="absolute inset-0" />
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {product.description
                                                ? product.description.split(' ').slice(0, 15).join(' ') + (product.description.split(' ').length > 15 ? '...' : '')
                                                : 'No description available'}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            <strong>Category: </strong>
                                            {product.category ? product.category.name : "No Category"}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">${product.price}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No Items available</p>
                    )}
                </div>

            )}
        </>
    );
}

export default Page;
