import * as React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRbac, DEMO_ROLE_OPTIONS } from "@/hooks/useRbac";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["super_admin", "admin", "sales_representative"]),
});

type FormValues = z.infer<typeof schema>;

export function UserCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const rbac = useRbac();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", role: "sales_representative" },
  });

  const canCreate = rbac.can("create_users");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Add a new user to your organization (demo form).
          </DialogDescription>
        </DialogHeader>

        {!canCreate ? (
          <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
            You don’t have permission to create users.
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              toast.success(`User created: ${values.email}`);
              onOpenChange(false);
              form.reset();
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase tracking-wider">
                Name
              </Label>
              <Input id="name" {...form.register("name")} placeholder="Jane Doe" />
              {form.formState.errors.name ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="jane@company.com"
              />
              {form.formState.errors.email ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs uppercase tracking-wider">
                Role
              </Label>
              <div className="relative">
                <select
                aria-label="branch"
                  id="role"
                  className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={form.watch("role")}
                  onChange={(e) =>
                    form.setValue("role", e.target.value as FormValues["role"], {
                      shouldDirty: true,
                    })
                  }
                >
                  {DEMO_ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  ▾
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating…" : "Create user"}
              </Button>
            </div>

            <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
              <div className="font-medium text-foreground">Backend TODO</div>
              <div className="mt-1">Wire this to <span className="font-mono">POST /api/users</span>.</div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
