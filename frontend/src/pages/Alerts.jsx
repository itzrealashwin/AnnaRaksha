import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Activity,
  Bell,
  Search,
  Filter,
  Trash2,
  ChevronDown,
  Info,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { useAlerts, useResolveAlert, useDismissAlert } from "@/hooks/useAlert";

export default function Alerts() {
  const { warehouseId } = useOutletContext() || {};
  const [resolvingAlert, setResolvingAlert] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // New state to track which alert row is expanded
  const [expandedAlertId, setExpandedAlertId] = useState(null);
  
  const { data: alertsResponse, isLoading, error } = useAlerts(warehouseId ? { warehouseId } : {});
  const resolveMutation = useResolveAlert();
  const dismissMutation = useDismissAlert();
  
  const alerts = alertsResponse?.data || [];
  
  const filteredAlerts = alerts.filter(alert => 
    alert.alertType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.batchId?.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.batchId?.produceType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedAlertId(prev => prev === id ? null : id);
  };

  const handleResolveClick = (alert, e) => {
    e.stopPropagation(); // Prevent the row from collapsing when clicking resolve
    setResolvingAlert(alert);
    setResolutionNotes("");
  };
  
  const handleResolveSubmit = async () => {
    if (!resolvingAlert) return;
    
    try {
      await resolveMutation.mutateAsync({ 
        id: resolvingAlert._id, 
        resolutionNotes 
      });
      toast.success("Alert resolved successfully");
      setResolvingAlert(null);
    } catch (error) {
      console.error("Failed to resolve alert:", error);
      toast.error("Failed to resolve alert");
    }
  };

  const handleDismiss = async (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to dismiss this alert?")) {
        try {
            await dismissMutation.mutateAsync(id);
            toast.success("Alert dismissed successfully");
        } catch (error) {
           console.error("Failed to dismiss alert:", error);
           toast.error("Failed to dismiss alert");
        }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
             {Array.from({ length: 3 }).map((_, i) => (
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
            <h3 className="text-xl font-semibold">Error loading alerts</h3>
            <p className="text-muted-foreground">{error.message}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
      )
  }

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = activeAlerts.filter(a => a.riskLevel === 'Critical').length;
  const highAlerts = activeAlerts.filter(a => a.riskLevel === 'High').length;
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved').length;

  // Updated to return text colors for icons
  const getSeverityColors = (severity) => {
    switch (severity) {
      case 'Critical': return { bg: 'bg-red-500 hover:bg-red-600', text: 'text-red-500', lightBg: 'bg-red-50' };
      case 'High': return { bg: 'bg-orange-500 hover:bg-orange-600', text: 'text-orange-500', lightBg: 'bg-orange-50' };
      case 'Medium': return { bg: 'bg-yellow-500 hover:bg-yellow-600', text: 'text-yellow-600', lightBg: 'bg-yellow-50' };
      case 'Low': return { bg: 'bg-blue-500 hover:bg-blue-600', text: 'text-blue-500', lightBg: 'bg-blue-50' };
      default: return { bg: 'bg-gray-500 hover:bg-gray-600', text: 'text-gray-500', lightBg: 'bg-gray-50' };
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'resolved': return 'default';
      case 'dismissed': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Alerts</h2>
          <p className="text-muted-foreground mt-1">
            Monitor and manage AI-generated risk alerts for your inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search alerts..."
              className="w-full bg-background pl-8 md:w-[200px] lg:w-[300px] rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-red-50/50 dark:bg-red-950/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical / High</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts} / {highAlerts}</div>
            <p className="text-xs text-muted-foreground">Immediate action needed</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-green-50/50 dark:bg-green-950/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedAlerts}</div>
            <p className="text-xs text-muted-foreground">Historically resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Expandable Alerts List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          Alert Feed
        </h3>

        {filteredAlerts.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20">
            <CheckCircle2 className="h-10 w-10 text-green-500 opacity-80 mb-4" />
            <h3 className="text-lg font-semibold">All clear!</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mt-1">
              There are no active alerts matching your criteria. Your inventory is safe.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {filteredAlerts.map((alert) => {
                const isExpanded = expandedAlertId === alert._id;
                const severity = getSeverityColors(alert.riskLevel);
                
                return (
                  <div 
                    key={alert._id} 
                    className={`transition-colors duration-200 ${isExpanded ? 'bg-muted/30' : 'hover:bg-muted/10'}`}
                  >
                    {/* Compact View (Always visible) */}
                    <div 
                      className="p-4 sm:px-6 flex items-center cursor-pointer gap-4"
                      onClick={() => toggleExpand(alert._id)}
                    >
                      {/* Left Status Icon */}
                      <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${severity.lightBg} ${severity.text} dark:bg-muted`}>
                        {alert.status === 'resolved' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground truncate capitalize">
                              {alert.alertType} Alert
                            </span>
                            <Badge variant={getStatusBadgeVariant(alert.status)} className="h-5 text-[10px] uppercase px-1.5">
                              {alert.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground truncate mt-0.5 flex items-center gap-2">
                            <span className="font-medium text-foreground/70">
                              {alert.batchId?.batchId || 'Unknown Batch'}
                            </span>
                            <span>•</span>
                            <span>{alert.batchId?.produceType}</span>
                          </div>
                        </div>

                        {/* Right aligned meta info */}
                        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-sm text-muted-foreground">
                          <div className="flex items-center hidden sm:flex">
                            <Clock className="mr-1.5 h-3.5 w-3.5" />
                            {format(new Date(alert.createdAt), 'MMM dd, HH:mm')}
                          </div>
                          <Badge className={`${severity.bg} text-white border-none shadow-none`}>
                            {alert.riskLevel}
                          </Badge>
                        </div>
                      </div>

                      {/* Expand Chevron */}
                      <div className="shrink-0 text-muted-foreground ml-2">
                        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded Content View */}
                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-5 pt-1 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="pl-14 border-t pt-4 mt-2 border-border/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Alert Details */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                  <Info className="h-3.5 w-3.5" /> What Happened
                                </h4>
                                <p className="text-sm text-foreground/90 leading-relaxed bg-background border rounded-lg p-3">
                                  {alert.reason}
                                </p>
                              </div>
                              
                              <div className="sm:hidden flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1.5 h-3.5 w-3.5" />
                                Triggered: {format(new Date(alert.createdAt), 'MMM dd, yyyy HH:mm')}
                              </div>
                            </div>

                            {/* Action Area */}
                            <div className="space-y-4 flex flex-col justify-between">
                              <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                                  <ShieldAlert className="h-3.5 w-3.5" /> Recommended Action
                                </h4>
                                <p className="text-sm text-foreground/90 leading-relaxed bg-primary/5 border border-primary/10 rounded-lg p-3">
                                  {alert.recommendedAction || "Investigate the batch conditions and update the inventory records accordingly."}
                                </p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-3 pt-2">
                                {alert.status === 'active' && (
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={(e) => handleResolveClick(alert, e)}
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Resolve Issue
                                  </Button>
                                )}
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => handleDismiss(alert._id, e)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Dismiss
                                </Button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Resolve Alert Dialog */}
      <Dialog open={!!resolvingAlert} onOpenChange={(open) => !open && setResolvingAlert(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>
              Provide details on how this alert was resolved. This will be saved in the alert history.
            </DialogDescription>
          </DialogHeader>
          
          {resolvingAlert && (
            <div className="grid gap-4 py-4">
              <div className="rounded-md bg-muted p-3">
                <h4 className="font-medium text-sm capitalize">{resolvingAlert.alertType} Alert</h4>
                <p className="text-xs text-muted-foreground mt-1">{resolvingAlert.reason}</p>
                <div className="mt-2 pt-2 border-t border-border">
                  <p className="text-xs font-medium text-primary">Recommended Action:</p>
                  <p className="text-xs text-muted-foreground mt-1">{resolvingAlert.recommendedAction}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="resolution" className="text-sm font-medium">
                  Resolution Notes
                </label>
                <Textarea
                  id="resolution"
                  placeholder="e.g., Adjusted temperature controls, moved batch to cooler area..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolvingAlert(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleResolveSubmit} 
              disabled={resolveMutation.isPending || !resolutionNotes.trim()}
            >
              {resolveMutation.isPending ? "Resolving..." : "Mark as Resolved"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}