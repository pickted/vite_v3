import {request} from "@/utils/service";

export function fileUpload(data: any) {
  return request<any>({
    url: "/file/uploadFile",
    method: "post",
    headers: {'Content-Type': 'multipart/form-data'},
    data: data
  })
}
