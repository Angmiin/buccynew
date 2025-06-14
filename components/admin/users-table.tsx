"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from "lucide-react"

// Mock data - would be fetched from API in real implementation
const users = Array.from({ length: 10 }, (_, i) => ({
  id: `USR-${10000 + i}`,
  name: [
    "John Smith",
    "Emma Johnson",
    "Michael Brown",
    "Olivia Davis",
    "William Wilson",
    "Sophia Martinez",
    "James Taylor",
    "Isabella Anderson",
    "Benjamin Thomas",
    "Mia Jackson",
  ][i],
  email: [
    "john.smith@example.com",
    "emma.johnson@example.com",
    "michael.brown@example.com",
    "olivia.davis@example.com",
    "william.wilson@example.com",
    "sophia.martinez@example.com",
    "james.taylor@example.com",
    "isabella.anderson@example.com",
    "benjamin.thomas@example.com",
    "mia.jackson@example.com",
  ][i],
  role: i === 0 || i === 5 ? "Admin" : "Customer",
  joinDate: new Date(2023, 0, 15 + i * 3).toLocaleDateString(),
  orders: [8, 5, 12, 3, 7, 10, 2, 6, 9, 4][i],
}))

export default function AdminUsersTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="w-full pl-8" />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
        <Button size="sm" className="bg-black text-white hover:bg-black/90">
          Add User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      user.role === "Admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell>{user.orders}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit user</DropdownMenuItem>
                      <DropdownMenuItem>View orders</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Delete user</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

