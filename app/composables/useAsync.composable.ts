export type RunOptions = {
    /** dipanggil dengan error asli sebelum errorMap diisi — untuk penanganan khusus */
    onError?: (e: any) => void;
    /** jangan tulis ke errorMap (mis. error ditangani sendiri lewat onError) */
    silent?: boolean;
};

export const useAsync = () => {
    const { createController, isCurrent, release, abort, abortAll } =
        useAbortController();

    const loadingMap = ref<Record<string, boolean>>({});
    const errorMap = ref<Record<string, string | null>>({});

    const isLoading = (key: string) => loadingMap.value[key] ?? false;
    const getError = (key: string) => errorMap.value[key] ?? null;
    const clearError = (key: string) => {
        errorMap.value[key] = null;
    };

    /**
     * Menjalankan fn dengan pengelolaan loading, error, dan pembatalan.
     * Mengembalikan undefined bila gagal ATAU dibatalkan — pemanggil cukup cek `if (!res) return`.
     * Karena itu, fn tidak boleh mengembalikan undefined sebagai nilai sukses.
     */
    const run = async <T>(
        key: string,
        fn: (signal: AbortSignal) => Promise<T>,
        opts?: RunOptions,
    ): Promise<T | undefined> => {
        const controller = createController(key);
        loadingMap.value[key] = true;
        errorMap.value[key] = null;

        try {
            return await fn(controller.signal);
        } catch (e: any) {
            // dibatalkan request yang lebih baru — bukan kegagalan, diamkan
            if (isAbortError(e) || controller.signal.aborted) return undefined;

            // hanya request terbaru yang boleh menulis error
            if (isCurrent(key, controller)) {
                opts?.onError?.(e);
                if (!opts?.silent) errorMap.value[key] = toErrorMessage(e);
            }
            return undefined;
        } finally {
            // hanya request terbaru yang boleh mematikan loading
            if (isCurrent(key, controller)) {
                loadingMap.value[key] = false;
                release(key, controller);
            }
        }
    };

    return { run, isLoading, getError, clearError, abort, abortAll };
};
