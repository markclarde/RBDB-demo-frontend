import * as React from "react";
import { Download, Search } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type AuditAction = "Login" | "Create" | "Update" | "Delete";

type AuditRow = {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  resource: string;
  ip: string;
  details: Record<string, unknown>;
};

const allRows: AuditRow[] = Array.from({ length: 18 }).map((_, i) => {
  const idx = i + 1;
  const actions: AuditAction[] = ["Login", "Create", "Update", "Delete"];
  const action = actions[idx % actions.length];
  return {
    id: `A-${8000 + idx}`,
    timestamp: new Date(Date.now() - idx * 3600_000).toISOString(),
    user: ["olivia", "noah", "jin", "ava"][idx % 4] + "@company.com",
    action,
    resource: ["Quotation", "User", "Report"][idx % 3],
    ip: `10.0.1.${20 + idx}`,
    details: {
      requestId: crypto.randomUUID(),
      changes: {
        field: "status",
        from: "Pending",
        to: "Approved",
      },
    },
  };
});

export function ReportsPage() {
  const [query, setQuery] = React.useState("");

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.user.toLowerCase().includes(q) ||
        r.resource.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Audit trail reporting for key system events."
        actionLabel="Export"
        onAction={() => toast.message("Export CSV/PDF")}
      />

      <Card className="border-border/70">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search user, action, resource…"
                className="pl-9"
              />
            </div>
            <Button variant="secondary" onClick={() => toast.message("Open filter panel")}
              >Filters</Button
            >
          </div>

          <div className="mt-5 overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="bg-[hsl(var(--table-head))]">
                <TableRow>
                  <TableHead className="w-[170px]">Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="w-[120px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 10).map((r) => (
                  <Collapsible key={r.id} asChild>
                    <>
                      <TableRow className="hover:bg-muted/40">
                        <TableCell className="font-mono text-xs tabular-nums">
                          {new Date(r.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">{r.user}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              r.action === "Delete"
                                ? "destructive"
                                : r.action === "Create"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {r.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{r.resource}</TableCell>
                        <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                        <TableCell>
                          <CollapsibleTrigger asChild>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </CollapsibleTrigger>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/20">
                          <CollapsibleContent className="p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-sm font-medium">Payload</div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  navigator.clipboard
                                    .writeText(JSON.stringify(r.details, null, 2))
                                    .then(() => toast.success("Copied"))
                                }
                              >
                                <Download className="mr-2 h-4 w-4" /> Copy JSON
                              </Button>
                            </div>
                            <pre className="mt-3 overflow-auto rounded-md border bg-background p-3 text-xs leading-relaxed text-foreground">
                              {JSON.stringify(r.details, null, 2)}
                            </pre>
                          </CollapsibleContent>
                        </TableCell>
                      </TableRow>
                    </>
                  </Collapsible>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>Showing 10 of {rows.length}</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
