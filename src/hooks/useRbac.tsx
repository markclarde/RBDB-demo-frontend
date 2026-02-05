import * as React from "react";

import type { RoleKey } from "@/lib/rbac";
import {
  DEFAULT_ROLE_LABELS,
  DEFAULT_ROLE_PERMISSIONS,
  type AppPermissionKey,
  hasPermission,
} from "@/lib/rbac";

type RbacContextValue = {
  role: RoleKey;
  setRole: (role: RoleKey) => void;
  can: (permission: AppPermissionKey) => boolean;
  roleLabel: string;
};

const RbacContext = React.createContext<RbacContextValue | null>(null);

export function RbacProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<RoleKey>("super_admin");

  const can = React.useCallback(
    (permission: AppPermissionKey) => hasPermission(role, permission),
    [role]
  );

  const value = React.useMemo<RbacContextValue>(
    () => ({
      role,
      setRole,
      can,
      roleLabel: DEFAULT_ROLE_LABELS[role],
    }),
    [role, can]
  );

  return <RbacContext.Provider value={value}>{children}</RbacContext.Provider>;
}

export function useRbac() {
  const ctx = React.useContext(RbacContext);
  if (!ctx) throw new Error("useRbac must be used within RbacProvider");
  return ctx;
}

export const DEMO_ROLE_OPTIONS: Array<{ value: RoleKey; label: string }> = [
  { value: "super_admin", label: DEFAULT_ROLE_LABELS.super_admin },
  { value: "admin", label: DEFAULT_ROLE_LABELS.admin },
  { value: "sales_representative", label: DEFAULT_ROLE_LABELS.sales_representative },
];

export const DEMO_PERMISSIONS: Array<{ value: AppPermissionKey; label: string }> = (
  Object.keys(DEFAULT_ROLE_PERMISSIONS.super_admin) as any
) as any;
