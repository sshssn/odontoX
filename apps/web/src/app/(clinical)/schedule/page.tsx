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

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, patientsData] = await Promise.all([
          api.appointments.list(),
          api.patients.list(),
        ]);
        setAppointments(appointmentsData);
        setPatients(patientsData);
      } catch (error) {
        console.error("Failed to load schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default";
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
      <AppSidebar role="DENTIST" />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Schedule</BreadcrumbPage>
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
            <h2 className="text-2xl font-bold tracking-tight">My Schedule</h2>
            <p className="text-muted-foreground">View your upcoming appointments</p>
          </div>

          {loading ? (
            <LoadingTable rows={6} />
          ) : appointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No appointments scheduled"
              description="Your schedule is empty"
            />
          ) : (
            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {getPatientName(appointment.patientId)}
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


