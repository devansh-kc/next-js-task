"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
interface ProductCardProps {
  image: string;
  name: string;
  description: string;
}
interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const AddProductForm: React.FC<{
  onAddProduct: (product: ProductCardProps) => void;
}> = ({ onAddProduct }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name && description && image) {
      try {
        const formData = new FormData();
        formData.append("productName", name);
        formData.append("description", description);
        formData.append("ProductImage", image);

        const response = await axios.post<ApiResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}product`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Product added successfully:", response);
        if (response.data.success) {
          toast({
            title: "Product added successfully",
          });
          router.push("/");
        }
      } catch (error) {
        console.error("Error adding product:", error);
      }
    } else {
      console.error("All fields are required.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10"
    >
      <div className="mb-4">
        <label
          className="block text-gray-700 font-semibold mb-2"
          htmlFor="name"
        >
          Product Name
        </label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-semibold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          rows={4}
          required
        ></Textarea>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-semibold mb-2"
          htmlFor="image"
        >
          Product Image
        </label>
        <Input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          accept="image/*"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Add Product
      </Button>
    </form>
  );
};
export default AddProductForm;
