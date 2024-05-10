import {request} from "@/utils/service";

export function getTableDataApi(param: any) {
  return request<any>({
    url: "/product/page/list",
    method: "get",
    params: param
  })
}
