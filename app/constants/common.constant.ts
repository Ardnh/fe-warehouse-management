import type { Pagination, BaseParams } from "~/models";

export const INITIAL_PAGINATION: Pagination = {
    current_page: 1,
    page_size: 30,
    total_items: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
};

export const INITIAL_PARAMS: Pick<BaseParams, "page" | "page_size"> = {
    page: 1,
    page_size: 30,
};

export type RequestOptions = { signal?: AbortSignal };
