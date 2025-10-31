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
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SuperAdminDashboard } from "@/components/dashboards/super-admin-dashboard";
import { OrgAdminDashboard } from "@/components/dashboards/org-admin-dashboard";
import { DentistDashboard } from "@/components/dashboards/dentist-dashboard";
import { ReceptionDashboard } from "@/components/dashboards/reception-dashboard";
import { PatientDashboard } from "@/components/dashboards/patient-dashboard";
import type { AppRole } from "@/lib/rbac";

const dashboardTitles: Record<AppRole, string> = {
  SUPER_ADMIN: "Platform Admin Dashboard",
  ORG_ADMIN: "Organization Dashboard",
  DENTIST: "Provider Dashboard",
  RECEPTION: "Front Desk Dashboard",
  PATIENT: "Patient Portal",
};

export default async function DashboardPage() {
  // Ensure headers are available in the request context
  await headers();
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const role = (session as any).role as AppRole | undefined;
  
  if (!role) {
    redirect("/login");
  }

  const title = dashboardTitles[role] || "Dashboard";

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>
        
        {role === "SUPER_ADMIN" && <SuperAdminDashboard />}
        {role === "ORG_ADMIN" && <OrgAdminDashboard />}
        {role === "DENTIST" && <DentistDashboard />}
        {role === "RECEPTION" && <ReceptionDashboard />}
        {role === "PATIENT" && <PatientDashboard />}
      </SidebarInset>
    </SidebarProvider>
  );
}
