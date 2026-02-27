import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Boxes,
  ThermometerSun,
  Droplets,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart.jsx";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  useDashboardOverview,
  useEnvironmentTrend,
  useInventorySummary,
  useRiskBatches,
} from "@/hooks/useDashboard.js";
import { useAlerts } from "@/hooks/useAlert.js";

const riskBadgeVariant = (value = 0) => {
  if (value >= 80) return "destructive";
  if (value >= 65) return "secondary";
  return "outline";
};

// --- CHART COMPONENT: Radial Capacity ---
function CapacityChart({ current, capacity }) {
  const utilization = capacity > 0 ? (current / capacity) * 100 : 0;
  const chartData = [
    { activity: "used", value: utilization, fill: "var(--color-used)" },
  ];

  const chartConfig = {
    used: {
      label: "Used",
      // Using Tailwind's green-500 to match your previous components
      color: "#008f65",
    },
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={450} // Full circle
        innerRadius={80}
        outerRadius={110}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          dataKey="value"
          tick={false}
        />
        <RadialBar dataKey="value" background cornerRadius={10} />
        <text
          x="50%"
          y="45%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-3xl font-bold"
        >
          {Math.round(utilization)}%
        </text>
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground text-xs uppercase tracking-wider font-medium"
        >
          Utilization
        </text>
      </RadialBarChart>
    </ChartContainer>
  );
}

export default function Dashboard() {
  const { warehouseId, warehouses } = useOutletContext() || {};

  const { data: overview, isLoading: overviewLoading } =
    useDashboardOverview(warehouseId);
  const { data: environment, isLoading: environmentLoading } =
    useEnvironmentTrend(warehouseId, { hours: 24 });
  const { data: riskBatches, isLoading: riskLoading } = useRiskBatches(
    warehouseId,
    { minRisk: 50, limit: 6 },
  );
  const { data: alertsData, isLoading: alertsLoading } = useAlerts({
    warehouseId,
    status: "active",
    limit: 8,
  });
  const alerts = alertsData?.data || [];
  
  const { data: inventorySummary, isLoading: inventoryLoading } =
    useInventorySummary(warehouseId);

  // Prepare chart data
  const environmentSeries = useMemo(
    () =>
      (environment?.trend || []).map((item) => ({
        time: new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperature: Number(item.temperature ?? 0),
        humidity: Number(item.humidity ?? 0),
      })),
    [environment],
  );

  const inventorySeries = useMemo(
    () =>
      (inventorySummary || []).map((item) => ({
        produce: item.produceType,
        quantity: item.totalQuantity,
        nearExpiry: item.nearExpiryCount,
      })),
    [inventorySummary],
  );

  if (!warehouseId || !warehouses?.length) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No warehouse selected</CardTitle>
          <CardDescription>
            Add or pick a warehouse from the left sidebar to view AI-powered
            dashboard insights.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Row: Capacity Chart + KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* 1. Capacity Radial Chart (Span 2/7) */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Capacity</CardTitle>
            <CardDescription>Current utilization</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {overviewLoading ? (
              <Skeleton className="h-[200px] w-[200px] rounded-full mx-auto" />
            ) : (
              <CapacityChart
                current={overview?.currentStock || 0}
                capacity={overview?.capacity || 1}
              />
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              {overview?.currentStock?.toLocaleString()} /{" "}
              {overview?.capacity?.toLocaleString()} units
            </div>
            <div className="leading-none text-muted-foreground">
              Status:{" "}
              <Badge variant="outline" className="capitalize ml-1">
                {overview?.status || "active"}
              </Badge>
            </div>
          </CardFooter>
        </Card>

        {/* 2. KPI Cards (Span 5/7) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:col-span-5">
          {/* Total Batches Bar Chart (Small) */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Batches</CardDescription>
              <CardTitle className="text-4xl text-emerald-600">
                {overviewLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  (overview?.totalBatches ?? 0)
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Active in warehouse
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              {/* Micro chart visualization could go here */}
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-xs text-emerald-600 font-medium">
                +2.5% this week
              </span>{" "}
              {/* Mock metric */}
            </CardFooter>
          </Card>

          {/* High Risk Batches */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>High Risk</CardDescription>
              <CardTitle className="text-4xl text-amber-600">
                {overviewLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  (overview?.riskBatchCount ?? 0)
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Batches with risk ≥ 50
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
              <span className="text-xs text-amber-600 font-medium">
                Needs attention
              </span>
            </CardFooter>
          </Card>

          {/* Critical Batches */}
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Critical</CardDescription>
              <CardTitle className="text-4xl text-red-600">
                {overviewLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  (overview?.criticalRiskCount ?? 0)
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Immediate action required (Risk ≥ 80)
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Activity className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-xs text-red-600 font-medium">
                Critical condition
              </span>
            </CardFooter>
          </Card>

          {/* Inventory Breakdown Bar Chart */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Inventory Breakdown</CardTitle>
              <CardDescription>Distribution by produce type</CardDescription>
            </CardHeader>
            <CardContent>
              {inventoryLoading ? (
                <Skeleton className="h-[180px] w-full" />
              ) : inventorySeries.length ? (
                <ChartContainer
                  config={{
                    quantity: {
                      label: "Quantity",
                      color: "#008f65", // Your requested green
                    },
                    nearExpiry: {
                      label: "Near Expiry",
                      color: "#008f6580", // Lighter/transparent version of the same green for contrast
                    },
                  }}
                  className="h-[180px] w-full"
                >
                  <BarChart
                    accessibilityLayer
                    data={inventorySeries}
                    barCategoryGap="20%"
                    barGap={4}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="produce"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 8)}
                      tick={{ textAnchor: "middle" }} // <-- Ensures text is centered
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar
                      dataKey="quantity"
                      fill="var(--color-quantity)"
                      radius={4}
                    />
                    <Bar
                      dataKey="nearExpiry"
                      fill="var(--color-nearExpiry)"
                      radius={4}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[180px] items-center justify-center text-muted-foreground text-sm">
                  No inventory data
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Middle Row: Environment Area Chart + Alerts Feed */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* 1. Environment Area Chart (Span 2) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Environment Trends</CardTitle>
              <CardDescription>
                Temperature & Humidity over the last 24h
              </CardDescription>
            </div>
            {/* Quick stats on the header right */}
            <div className="flex">
              {environment?.latest && (
                <>
                  <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ThermometerSun className="h-3 w-3" /> Temperature
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {environment.latest.temperature}°C
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Droplets className="h-3 w-3" /> Humidity
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {environment.latest.humidity}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            {environmentLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : environmentSeries.length ? (
              <ChartContainer
                config={{
                  temperature: {
                    label: "Temperature",
                    color: "#008f65", // Amber/Oracle like
                  },
                  humidity: {
                    label: "Humidity",
                    color: "#008f65", // Blue/Teal like
                  },
                }}
                className="aspect-auto h-[250px] w-full"
              >
                <AreaChart data={environmentSeries}>
                  <defs>
                    <linearGradient id="fillTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-temperature)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-temperature)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillHum" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-humidity)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-humidity)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Area
                    dataKey="humidity"
                    type="natural"
                    fill="url(#fillHum)"
                    fillOpacity={0.4}
                    stroke="var(--color-humidity)"
                    stackId="a"
                  />
                  <Area
                    dataKey="temperature"
                    type="natural"
                    fill="url(#fillTemp)"
                    fillOpacity={0.4}
                    stroke="var(--color-temperature)"
                    stackId="b"
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                No environment history recorded.
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Alerts (Span 1) */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Active Alerts
            </CardTitle>
            <CardDescription>Recent issues detected by AI</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {alertsLoading ? (
              <div className="space-y-4 p-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-12 w-full" />
                ))}
              </div>
            ) : alerts?.length ? (
              <ScrollArea className="h-[300px] lg:h-[350px]">
                <div className="flex flex-col divide-y">
                  {alerts.map((alert) => (
                    <div
                      key={`${alert._id}-${alert.createdAt}`}
                      className="flex flex-col gap-1 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={riskBadgeVariant(alert.riskScore)}
                          className="text-[10px] h-5 px-1.5 uppercase"
                        >
                          {alert.riskLevel || "risk"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-none mt-1">
                        {alert.batchId?.batchId || "Unknown Batch"} -{" "}
                        {alert.alertType}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {alert.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
                <span className="flex size-12 items-center justify-center rounded-full border bg-background">
                  <Boxes className="size-6 opacity-50" />
                </span>
                <p className="text-sm">No active alerts found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: High Risk Table */}
      <Card>
        <CardHeader>
          <CardTitle>Highest Risk Batches</CardTitle>
          <CardDescription>
            Items requiring immediate attention based on AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {riskLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Produce</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Risk Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskBatches?.length ? (
                  riskBatches.map((batch) => (
                    <TableRow key={batch._id}>
                      <TableCell className="font-medium">
                        {batch.batchId}
                      </TableCell>
                      <TableCell>{batch.produceType}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{batch.produceType}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={riskBadgeVariant(batch.riskScore)}>
                          {Math.round(batch.riskScore)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No high-risk batches found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
