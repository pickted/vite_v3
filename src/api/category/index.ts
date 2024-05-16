import {request} from "@/utils/service";

export function categoryList(params?: any) {
  return request<any>({
    url: "/category/list",
    method: "get",
    params: params
  })
}
