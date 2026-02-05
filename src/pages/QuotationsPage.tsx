import * as React from "react";
import { MoreHorizontal, Search } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { QuotationCreateDialog } from "@/components/forms/QuotationCreateDialog";

type QuotationStatus = "Approved" | "Pending" | "Rejected";

type Quotation = {
  id: string;
  clientName: string;
  amount: number;
  status: QuotationStatus;
  createdAt: string;
};

const allRows: Quotation[] = Array.from({ length: 42 }).map((_, i) => {
  const idx = i + 1;
  const statuses: QuotationStatus[] = ["Approved", "Pending", "Rejected"];
  return {
    id: `Q-${1000 + idx}`,
    clientName: [
      "Northwind",
      "Acme Corp",
      "Globex",
      "Initech",
      "Umbrella",
      "Wayne Enterprises",
    ][idx % 6],
    amount: 12500 + (idx % 9) * 1775,
    status: statuses[idx % statuses.length],
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
  };
});

export function QuotationsPage() {
  const [query, setQuery] = React.useState("");
  const [createOpen, setCreateOpen] = React.useState(false);

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.clientName.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Search, review, and manage customer quotations."
        actionLabel="Create new"
        onAction={() => setCreateOpen(true)}
      />

      <Card className="border-border/70">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by ID, client, or status…"
                className="pl-9"
              />
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
              <Button
                className="w-full sm:w-auto"
                variant="secondary"
                onClick={() => toast.message("Filters")}
              >
                Status: All
              </Button>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-md border">
            <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-[hsl(var(--table-head))]">
                <TableRow>
                  <TableHead className="w-[140px]">ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date created</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 10).map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/40">
                    <TableCell className="font-mono text-sm">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.clientName}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      ${r.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          r.status === "Approved"
                            ? "default"
                            : r.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.message("View")}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.message("Edit")}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => toast.error("Delete")}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
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
      <QuotationCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
