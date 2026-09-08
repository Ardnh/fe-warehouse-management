import type { PermissionAction } from "~/models";
import type { TableColumn } from "@nuxt/ui";

export const columns: TableColumn<PermissionAction>[] = [
    {
        accessorKey: "id",
        header: "#",
        cell: ({ row }) => `#${row.getValue("id")}`,
    },
];
