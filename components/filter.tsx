"use client";
import React, { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Category {
    id: number;
    name: string;
}
const filter = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user/categories');
                if (!response.ok) {
                    throw new Error(`Error fetching categories: ${response.statusText}`);
                }
                const data = await response.json();
                setCategories(data?.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchCategories();
    }, []);
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {loading ? (
                        <SelectItem disabled value={'Loading..'}>Loading...</SelectItem> 
                    ) : (
                        categories.length > 0 ? (
                            categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem disabled value={'No Category'}>No categories available</SelectItem>
                        )
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
export default filter
