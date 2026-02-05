import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Branch } from "@/types/branch";
import { getBranches } from "@/api/branches";

const schema = z.object({
  branch: z.string().min(1, "Select a branch"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = React.useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      branch: "",
      username: "",
      password: "",
      remember: true,
    },
    mode: "onSubmit",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await auth.login(
        values.username,
        values.password,
        Number(values.branch)
      );
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    }
  });

  React.useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await getBranches();
        setBranches(data);
      } catch (error: any) {
        toast.error(error.message || "Unable to load branches");
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="relative min-h-svh bg-[hsl(var(--app-bg))]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_55%)]" />
      <div className="relative mx-auto flex min-h-svh max-w-[420px] items-center px-6">
        <Card className="w-full border-border/70 shadow-[0_12px_40px_rgba(2,6,23,0.08)]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl font-semibold tracking-tight">
              Sign in
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Use your enterprise credentials to access the dashboard.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-xs uppercase tracking-wider">
                  Branch
                </Label>
                <div className="relative">
                  <select
                    aria-label="Branch"
                    id="branch"
                    className={cn(
                      "flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      form.formState.errors.branch && "border-destructive"
                    )}
                    value={form.watch("branch")}
                    onChange={(e) =>
                      form.setValue("branch", e.target.value, { shouldDirty: true })
                    }
                    disabled={loadingBranches}
                  >
                    <option value="" disabled>
                      {loadingBranches ? "Loading branches..." : "Select a branch"}
                    </option>

                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    ▾
                  </span>
                </div>
                {form.formState.errors.branch ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.branch.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs uppercase tracking-wider">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="superadmin"
                  autoComplete="username"
                  {...form.register("username")}
                />
                {form.formState.errors.username ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs uppercase tracking-wider"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...form.register("password")}
                />
                {form.formState.errors.password ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox
                    checked={form.watch("remember")}
                    onCheckedChange={(v) =>
                      form.setValue("remember", Boolean(v), {
                        shouldDirty: true,
                      })
                    }
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className={cn(
                    "text-sm font-medium text-primary hover:underline",
                    "underline-offset-4"
                  )}
                  onClick={() => toast.message("Contact your admin to reset password")}
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
