"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { format } from "timeago.js";
interface User {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

interface Product {
  id: string;
  productName: string;
  description: string;
  userName: string;
  createdAt: string;
  Owner_Details: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userFilters, setUserFilters] = useState({
    search: "",
    dateRange: null,
  });
  const [productFilters, setProductFilters] = useState({
    search: "",
    dateRange: null,
  });

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}admin/filter/user`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [userFilters]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}admin/filter/products`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.productsWithUserDetails);

      setProducts(response.data.productsWithUserDetails);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [productFilters]);

  // Toggle User Status
  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    console.log(userId);

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}admin/toggleStatus/${userId}`,
        { isActive: isActive },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, isActive } : user))
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>
        <Input
          type="text"
          placeholder="Search Users"
          onChange={(e) =>
            setUserFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => toggleUserStatus(user._id, !user.isActive)}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Product Management</h2>
        <Input
          type="text"
          placeholder="Search Products"
          onChange={(e) =>
            setProductFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => {
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.Owner_Details?.fullName}</TableCell>
                  <TableCell>{format(product.createdAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPanel;
