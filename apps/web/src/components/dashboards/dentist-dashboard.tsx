"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ClipboardList, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { LoadingCard } from "@/components/loading-state";
import { useRouter } from "next/navigation";

export function DentistDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    activePatients: 0,
    treatmentPlans: 0,
    nextAppointment: "--:--",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointments = await api.appointments.list();
        const today = new Date().toDateString();
        const todayAppointments = appointments.filter(
          (apt: any) => new Date(apt.startAt).toDateString() === today
        );

        // Get unique patients
        const uniquePatients = new Set(appointments.map((apt: any) => apt.patientId));

        // Find next appointment
        const upcoming = appointments
          .filter((apt: any) => new Date(apt.startAt) > new Date())
          .sort((a: any, b: any) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

        const nextTime = upcoming[0]
          ? new Date(upcoming[0].startAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--:--";

        setStats({
          todayAppointments: todayAppointments.length,
          activePatients: uniquePatients.size,
          treatmentPlans: 0, // Will be calculated when treatment plans API is available
          nextAppointment: nextTime,
        });
      } catch (error) {
        console.error("Failed to fetch dentist stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePatients}</div>
            <p className="text-xs text-muted-foreground">Total active patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment Plans</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.treatmentPlans}</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nextAppointment}</div>
            <p className="text-xs text-muted-foreground">
              {stats.nextAppointment === "--:--" ? "No upcoming" : "Today"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.todayAppointments > 0 ? (
              <p className="text-sm text-muted-foreground">
                {stats.todayAppointments} appointment{stats.todayAppointments !== 1 ? "s" : ""}{" "}
                scheduled
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No appointments scheduled</p>
            )}
            <Button className="mt-4" onClick={() => router.push("/schedule")}>
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>Latest patient interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {stats.activePatients} active patient{stats.activePatients !== 1 ? "s" : ""}
            </p>
            <Button className="mt-4" onClick={() => router.push("/patients")}>
              View All Patients
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
