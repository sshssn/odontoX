"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, CreditCard, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { LoadingCard } from "@/components/loading-state";
import { useRouter } from "next/navigation";

export function PatientDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    nextAppointment: "--",
    documents: 0,
    outstandingBalance: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointments, invoices] = await Promise.all([
          api.appointments.list(),
          api.invoices.list(),
        ]);

        // Find next appointment
        const upcoming = appointments
          .filter((apt: any) => new Date(apt.startAt) > new Date())
          .sort((a: any, b: any) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

        const nextDate = upcoming[0]
          ? new Date(upcoming[0].startAt).toLocaleDateString()
          : "--";

        // Calculate outstanding balance
        const balance = invoices
          .filter((inv: any) => ["issued", "overdue"].includes(inv.status))
          .reduce((sum: number, inv: any) => sum + parseFloat(inv.balanceDue || 0), 0);

        setStats({
          nextAppointment: nextDate,
          documents: 0, // Will be calculated when documents API is available
          outstandingBalance: balance,
          unreadMessages: 0, // Will be calculated when messages API is available
        });
      } catch (error) {
        console.error("Failed to fetch patient stats:", error);
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
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nextAppointment}</div>
            <p className="text-xs text-muted-foreground">
              {stats.nextAppointment === "--" ? "No upcoming appointments" : "Scheduled"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documents}</div>
            <p className="text-xs text-muted-foreground">Available documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.outstandingBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total due</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your care</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => router.push("/my-appointments")}>
              View Appointments
            </Button>
            <Button variant="outline" onClick={() => router.push("/my-documents")}>
              View Documents
            </Button>
            <Button variant="outline" onClick={() => router.push("/my-billing")}>
              View Billing
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.outstandingBalance > 0 ? (
              <p className="text-sm">
                You have an outstanding balance of ${stats.outstandingBalance.toFixed(2)}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
