import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Building2,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
  Activity,
  Box,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import { useWarehouses, useCreateWarehouse, useUpdateWarehouse, useDeleteWarehouse } from "@/hooks/useWareHouse";

// --- Schema ---
const warehouseSchema = z.object({
  name: z.string().min(2, "Name is required"),
  code: z.string().min(2, "Code is required").toUpperCase(),
  warehouseType: z.enum(["general", "cold", "dry", "open-air"]),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  status: z.enum(["active", "inactive", "maintenance"]),
  location: z.object({
    address: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(1, "Pincode is required"),
    country: z.string().default("India"),
  }),
});

function WarehouseForm({ warehouse, onSubmit, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(warehouseSchema),
    defaultValues: warehouse || {
      name: "",
      code: "",
      warehouseType: "general",
      capacity: 1000,
      status: "active",
      location: {
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
    },
  });

  return (
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Central Warehouse 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="CW-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="warehouseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="cold">Cold Storage</SelectItem>
                        <SelectItem value="dry">Dry Storage</SelectItem>
                        <SelectItem value="open-air">Open Air</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (Units/Kg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="location" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="location.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Storage Lane" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location.pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="400001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="location.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="location.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             </div>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="px-0 pb-0 sm:justify-end">
          <SheetClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </SheetClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : warehouse ? "Update Warehouse" : "Create Warehouse"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}

export default function Warehouse() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  
  // Use React Query hooks
  const { data: warehousesResponse, isLoading, error } = useWarehouses();
  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();
  const deleteMutation = useDeleteWarehouse();
  
  // Access the array from the response object (e.g., response.data)
  const warehouses = warehousesResponse?.data || [];
  
  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setSheetOpen(true);
  };
  
  const handleAdd = () => {
    setEditingWarehouse(null);
    setSheetOpen(true);
  };
  
  const handleDelete = async (id) => {
    // Only proceed if user confirms (simple browser confirm for now, could be a Dialog)
    if (confirm("Are you sure you want to delete this warehouse?")) {
        try {
            await deleteMutation.mutateAsync(id);
             toast.success("Warehouse deleted successfully");
        } catch (error) {
           console.error("Failed to delete warehouse:", error);
           toast.error("Failed to delete warehouse");
        }
    }
  };
  
  const handleSubmit = async (data) => {
    try {
      if (editingWarehouse) {
        await updateMutation.mutateAsync({ id: editingWarehouse._id, data });
        toast.success("Warehouse updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Warehouse created successfully");
      }
      setSheetOpen(false);
    } catch (error) {
      console.error("Failed to save warehouse:", error);
       toast.error("Failed to save warehouse");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
             ))}
        </div>
      </div>
    );
  }

  if (error) {
      return (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-red-100 p-3 text-red-600">
                <Activity className="size-6" />
            </div>
            <h3 className="text-xl font-semibold">Error loading warehouses</h3>
            <p className="text-muted-foreground">{error.message}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
      )
  }

  // Calculate summary stats
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter(w => w.status === 'active').length;
  const totalCapacity = warehouses.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
  const totalCurrentStock = warehouses.reduce((acc, curr) => acc + (curr.currentStock || 0), 0);
  const overallUtilization = totalCapacity > 0 ? Math.round((totalCurrentStock / totalCapacity) * 100) : 0;


  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header & Stats */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Warehouses</h2>
          <p className="text-muted-foreground">
            Manage your distribution centers and storage facilities.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add Warehouse
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[540px] overflow-y-auto">
                <SheetHeader>
                <SheetTitle>{editingWarehouse ? "Edit Warehouse" : "Add New Warehouse"}</SheetTitle>
                <SheetDescription>
                    {editingWarehouse ? "Make changes to your warehouse here." : "Add the details of the new warehouse."} Click save when you're done.
                </SheetDescription>
                </SheetHeader>
                <div className="mt-2">
                    <WarehouseForm 
                        warehouse={editingWarehouse} 
                        onSubmit={handleSubmit} 
                        isSubmitting={createMutation.isPending || updateMutation.isPending}
                    />
                </div>
            </SheetContent>
            </Sheet>
        </div>
      </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalWarehouses}</div>
                <p className="text-xs text-muted-foreground">{activeWarehouses} Active</p>
            </CardContent>
            </Card>
             <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalCapacity.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Units/Kg</p>
            </CardContent>
            </Card>
             <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalCurrentStock.toLocaleString()}</div>
                 <p className="text-xs text-muted-foreground">Units/Kg</p>
            </CardContent>
            </Card>
             <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilization</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{overallUtilization}%</div>
                <p className="text-xs text-muted-foreground">Overall</p>
            </CardContent>
            </Card>
        </div>

      {/* Warehouse Grid */}
      {warehouses.length === 0 ? (
           <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/40">
                <Building2 className="h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-semibold">No warehouses found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                    Get started by adding your first warehouse to the system.
                </p>
                <Button variant="outline" onClick={handleAdd}>Add Warehouse</Button>
           </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {warehouses.map((warehouse) => (
            <Card key={warehouse._id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-base leading-none">{warehouse.name}</CardTitle>
                                <CardDescription className="font-mono text-xs">{warehouse.code}</CardDescription>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(warehouse)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(warehouse._id)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-5">
                    <div className="grid gap-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant={warehouse.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                {warehouse.status}
                            </Badge>
                        </div>
                         <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Type</span>
                            <span className="font-medium capitalize">{warehouse.warehouseType}</span>
                        </div>
                         <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Capacity</span>
                            <span className="font-medium">{warehouse.capacity?.toLocaleString()}</span>
                        </div>
                         <div className="flex items-start gap-2 text-sm text-muted-foreground mt-1 bg-muted/30 p-2.5 rounded-md">
                            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground/70" />
                            <span className="line-clamp-2 leading-tight">
                                {[warehouse.location?.city, warehouse.location?.state].filter(Boolean).join(", ") || "No location info"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            ))}
        </div>
      )}
    </div>
  );
}
