import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import AdminProductsTable from "@/components/admin/products-table";
import AdminOrdersTable from "@/components/admin/orders-table";
import AdminUsersTable from "@/components/admin/users-table";
import Image from "next/image";

export default function AdminDashboard() {
  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your products, orders, and customers
          </p>
        </div>
        <Button className="bg-black text-white hover:bg-black/90">
          Add New Product
        </Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e"
              alt="Revenue background"
              fill
              className="object-cover opacity-5"
            />
          </div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
              alt="Orders background"
              fill
              className="object-cover opacity-5"
            />
          </div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.4%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
              alt="Products background"
              fill
              className="object-cover opacity-5"
            />
          </div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902"
              alt="Customers background"
              fill
              className="object-cover opacity-5"
            />
          </div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">1,429</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.7%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <AdminProductsTable />
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <AdminOrdersTable />
        </TabsContent>
        <TabsContent value="customers" className="space-y-4">
          <AdminUsersTable />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent className="relative pl-2">
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
                  alt="Analytics background"
                  fill
                  className="object-cover opacity-5"
                />
              </div>
              <div className="relative z-10 h-[300px] w-full">
                <BarChart className="h-full w-full text-muted-foreground" />
                <div className="flex justify-center pt-4 text-sm text-muted-foreground">
                  Analytics data visualization will appear here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
