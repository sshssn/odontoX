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
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import { LoadingTable } from "@/components/loading-state";
import { EmptyState } from "@/components/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    providerId: "",
    startAt: "",
    endAt: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, providersData, patientsData] = await Promise.all([
        api.appointments.list(),
        api.providers.list(),
        api.patients.list(),
      ]);
      setAppointments(appointmentsData);
      setProviders(providersData);
      setPatients(patientsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.appointments.create(formData);
      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      });
      setOpen(false);
      setFormData({
        patientId: "",
        providerId: "",
        startAt: "",
        endAt: "",
        reason: "",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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

  const columns = [
    {
      header: "Date & Time",
      accessor: (row: any) => new Date(row.startAt).toLocaleString(),
    },
    {
      header: "Patient",
      accessor: (row: any) => {
        const patient = patients.find((p) => p.id === row.patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
      },
    },
    {
      header: "Provider",
      accessor: (row: any) => {
        const provider = providers.find((p) => p.id === row.providerId);
        return provider ? `${provider.firstName} ${provider.lastName}` : "Unknown";
      },
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
      <AppSidebar role="RECEPTION" />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Appointments</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
              <p className="text-muted-foreground">Schedule and manage appointments</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                    <DialogDescription>
                      Create a new appointment for a patient
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="patientId">Patient</Label>
                      <Select
                        value={formData.patientId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, patientId: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.firstName} {patient.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="providerId">Provider</Label>
                      <Select
                        value={formData.providerId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, providerId: value })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          {providers.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              Dr. {provider.firstName} {provider.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startAt">Start Time</Label>
                        <Input
                          id="startAt"
                          type="datetime-local"
                          value={formData.startAt}
                          onChange={(e) =>
                            setFormData({ ...formData, startAt: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="endAt">End Time</Label>
                        <Input
                          id="endAt"
                          type="datetime-local"
                          value={formData.endAt}
                          onChange={(e) =>
                            setFormData({ ...formData, endAt: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reason">Reason</Label>
                      <Input
                        id="reason"
                        value={formData.reason}
                        onChange={(e) =>
                          setFormData({ ...formData, reason: e.target.value })
                        }
                        placeholder="e.g., Routine checkup"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Scheduling..." : "Schedule Appointment"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <LoadingTable rows={8} />
          ) : appointments.length === 0 ? (
            <EmptyState
              icon={CalendarIcon}
              title="No appointments scheduled"
              description="Start by scheduling your first appointment"
              action={{
                label: "Schedule Appointment",
                onClick: () => setOpen(true),
              }}
            />
          ) : (
            <DataTable
              data={appointments}
              columns={columns}
              searchable
              searchPlaceholder="Search appointments..."
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


