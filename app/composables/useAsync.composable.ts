// ~/composables/useAsync.ts

export const isAbortError = (e: any) =>
    e?.name === "AbortError" ||
    e?.cause?.name === "AbortError" ||
    e?.code === "ERR_CANCELED";

export const useAsync = () => {
    const { createController, isCurrent, release } = useAbortController();

    const loadingMap = ref<Record<string, boolean>>({});
    const errorMap = ref<Record<string, string | null>>({});

    const isLoading = (key: string) => loadingMap.value[key] ?? false;
    const getError = (key: string) => errorMap.value[key] ?? null;

    const run = async <T>(
        key: string,
        fn: (signal: AbortSignal) => Promise<T>,
    ): Promise<T | undefined> => {
        const controller = createController(key);
        loadingMap.value[key] = true;
        errorMap.value[key] = null;
        try {
            return await fn(controller.signal);
        } catch (e: any) {
            if (isAbortError(e) || controller.signal.aborted) return undefined;
            if (isCurrent(key, controller))
                errorMap.value[key] = toErrorMessage(e);
            return undefined; // tidak melempar: pemanggil cukup cek undefined
        } finally {
            if (isCurrent(key, controller)) {
                loadingMap.value[key] = false;
                release(key, controller);
            }
        }
    };
    return { isLoading, getError, run };
};
