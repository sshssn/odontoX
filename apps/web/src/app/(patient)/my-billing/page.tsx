"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { NavActions } from "@/components/nav-actions";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import { LoadingTable } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { CreditCard } from "lucide-react";

export default function MyBillingPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.invoices.list();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to load invoices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "secondary";
      case "issued":
        return "default";
      case "overdue":
        return "destructive";
      case "draft":
        return "outline";
      default:
        return "outline";
    }
  };

  const columns = [
    {
      header: "Invoice Date",
      accessor: "issuedAt" as const,
      cell: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "Draft",
    },
    {
      header: "Due Date",
      accessor: "dueAt" as const,
      cell: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "—",
    },
    {
      header: "Amount",
      accessor: "total" as const,
      cell: (value: string) => `$${parseFloat(value || "0").toFixed(2)}`,
    },
    {
      header: "Balance Due",
      accessor: "balanceDue" as const,
      cell: (value: string) => `$${parseFloat(value || "0").toFixed(2)}`,
    },
    {
      header: "Status",
      accessor: "status" as const,
      cell: (value: string) => (
        <Badge variant={getStatusColor(value) as any}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar role="PATIENT" />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>My Billing</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">My Billing</h2>
            <p className="text-muted-foreground">View your invoices and payment history</p>
          </div>

          {loading ? (
            <LoadingTable rows={5} />
          ) : invoices.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No invoices found"
              description="You don't have any billing records yet"
            />
          ) : (
            <DataTable
              data={invoices}
              columns={columns}
              searchable
              searchPlaceholder="Search invoices..."
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


