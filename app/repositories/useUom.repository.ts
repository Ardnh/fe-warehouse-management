import { useApi } from "~/composables";
import type { RequestOptions } from "~/constants";
import type {
    BaseResponse,
    CreateUomRequest,
    UomByIdResponse,
    UomResponse,
    UpdateUomRequest,
} from "~/models";

export const useUomRepository = () => {
    const { api } = useApi();

    return {
        FindAll: (query: Record<string, unknown>, opts?: RequestOptions) =>
            api<UomResponse>("/uom", { query, signal: opts?.signal }),
        FindById: (id: string, opts?: RequestOptions) =>
            api<UomByIdResponse>(`/uom/${id}`, { signal: opts?.signal }),
        Create: (req: CreateUomRequest, opts?: RequestOptions) =>
            api<BaseResponse>("/uom", {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
        Update: (id: string, req: UpdateUomRequest, opts?: RequestOptions) =>
            api<BaseResponse>(`/uom/${id}`, {
                method: "PUT",
                body: req,
                signal: opts?.signal,
            }),
        Delete: (id: string, opts?: RequestOptions) =>
            api<BaseResponse>(`/uom/${id}`, {
                method: "DELETE",
                signal: opts?.signal,
            }),
    };
};
