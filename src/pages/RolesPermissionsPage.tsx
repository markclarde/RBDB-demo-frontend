import * as React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { useRbac, DEMO_ROLE_OPTIONS } from "@/hooks/useRbac";
import {
  DEFAULT_ROLE_LABELS,
  DEFAULT_ROLE_PERMISSIONS,
  type RoleKey,
  type AppPermissionKey,
} from "@/lib/rbac";

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

const permissionSchema = z.object({
  name: z.string().min(1, "Permission name is required"),
  description: z.string().min(1, "Description is required"),
  roles: z.array(z.enum(["super_admin", "admin", "sales_representative"]))
    .min(1, "Select at least one role"),
});

type PermissionFormValues = z.infer<typeof permissionSchema>;

const DEMO_PERMISSION_OPTIONS: Array<{ value: AppPermissionKey; label: string; description: string }> = [
  { value: "view_dashboard", label: "View dashboard", description: "Access the dashboard page." },
  { value: "view_quotations", label: "View quotations", description: "See quotations list and details." },
  { value: "create_quotations", label: "Create quotations", description: "Create new quotations." },
  { value: "view_users", label: "View users", description: "See users list." },
  { value: "create_users", label: "Create users", description: "Create new users." },
  { value: "view_reports", label: "View reports", description: "Access audit reports." },
  { value: "manage_roles_permissions", label: "Manage roles & permissions", description: "Create roles and assign permissions." },
];

export function RolesPermissionsPage() {
  const rbac = useRbac();

  const roleForm = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "" },
  });

  const permForm = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { name: "", description: "", roles: ["admin"] },
  });

  if (!rbac.can("manage_roles_permissions")) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Roles & Permissions"
          description="You do not have access to this page."
        />
        <Card className="border-border/70">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Required permission: <span className="font-mono">manage_roles_permissions</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Create roles and permissions (demo UI)."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardContent className="pt-6">
            <div className="text-sm font-semibold tracking-tight">Create role</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Simple role form (name only).
            </p>
            <Separator className="my-4" />

            <form
              className="space-y-4"
              onSubmit={roleForm.handleSubmit(async (values) => {
                toast.success(`Role created: ${values.name}`);
                roleForm.reset();
              })}
            >
              <div className="space-y-2">
                <Label htmlFor="roleName" className="text-xs uppercase tracking-wider">
                  Role name
                </Label>
                <Input id="roleName" {...roleForm.register("name")} placeholder="e.g. finance_manager" />
                {roleForm.formState.errors.name ? (
                  <p className="text-sm text-destructive">
                    {roleForm.formState.errors.name.message}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={roleForm.formState.isSubmitting}>
                  {roleForm.formState.isSubmitting ? "Creating…" : "Create role"}
                </Button>
              </div>

              <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">Backend TODO</div>
                <div className="mt-1">Wire to <span className="font-mono">POST /api/roles</span>.</div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardContent className="pt-6">
            <div className="text-sm font-semibold tracking-tight">Create permission</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Permission has name, description, and is connected to roles.
            </p>
            <Separator className="my-4" />

            <form
              className="space-y-4"
              onSubmit={permForm.handleSubmit(async (values) => {
                toast.success(`Permission created: ${values.name}`);
                permForm.reset({ name: "", description: "", roles: ["admin"] });
              })}
            >
              <div className="space-y-2">
                <Label htmlFor="permName" className="text-xs uppercase tracking-wider">
                  Name
                </Label>
                <Input id="permName" {...permForm.register("name")} placeholder="e.g. approve_quotation" />
                {permForm.formState.errors.name ? (
                  <p className="text-sm text-destructive">
                    {permForm.formState.errors.name.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="permDesc" className="text-xs uppercase tracking-wider">
                  Description
                </Label>
                <Input
                  id="permDesc"
                  {...permForm.register("description")}
                  placeholder="What does this permission allow?"
                />
                {permForm.formState.errors.description ? (
                  <p className="text-sm text-destructive">
                    {permForm.formState.errors.description.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Connected roles
                </div>
                <div className="grid gap-2 rounded-md border p-3">
                  {DEMO_ROLE_OPTIONS.map((r) => {
                    const checked = permForm.watch("roles").includes(r.value);
                    return (
                      <label key={r.value} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => {
                            const next = new Set(permForm.getValues("roles"));
                            if (Boolean(v)) next.add(r.value);
                            else next.delete(r.value);
                            permForm.setValue("roles", Array.from(next) as RoleKey[], {
                              shouldDirty: true,
                            });
                          }}
                        />
                        {r.label}
                      </label>
                    );
                  })}
                </div>
                {permForm.formState.errors.roles ? (
                  <p className="text-sm text-destructive">
                    {permForm.formState.errors.roles.message as any}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={permForm.formState.isSubmitting}>
                  {permForm.formState.isSubmitting ? "Creating…" : "Create permission"}
                </Button>
              </div>

              <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">Backend TODO</div>
                <div className="mt-1">
                  Wire to <span className="font-mono">POST /api/permissions</span> and connect roles.
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardContent className="pt-6">
          <div className="text-sm font-semibold tracking-tight">Current demo access</div>
          <p className="mt-1 text-sm text-muted-foreground">
            These are the hardcoded defaults used for navigation gating.
          </p>
          <Separator className="my-4" />

          <div className="grid gap-4 md:grid-cols-3">
            {(Object.keys(DEFAULT_ROLE_LABELS) as RoleKey[]).map((role) => (
              <div key={role} className="rounded-md border p-4">
                <div className="text-sm font-semibold">{DEFAULT_ROLE_LABELS[role]}</div>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                  {DEFAULT_ROLE_PERMISSIONS[role].map((p) => (
                    <li key={p} className="font-mono text-xs">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
