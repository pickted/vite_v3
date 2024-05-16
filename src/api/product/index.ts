import {request} from "@/utils/service";

interface ProductInfo {

  productId: string

  productName: string

  productImage: string

  categoryId: string

  accountType: string

  introduction: string

  templateId: string

  createTime: number
}

export function getTableDataApi(param: any) {
  return request<any>({
    url: "/product/page/list",
    method: "get",
    params: param
  })
}

export function productInfo(productId: string) {
  return request<ApiResponseData<ProductInfo>>({
    url: "/product/info/" + productId,
    method: "get"
  })
}

export function productSave(data: any) {
  return request<ApiResponseData<string>>({
    url: "/product/insert",
    method: "post",
    data: data
  })
}

export function productUpdate(data: any) {
  return request<ApiResponseData<string>>({
    url: "/product/update",
    method: "post",
    data: data
  })
}
