export function formatDate(value?: string) {
    if (!value) return "-";
    return new Date(value).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}
