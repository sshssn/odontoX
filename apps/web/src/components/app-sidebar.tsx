"use client";

import * as React from "react";
import {
  Users,
  Calendar,
  CreditCard,
  Settings2,
  LayoutDashboard,
  FileText,
  Stethoscope,
  Building2,
  UserCircle,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { AppRole } from "@/lib/rbac";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: AppRole;
}

const roleBasedNavigation: Record<AppRole, any> = {
  SUPER_ADMIN: {
    main: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Tenants",
        url: "/admin/tenants",
        icon: Building2,
      },
      {
        title: "Plans & Features",
        url: "/admin/plans",
        icon: CreditCard,
      },
      {
        title: "Usage & Billing",
        url: "/admin/usage",
        icon: FileText,
      },
    ],
    secondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
    ],
  },
  ORG_ADMIN: {
    main: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Staff Management",
        url: "/org/staff",
        icon: Users,
      },
      {
        title: "Locations",
        url: "/org/locations",
        icon: Building2,
      },
      {
        title: "Billing",
        url: "/org/billing",
        icon: CreditCard,
      },
    ],
    secondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
    ],
  },
  DENTIST: {
    main: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Schedule",
        url: "/schedule",
        icon: Calendar,
      },
      {
        title: "Patients",
        url: "/patients",
        icon: Users,
      },
      {
        title: "Treatment Plans",
        url: "/treatments",
        icon: ClipboardList,
      },
      {
        title: "Clinical Notes",
        url: "/notes",
        icon: FileText,
      },
    ],
    secondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
    ],
  },
  RECEPTION: {
    main: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Appointments",
        url: "/appointments",
        icon: Calendar,
      },
      {
        title: "Patients",
        url: "/patients",
        icon: Users,
      },
      {
        title: "Check-in",
        url: "/checkin",
        icon: ClipboardList,
      },
      {
        title: "Messages",
        url: "/messages",
        icon: MessageSquare,
      },
    ],
    secondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
    ],
  },
  BILLING: {
    main: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "Invoices",
        url: "/invoices",
        icon: FileText,
      },
      {
        title: "Payments",
        url: "/payments",
        icon: CreditCard,
      },
      {
        title: "Patients",
        url: "/patients",
        icon: Users,
      },
      {
        title: "Reports",
        url: "/reports",
        icon: ClipboardList,
      },
    ],
    secondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
    ],
  },
  PATIENT: {
    main: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
      {
        title: "My Appointments",
        url: "/my-appointments",
        icon: Calendar,
      },
      {
        title: "Documents",
        url: "/my-documents",
        icon: FileText,
      },
      {
        title: "Billing",
        url: "/my-billing",
        icon: CreditCard,
      },
      {
        title: "Messages",
        url: "/messages",
        icon: MessageSquare,
      },
    ],
    secondary: [
      {
        title: "Profile",
        url: "/profile",
        icon: UserCircle,
      },
    ],
  },
};

const teamData = {
  teams: [
    {
      name: "OdontoX",
      plan: "Pro",
    },
  ],
};

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const navigation = roleBasedNavigation[role] || roleBasedNavigation.PATIENT;

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamData.teams} />
        <NavMain items={navigation.main} />
      </SidebarHeader>
      <SidebarContent>
        <NavSecondary items={navigation.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
