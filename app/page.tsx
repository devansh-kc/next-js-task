"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { CardFooter } from "@/components/ui/card";

interface Product {
  _id: string;
  image: string;
  productName: string;
  description: string;
}

export default function Home() {
  const [productInformation, setProductInformation] = useState<Product[]>([]);
  const { toast } = useToast();

  async function fetchProductInfo() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}product/`,

        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setProductInformation(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }
  useEffect(() => {
    fetchProductInfo();
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center ">
      <div className="flex flex-wrap items-start justify-center gap-6 mt-10">
        {productInformation.length > 0 &&
          productInformation?.map((product, index) => (
            <>
              <ProductCard
                key={index}
                image={product?.image}
                name={product?.productName}
                description={product?.description}
                productId={product?._id}
              />
            </>
          ))}
      </div>
      <Link href={"/addproduct"}>
        <Button className="mt-10 px-6 py-3  text-white font-semibold rounded-md shadow-md  ">
          add Product
        </Button>
      </Link>
    </div>
  );
}
