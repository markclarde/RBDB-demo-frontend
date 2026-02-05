import { ArrowUpRight, FilePlus2, UserPlus, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const stats = [
  {
    label: "Total quotations",
    value: "1,284",
    delta: "+8.1%",
  },
  {
    label: "Active users",
    value: "86",
    delta: "+2.4%",
  },
  {
    label: "Recent activity",
    value: "312",
    delta: "+12.0%",
  },
  {
    label: "Open approvals",
    value: "14",
    delta: "-3.2%",
  },
];

const activity = [
  {
    title: "Quotation Q-1042 created",
    meta: "2m ago · by Olivia Park",
  },
  {
    title: "User ‘j.chen@company.com’ added",
    meta: "18m ago · by Admin",
  },
  {
    title: "Quotation Q-1039 updated",
    meta: "1h ago · by Noah Singh",
  },
  {
    title: "Audit export generated",
    meta: "Today · by Admin",
  },
  {
    title: "User ‘a.garcia@company.com’ deactivated",
    meta: "Yesterday · by Admin",
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of key operational metrics and recent changes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-4">
              <div className="text-2xl font-semibold tracking-tight tabular-nums">
                {s.value}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {s.delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/70 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold tracking-tight">
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-between" variant="secondary">
              <span className="flex items-center gap-2">
                <FilePlus2 className="h-4 w-4" /> New quotation
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="secondary">
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Add user
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button className="w-full justify-between" variant="secondary">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> View audit logs
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold tracking-tight">
                Activity feed
              </CardTitle>
              <span className="text-xs text-muted-foreground">Last 24 hours</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.map((a, idx) => (
              <div key={a.title}>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-medium text-foreground">
                    {a.title}
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {a.meta}
                  </div>
                </div>
                {idx < activity.length - 1 ? (
                  <Separator className="my-3" />
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
