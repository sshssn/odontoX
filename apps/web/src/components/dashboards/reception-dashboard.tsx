"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Phone, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { LoadingCard } from "@/components/loading-state";
import { useRouter } from "next/navigation";

export function ReceptionDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingCheckins: 0,
    waitlist: 0,
    missedCalls: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointments = await api.appointments.list();
        const today = new Date().toDateString();
        const todayAppointments = appointments.filter(
          (apt: any) => new Date(apt.startAt).toDateString() === today
        );

        // Count appointments within next 30 minutes as pending check-ins
        const now = new Date();
        const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
        const pendingCheckins = appointments.filter((apt: any) => {
          const startTime = new Date(apt.startAt);
          return startTime >= now && startTime <= thirtyMinutesFromNow && apt.status === "confirmed";
        });

        setStats({
          todayAppointments: todayAppointments.length,
          pendingCheckins: pendingCheckins.length,
          waitlist: 0, // Will be calculated when waitlist API is available
          missedCalls: 0, // Will be calculated when calls API is available
        });
      } catch (error) {
        console.error("Failed to fetch reception stats:", error);
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
            <p className="text-xs text-muted-foreground">Across all providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Check-ins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCheckins}</div>
            <p className="text-xs text-muted-foreground">Patients arriving soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.waitlist}</div>
            <p className="text-xs text-muted-foreground">Waiting for slots</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missed Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.missedCalls}</div>
            <p className="text-xs text-muted-foreground">Need callback</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => router.push("/appointments")}>
              Schedule New Appointment
            </Button>
            <Button variant="outline" onClick={() => router.push("/patients")}>
              Register New Patient
            </Button>
            <Button variant="outline" onClick={() => router.push("/appointments")}>
              View Calendar
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>All appointments for today</CardDescription>
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
            <Button className="mt-4" onClick={() => router.push("/appointments")}>
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
