"use client";

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
import { Plus, Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function StaffPage() {
  return (
    <SidebarProvider>
      <AppSidebar role="ORG_ADMIN" />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Staff Management</BreadcrumbPage>
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
              <h2 className="text-2xl font-bold tracking-tight">Staff Members</h2>
              <p className="text-muted-foreground">
                Manage your organization's team members
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Staff
            </Button>
          </div>

          <EmptyState
            icon={Users}
            title="No staff members yet"
            description="Start building your team by inviting staff members"
            action={{
              label: "Invite First Member",
              onClick: () => {},
            }}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


