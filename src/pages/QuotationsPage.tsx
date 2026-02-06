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

import { getQuotations } from "@/api/quotations";
import type { Quotation } from "@/types/quotation";
import { QuotationCreateDialog } from "@/components/forms/QuotationCreateDialog";

export function QuotationsPage() {
  const [query, setQuery] = React.useState("");
  const [rows, setRows] = React.useState<Quotation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [openCreate, setOpenCreate] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        const data = await getQuotations();
        setRows(data);
      } catch (err) {
        toast.error("Failed to load quotations");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredRows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter(
      (r) =>
        r.quotation_number.toLowerCase().includes(q) ||
        r.client_name.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Quotations"
          description="Search, review, and manage customer quotations."
        />

        <Button onClick={() => setOpenCreate(true)}>
          Add Quotation
        </Button>
      </div>

      <Card className="border-border/70">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by quotation no, client, or status…"
                className="pl-9"
              />
            </div>
          </div>

          <div className="mt-5 rounded-md border">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-[hsl(var(--table-head))]">
                <TableRow>
                  <TableHead className="w-[15%]">Quotation No</TableHead>
                  <TableHead className="w-[10%]">Date</TableHead>
                  <TableHead className="w-[18%]">Client</TableHead>
                  <TableHead className="w-[18%]">Sales Representative</TableHead>
                  <TableHead className="w-[12%] text-left">Amount</TableHead>
                  <TableHead className="w-[12%]">Status</TableHead>
                  <TableHead className="w-[10%]">Last Contact</TableHead>
                  <TableHead className="w-[5%] text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No quotations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.slice(0, 10).map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-sm break-words">
                        {r.quotation_number}
                      </TableCell>

                      <TableCell>
                        {new Date(r.created_at).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="font-medium break-words">
                        {r.client_name}
                      </TableCell>

                      <TableCell className="break-words">
                        {r.sales_rep.profile
                          ? `${r.sales_rep.profile.first_name} ${r.sales_rep.profile.last_name}`
                          : r.sales_rep.username}
                      </TableCell>

                      <TableCell className="text-left font-mono tabular-nums">
                        ₱
                        {Number(r.amount).toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            r.status === "APPROVED"
                              ? "default"
                              : r.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {r.last_contact_at
                          ? new Date(r.last_contact_at).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {Math.min(10, filteredRows.length)} of{" "}
              {filteredRows.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <QuotationCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
      />
    </div>
  );
}
