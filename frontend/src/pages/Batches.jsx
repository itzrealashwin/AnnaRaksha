import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
  Calendar,
  Activity,
  Boxes,
  MapPin, 
  CalendarDays, 
  Clock, 
  Thermometer, 
  Droplets,
  Sprout,
  AlertTriangle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useBatches, useCreateBatch, useUpdateBatch, useDeleteBatch } from "@/hooks/useBatch";
import { useWarehouses } from "@/hooks/useWareHouse";
import { batchService } from "@/services/api/batch.service";

// --- Schema ---
const batchSchema = z.object({
  warehouseId: z.string().min(1, "Warehouse is required"),
  produceType: z.string().min(2, "Produce Type is required"),
  quantityInitial: z.coerce.number().min(1, "Initial quantity must be at least 1"),
  quantityCurrent: z.coerce.number().min(0, "Current quantity cannot be negative"),
  unit: z.string().default("kg"),
  arrivalDate: z.string().min(1, "Arrival Date is required"),
  shelfLifeDays: z.coerce.number().min(0, "Shelf life must be positive"),
  status: z.enum(["Fresh", "Maturing", "NearExpiry", "Expired", "Dispatched", "Disposed"]).default("Fresh"),
});

function BatchForm({ batch, onSubmit, isSubmitting, warehouses, defaultWarehouseId }) {
  const form = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: batch ? {
      ...batch,
      warehouseId: batch.warehouseId?._id || batch.warehouseId,
      arrivalDate: batch.arrivalDate ? new Date(batch.arrivalDate).toISOString().split('T')[0] : "",
    } : {
      warehouseId: defaultWarehouseId || "",
      produceType: "",
      quantityInitial: 100,
      quantityCurrent: 100,
      unit: "kg",
      arrivalDate: new Date().toISOString().split('T')[0],
      shelfLifeDays: 30,
      status: "Fresh",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="warehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouses.map((w) => (
                        <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>
                      ))}
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
              name="produceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produce Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Apples, Wheat, etc." {...field} />
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
                      <SelectItem value="Fresh">Fresh</SelectItem>
                      <SelectItem value="Maturing">Maturing</SelectItem>
                      <SelectItem value="NearExpiry">Near Expiry</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Dispatched">Dispatched</SelectItem>
                      <SelectItem value="Disposed">Disposed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="quantityInitial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Qty</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantityCurrent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Qty</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="kg, tons" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="arrivalDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arrival Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shelfLifeDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelf Life (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <SheetFooter className="px-0 pb-0 sm:justify-end">
          <SheetClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </SheetClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : batch ? "Update Batch" : "Create Batch"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}

export default function Batches() {
  const { warehouseId } = useOutletContext() || {};
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [viewingBatch, setViewingBatch] = useState(null);
  
  // Use React Query hooks
  const { data: batchesResponse, isLoading, error } = useBatches(warehouseId ? { warehouseId } : {});
  const { data: warehousesResponse } = useWarehouses();
  
  const createMutation = useCreateBatch();
  const updateMutation = useUpdateBatch();
  const deleteMutation = useDeleteBatch();
  
  const batches = batchesResponse?.data || [];
  const warehouses = warehousesResponse?.data || [];
  
  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setSheetOpen(true);
  };
  
  const handleView = async (batch) => {
    try {
      const response = await batchService.getBatchById(batch._id);
      setViewingBatch(response.data);
    } catch (error) {
      console.error("Failed to fetch batch details:", error);
      toast.error("Failed to load batch details");
    }
  };
  
  const handleAdd = () => {
    setEditingBatch(null);
    setSheetOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this batch?")) {
        try {
            await deleteMutation.mutateAsync(id);
            toast.success("Batch deleted successfully");
        } catch (error) {
           console.error("Failed to delete batch:", error);
           toast.error("Failed to delete batch");
        }
    }
  };
  
  const handleSubmit = async (data) => {
    try {
      if (editingBatch) {
        await updateMutation.mutateAsync({ id: editingBatch._id, data });
        toast.success("Batch updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Batch created successfully");
      }
      setSheetOpen(false);
    } catch (error) {
      console.error("Failed to save batch:", error);
      toast.error("Failed to save batch");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
             ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
      return (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-red-100 p-3 text-red-600">
                <Activity className="size-6" />
            </div>
            <h3 className="text-xl font-semibold">Error loading batches</h3>
            <p className="text-muted-foreground">{error.message}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
      )
  }

  // Calculate summary stats
  const totalBatches = batches.length;
  const activeBatches = batches.filter(b => !['Dispatched', 'Disposed'].includes(b.status)).length;
  const totalCurrentStock = batches.reduce((acc, curr) => acc + (curr.quantityCurrent || 0), 0);
  const highRiskBatches = batches.filter(b => ['High', 'Critical'].includes(b.riskLevel)).length;

  const getRiskBadgeColor = (level) => {
    switch (level) {
      case 'Critical': return 'bg-red-500 hover:bg-red-600';
      case 'High': return 'bg-orange-500 hover:bg-orange-600';
      case 'Medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Fresh': return 'default';
      case 'Maturing': return 'secondary';
      case 'NearExpiry': return 'destructive';
      case 'Expired': return 'destructive';
      case 'Dispatched': return 'outline';
      case 'Disposed': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header & Stats */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Batches</h2>
          <p className="text-muted-foreground">
            Manage and monitor your produce batches across all warehouses.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Add Batch
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-[540px] overflow-y-auto">
                <SheetHeader>
                <SheetTitle>{editingBatch ? "Edit Batch" : "Add New Batch"}</SheetTitle>
                <SheetDescription>
                    {editingBatch ? "Make changes to your batch here." : "Add the details of the new inventory batch."} Click save when you're done.
                </SheetDescription>
                </SheetHeader>
                <div className="mt-2">
                    <BatchForm 
                        batch={editingBatch} 
                        onSubmit={handleSubmit} 
                        isSubmitting={createMutation.isPending || updateMutation.isPending}
                        warehouses={warehouses}
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
                <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                <Boxes className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalBatches}</div>
                <p className="text-xs text-muted-foreground">{activeBatches} Active</p>
            </CardContent>
            </Card>
             <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalCurrentStock.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total Units/Kg</p>
            </CardContent>
            </Card>
             <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-red-600">{highRiskBatches}</div>
                 <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
            </Card>
             <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Shelf Life</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                  {batches.length > 0 
                    ? Math.round(batches.reduce((acc, b) => acc + (b.shelfLifeDays || 0), 0) / batches.length) 
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">Days</p>
            </CardContent>
            </Card>
        </div>

      <Separator />

      {/* Batches Table */}
      {batches.length === 0 ? (
           <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/40">
                <Boxes className="h-10 w-10 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-semibold">No batches found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                    Get started by adding your first inventory batch to the system.
                </p>
                <Button variant="outline" onClick={handleAdd}>Add Batch</Button>
           </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Produce</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch._id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleView(batch)}>
                    <TableCell className="font-medium">{batch.batchId}</TableCell>
                    <TableCell>{batch.produceType}</TableCell>
                    <TableCell>{batch.warehouse?.code || 'Unknown'}</TableCell>
                    <TableCell>
                      {batch.quantityCurrent} / {batch.quantityInitial} {batch.unit}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(batch.status)}>
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getRiskBadgeColor(batch.riskLevel)} text-white border-none`}>
                        {batch.riskLevel} ({batch.riskScore})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {batch.expiryDate ? format(new Date(batch.expiryDate), 'MMM dd, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(batch)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(batch._id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Batch Details Dialog */}
  <Dialog open={!!viewingBatch} onOpenChange={(open) => !open && setViewingBatch(null)}>
  <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-background">
    {viewingBatch && (
      <>
        {/* Header Section with subtle background */}
        <div className="bg-muted/40 px-6 py-5 border-b">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Package className="h-5 w-5" />
              </div>
              Batch Details: <span className="text-primary">{viewingBatch.batchId}</span>
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm">
              Comprehensive tracking and status information for this inventory batch.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Top Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border bg-card p-3 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                <Sprout className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-wider">Produce</p>
              </div>
              <p className="font-semibold text-foreground truncate">{viewingBatch.produceType}</p>
            </div>

            <div className="rounded-xl border bg-card p-3 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                <MapPin className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-wider">Location</p>
              </div>
              <p className="font-semibold text-foreground truncate">{viewingBatch.warehouseId?.name || 'Unknown'}</p>
            </div>

            <div className="rounded-xl border bg-card p-3 shadow-sm flex flex-col justify-center items-start">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Status</p>
              <Badge variant={getStatusBadgeVariant(viewingBatch.status)} className="w-fit">
                {viewingBatch.status}
              </Badge>
            </div>

            <div className="rounded-xl border bg-card p-3 shadow-sm flex flex-col justify-center items-start">
              <div className="flex items-center gap-2 text-muted-foreground mb-1.5">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-wider">Risk Level</p>
              </div>
              <Badge className={`${getRiskBadgeColor(viewingBatch.riskLevel)} text-white border-none shadow-none`}>
                {viewingBatch.riskLevel} ({viewingBatch.riskScore})
              </Badge>
            </div>
          </div>

          {/* Quantity Section with Visual Bar */}
          <div className="rounded-xl border p-4 bg-muted/10">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Current Stock</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{viewingBatch.quantityCurrent}</span>
                  <span className="text-sm text-muted-foreground font-medium">{viewingBatch.unit}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Initial Stock</p>
                <p className="text-sm font-medium">{viewingBatch.quantityInitial} {viewingBatch.unit}</p>
              </div>
            </div>
            
            {/* Custom Progress Bar */}
            <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                style={{ 
                  width: `${Math.min(100, Math.max(0, (viewingBatch.quantityCurrent / viewingBatch.quantityInitial) * 100))}%` 
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Timeline & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-muted rounded-md text-muted-foreground mt-0.5">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Arrival Date</p>
                <p className="text-sm font-medium mt-0.5">
                  {viewingBatch.arrivalDate ? format(new Date(viewingBatch.arrivalDate), 'MMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-muted rounded-md text-muted-foreground mt-0.5">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Expiry Date</p>
                <p className="text-sm font-medium mt-0.5">
                  {viewingBatch.expiryDate ? format(new Date(viewingBatch.expiryDate), 'MMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-muted rounded-md text-muted-foreground mt-0.5">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Shelf Life</p>
                <p className="text-sm font-medium mt-0.5">{viewingBatch.shelfLifeDays} Days</p>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          {viewingBatch.conditions && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Current Conditions</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-background">
                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-500">
                      <Thermometer className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Temperature</p>
                      <p className="text-lg font-bold text-foreground">{viewingBatch.conditions.temperature || 'N/A'}°C</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 rounded-xl border p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-background">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-500">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Humidity</p>
                      <p className="text-lg font-bold text-foreground">{viewingBatch.conditions.humidity || 'N/A'}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
}
