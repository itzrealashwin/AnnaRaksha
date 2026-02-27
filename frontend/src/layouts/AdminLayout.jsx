import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Building2,
  Boxes,
  Bell,
  Brain,
  FileSpreadsheet,
  Settings,
  ChevronsUpDown,
  LogOut,
  User,
  Plus,
} from "lucide-react";

import { useUser, useAuth } from "@/hooks/useAuth.js";
import { useWarehouses } from "@/hooks/useWareHouse.js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar.jsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Warehouses", icon: Building2, to: "/warehouses" },
  { label: "Batches", icon: Boxes, to: "/batches" },
  { label: "Alerts", icon: Bell, to: "/alerts" },
  { label: "AI Forecast", icon: Brain, to: "/forecast", disabled: true },
  {
    label: "Dispatch Logs",
    icon: FileSpreadsheet,
    to: "/dispatches",
    disabled: true,
  },
  { label: "Settings", icon: Settings, to: "/settings", disabled: true },
];

function Greeting({ name }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">Welcome back</p>
      <h1
        className="text-2xl font-semibold leading-tight text-emerald-900 tracking-tight"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        Hello, {name || "there"}
      </h1>
    </div>
  );
}

function WarehouseSwitcher({ warehouses, selectedId, onSelect, loading }) {
  const selectedWarehouse =
    warehouses.find((w) => w._id === selectedId) || warehouses[0];

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Skeleton className="h-12 w-full rounded-lg" />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-sidebar-primary-foreground">
                <Building2 className="size-4 text-white" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {selectedWarehouse?.name || "Select Warehouse"}
                </span>
                <span className="truncate text-xs">
                  {selectedWarehouse?.code || "No code"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Warehouses
            </DropdownMenuLabel>
            {warehouses.map((warehouse) => (
              <DropdownMenuItem
                key={warehouse._id}
                onClick={() => onSelect(warehouse._id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Building2 className="size-4 shrink-0" />
                </div>
                {warehouse.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add warehouse
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserNav({ user, logout }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user?.avatar || user?.photoUrl ? (
                  <AvatarImage
                    src={user.avatar || user.photoUrl}
                    alt={user?.name}
                  />
                ) : null}
                <AvatarFallback className="rounded-lg">
                  {(user?.name || "U").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.name || "User"}
                </span>
                <span className="truncate text-xs">
                  {user?.email || "user@example.com"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user?.avatar || user?.photoUrl ? (
                    <AvatarImage
                      src={user.avatar || user.photoUrl}
                      alt={user?.name}
                    />
                  ) : null}
                  <AvatarFallback className="rounded-lg">
                    {(user?.name || "U").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "User"}
                  </span>
                  <span className="truncate text-xs">
                    {user?.email || "user@example.com"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout && logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const { data: outeruser } = useUser();
  const user = outeruser?.user || null;
  const { logout } = useAuth(); // Keep useAuth for logout function
  const { data: warehousesResponse, isLoading: isWarehousesLoading } =
    useWarehouses();
  const queryClient = useQueryClient();

  const warehouses = useMemo(
    () => warehousesResponse?.data || [],
    [warehousesResponse],
  );

  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");

  useEffect(() => {
    if (!selectedWarehouseId && warehouses.length) {
      setSelectedWarehouseId(warehouses[0]._id);
    }
  }, [selectedWarehouseId, warehouses]);

  useEffect(() => {
    if (selectedWarehouseId) {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["forecast"] });
      queryClient.invalidateQueries({ queryKey: ["dispatches"] });
    }
  }, [selectedWarehouseId, queryClient]);

  const outletContext = useMemo(
    () => ({
      warehouseId: selectedWarehouseId,
      warehouses,
      user,
    }),
    [selectedWarehouseId, warehouses, user],
  );

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <WarehouseSwitcher
            warehouses={warehouses}
            selectedId={selectedWarehouseId}
            onSelect={setSelectedWarehouseId}
            loading={isWarehousesLoading}
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  !item.disabled && location.pathname.startsWith(item.to);

                if (item.disabled) {
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={false}
                        aria-disabled
                        className="opacity-50 cursor-not-allowed"
                      >
                        <Icon />
                        <span>{item.label}</span>
                        <Badge
                          variant="outline"
                          className="ml-auto text-xs px-1 py-0 h-5"
                        >
                          Soon
                        </Badge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <NavLink to={item.to}>
                        <Icon />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <UserNav user={user} logout={logout} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 py-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 shadow-sm">
          {/* Moved Greeting inside this left-aligned container */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <SidebarSeparator orientation="vertical" className="mr-2 h-4" />
            {/* Breadcrumbs could go here */}
            <Greeting name={user?.name || user?.username} />
          </div>

          {/* If you add a user profile dropdown or theme toggle later, it will automatically sit on the far right here because of 'justify-between' on the header */}
        </header>

        <div className="relative flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-50"></div>
          <Outlet context={outletContext} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
