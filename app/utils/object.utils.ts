export const cleanObject = (obj: Record<string, any>): Record<string, any> => {
    return Object.fromEntries(
        Object.entries(obj).filter(
            ([_, value]) => value !== undefined || value === "",
        ),
    );
};
