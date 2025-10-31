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
import { Plus } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ slug: "", name: "" });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const data = await api.admin.tenants.list();
      setTenants(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tenants",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.admin.tenants.create(formData);
      toast({
        title: "Success",
        description: "Tenant created successfully",
      });
      setOpen(false);
      setFormData({ slug: "", name: "" });
      fetchTenants();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tenant",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: "name" as const,
    },
    {
      header: "Slug",
      accessor: "slug" as const,
      cell: (value: string) => (
        <Badge variant="outline" className="font-mono text-xs">
          {value}
        </Badge>
      ),
    },
    {
      header: "Created",
      accessor: "createdAt" as const,
      cell: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      header: "Status",
      accessor: (row: any) => <Badge variant="default">Active</Badge>,
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar role="SUPER_ADMIN" />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Tenants</BreadcrumbPage>
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
              <h2 className="text-2xl font-bold tracking-tight">Tenants</h2>
              <p className="text-muted-foreground">
                Manage all organizations in the system
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Tenant
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Create New Tenant</DialogTitle>
                    <DialogDescription>
                      Add a new organization to the system
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Organization Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Acme Dental Clinic"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        placeholder="acme-dental"
                        pattern="[a-z0-9-]+"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Lowercase letters, numbers, and hyphens only
                      </p>
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
                      {submitting ? "Creating..." : "Create Tenant"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <LoadingTable rows={5} />
          ) : tenants.length === 0 ? (
            <EmptyState
              title="No tenants found"
              description="Get started by creating your first tenant"
              action={{
                label: "Create Tenant",
                onClick: () => setOpen(true),
              }}
            />
          ) : (
            <DataTable
              data={tenants}
              columns={columns}
              searchable
              searchPlaceholder="Search tenants..."
            />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


