"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Package, Heart, CreditCard, User, MapPin, LogOut } from "lucide-react";
import Image from "next/image";

// Mock data - would be fetched from API in real implementation
const orders = [
  {
    id: "ORD-10001",
    date: "June 15, 2023",
    status: "Delivered",
    total: 2450,
    items: 1,
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7",
  },
  {
    id: "ORD-10002",
    date: "May 28, 2023",
    status: "Delivered",
    total: 1300,
    items: 2,
    image: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8",
  },
  {
    id: "ORD-10003",
    date: "April 10, 2023",
    status: "Delivered",
    total: 3200,
    items: 3,
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
  },
];

const addresses = [
  {
    id: "addr-1",
    name: "Home",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "Work",
    address: "456 Business Ave, Suite 200",
    city: "New York",
    state: "NY",
    zip: "10002",
    country: "United States",
    isDefault: false,
  },
];

export default function AccountPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to update the profile
    toast({
      title: "Success",
      description: "Your profile has been updated successfully",
    });
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-serif text-3xl font-bold md:text-4xl">
          My Account
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    {session?.user?.name?.[0] || "U"}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{session?.user?.name || "User"}</p>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden space-y-1 md:block">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#orders">
                <Package className="mr-2 h-4 w-4" />
                Orders
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/favorites">
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#addresses">
                <MapPin className="mr-2 h-4 w-4" />
                Addresses
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#payment">
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Methods
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            <Separator className="my-4" />
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div>
          <Tabs defaultValue="orders">
            <TabsList className="mb-8 grid w-full grid-cols-4 md:hidden">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" id="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="relative overflow-hidden rounded-lg border p-4 transition-all hover:shadow-sm"
                        >
                          <div className="absolute inset-0 z-0">
                            <Image
                              src={order.image}
                              alt="Order background"
                              fill
                              className="object-cover opacity-5"
                            />
                          </div>
                          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.date} • {order.items} item
                                {order.items !== 1 && "s"}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                ${order.total.toLocaleString()}
                              </p>
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Shipped"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="relative z-10 mt-4 flex justify-end">
                            <Button variant="outline" size="sm">
                              View Order
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative overflow-hidden py-8 text-center">
                      <div className="absolute inset-0 z-0">
                        <Image
                          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
                          alt="Empty orders"
                          fill
                          className="object-cover opacity-5"
                        />
                      </div>
                      <div className="relative z-10">
                        <p className="mb-4 text-muted-foreground">
                          You haven&apos;t placed any orders yet.
                        </p>
                        <Button asChild>
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses" id="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Button size="sm">Add New Address</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="relative overflow-hidden rounded-lg border p-4"
                      >
                        <div className="absolute inset-0 z-0">
                          <Image
                            src="https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8"
                            alt="Address background"
                            fill
                            className="object-cover opacity-5"
                          />
                        </div>
                        {address.isDefault && (
                          <span className="absolute right-2 top-2 rounded-full bg-black px-2 py-1 text-xs text-white">
                            Default
                          </span>
                        )}
                        <div className="relative z-10">
                          <p className="font-medium">{address.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} {address.zip}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" id="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <p className="mb-4 text-muted-foreground">
                      No payment methods added yet.
                    </p>
                    <Button>Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" id="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Update Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
