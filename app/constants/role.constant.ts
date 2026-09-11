export type RoleStatus = "ACTIVE" | "INACTIVE";
export const ROLE_KEYS = {
    findAllRoles: "role.findAllRoles",
    findRoleById: "role.findRoleById",
    createRole: "role.createRole",
    updateRole: "role.updateRole",
    deleteRole: "role.deleteRole",
} as const;
