import * as React from "react";
import { MoreHorizontal, Search, UserPlus } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { UserCreateDialog } from "@/components/forms/UserCreateDialog";

type UserRole = "Admin" | "Manager" | "Analyst";

type UserStatus = "Active" | "Inactive";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
};

const allRows: UserRow[] = Array.from({ length: 28 }).map((_, i) => {
  const idx = i + 1;
  const roles: UserRole[] = ["Admin", "Manager", "Analyst"];
  const statuses: UserStatus[] = ["Active", "Inactive"];
  return {
    id: `U-${300 + idx}`,
    name: [
      "Olivia Park",
      "Noah Singh",
      "Jin Chen",
      "Ava Garcia",
      "Ethan Brown",
      "Mia Davis",
    ][idx % 6],
    email: [`olivia`, `noah`, `jin`, `ava`, `ethan`, `mia`][idx % 6] +
      `.${idx}@company.com`,
    role: roles[idx % roles.length],
    status: statuses[idx % statuses.length],
    lastLogin: new Date(Date.now() - idx * 3600_000 * 6).toISOString(),
  };
});

export function UsersPage() {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = React.useState(false);

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
    );
  }, [query]);

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage users, roles, and account status."
        actionLabel="Add user"
        onAction={() => setCreateOpen(true)}
      />

      <Card className="border-border/70">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, or ID…"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              {selectedCount > 0 ? (
                <Button
                  variant="secondary"
                  onClick={() => toast.message(`Bulk deactivate (${selectedCount})`)}
                >
                  Deactivate
                </Button>
              ) : null}
              <Button variant="secondary" onClick={() => toast.message("Role filter")}
                >Role: All</Button
              >
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="bg-[hsl(var(--table-head))]">
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={
                        rows.length > 0 &&
                        rows.every((r) => selected[r.id])
                      }
                      onCheckedChange={(v) => {
                        const checked = Boolean(v);
                        const next: Record<string, boolean> = {};
                        rows.forEach((r) => (next[r.id] = checked));
                        setSelected(next);
                      }}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last login</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 10).map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/40">
                    <TableCell>
                      <Checkbox
                        checked={Boolean(selected[r.id])}
                        onCheckedChange={(v) =>
                          setSelected((s) => ({ ...s, [r.id]: Boolean(v) }))
                        }
                        aria-label={`Select ${r.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={r.status === "Active" ? "default" : "outline"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {new Date(r.lastLogin).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.message("Edit")}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.message("Toggle status")}>
                            Activate/Deactivate
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
      <UserCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
