export type RoleKey = "super_admin" | "admin" | "sales_representative";

export type AppPermissionKey =
  | "view_dashboard"
  | "view_quotations"
  | "create_quotations"
  | "view_users"
  | "create_users"
  | "manage_roles_permissions"
  | "view_reports";

export const DEFAULT_ROLE_LABELS: Record<RoleKey, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  sales_representative: "Sales Representative",
};

/**
 * TEMP (demo mode): hardcoded permissions per role.
 * BACKEND TODO: fetch roles/permissions for the logged-in user and hydrate this.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<RoleKey, AppPermissionKey[]> = {
  super_admin: [
    "view_dashboard",
    "view_quotations",
    "create_quotations",
    "view_users",
    "create_users",
    "manage_roles_permissions",
    "view_reports",
  ],
  admin: [
    "view_dashboard",
    "view_quotations",
    "create_quotations",
    "view_users",
    "create_users",
    "view_reports",
  ],
  sales_representative: ["view_dashboard", "view_quotations"],
};

export function hasPermission(
  role: RoleKey | null | undefined,
  permission: AppPermissionKey
) {
  if (!role) return false;
  return DEFAULT_ROLE_PERMISSIONS[role].includes(permission);
}
