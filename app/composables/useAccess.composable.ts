export const useAccess = () => {
    const userStore = useUserStore()
    const { getPermissions } = storeToRefs(userStore)

    const permissionSet = computed(() => new Set(getPermissions.value))
    const hasAccess = (reqAccess: string): boolean => permissionSet.value.has(reqAccess)

    return {
        hasAccess,
    }
}
