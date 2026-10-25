export type RunResult<T> = { ok: true; data: T } | { ok: false; error?: AppError } // error kosong = dibatalkan, tidak perlu ditampilkan

export const useAsync = () => {
    const { createController, isCurrent, release, abort, abortAll } = useAbortController()

    const loadingMap = ref<Record<string, boolean>>({})

    const isLoading = (key: string) => loadingMap.value[key] ?? false

    /**
     * Menjalankan fn dengan pengelolaan loading dan pembatalan.
     * Tidak pernah melempar error, hasilnya selalu berupa RunResult:
     * - sukses:   { ok: true, data }
     * - gagal:    { ok: false, error }
     * - dibatalkan / digantikan request lebih baru: { ok: false } (tanpa error)
     */
    const run = async <T>(key: string, fn: (signal: AbortSignal) => Promise<T>): Promise<RunResult<T>> => {
        const controller = createController(key)
        loadingMap.value[key] = true

        try {
            return { ok: true, data: await fn(controller.signal) }
        } catch (e) {
            // dibatalkan atau sudah digantikan request yang lebih baru: bukan kegagalan, diamkan
            if (isAbortError(e) || controller.signal.aborted || !isCurrent(key, controller)) {
                return { ok: false }
            }

            return { ok: false, error: new AppError(e) }
        } finally {
            // hanya request terbaru yang boleh mematikan loading
            if (isCurrent(key, controller)) {
                loadingMap.value[key] = false
                release(key, controller)
            }
        }
    }

    return { run, isLoading, abort, abortAll }
}
