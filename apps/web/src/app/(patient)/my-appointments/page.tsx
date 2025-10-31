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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import { LoadingTable } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import { Calendar } from "lucide-react";

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, providersData] = await Promise.all([
          api.appointments.list(),
          api.providers.list(),
        ]);
        setAppointments(appointmentsData);
        setProviders(providersData);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProviderName = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId);
    return provider ? `Dr. ${provider.firstName} ${provider.lastName}` : "Unknown Provider";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
      case "confirmed":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

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
                  <BreadcrumbPage>My Appointments</BreadcrumbPage>
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
            <h2 className="text-2xl font-bold tracking-tight">My Appointments</h2>
            <p className="text-muted-foreground">View your scheduled appointments</p>
          </div>

          {loading ? (
            <LoadingTable rows={5} />
          ) : appointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No appointments scheduled"
              description="You don't have any upcoming appointments"
            />
          ) : (
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {getProviderName(appointment.providerId)}
                      </CardTitle>
                      <Badge variant={getStatusColor(appointment.status) as any}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{new Date(appointment.startAt).toLocaleString()}</span>
                      </div>
                      {appointment.reason && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Reason:</span>
                          <span>{appointment.reason}</span>
                        </div>
                      )}
                      {appointment.notes && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Notes:</span>
                          <span>{appointment.notes}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


