export const useAbortController = () => {
    const controllers = new Map<string, AbortController>();

    // abort request sebelumnya dengan key yang sama, lalu buat controller baru
    const createController = (key: string) => {
        controllers.get(key)?.abort();
        const controller = new AbortController();
        controllers.set(key, controller);
        return controller;
    };

    const getSignal = (key: string) => createController(key).signal;

    // apakah controller ini masih yang terbaru untuk key tsb
    const isCurrent = (key: string, controller: AbortController) =>
        controllers.get(key) === controller;

    // hapus dari map hanya kalau masih miliknya sendiri
    const release = (key: string, controller: AbortController) => {
        if (controllers.get(key) === controller) controllers.delete(key);
    };

    const abort = (key: string) => {
        controllers.get(key)?.abort();
        controllers.delete(key);
    };

    const abortAll = () => {
        controllers.forEach((c) => c.abort());
        controllers.clear();
    };

    onScopeDispose(abortAll);

    return { getSignal, createController, isCurrent, release, abort, abortAll };
};
