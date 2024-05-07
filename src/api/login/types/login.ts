export interface LoginRequestData {
  /** admin 或 editor */
  account: "admin" | "editor"
  /** 密码 */
  password: string
  /** 验证码 */
  code?: string
}

interface AccountInfo {
  account: string
  nickName: string
  operatorId: string
  ip: string
  accessPath: string
  roles: []
}

export type LoginCodeResponseData = ApiResponseData<string>

export type LoginResponseData = ApiResponseData<{ temporaryToken: string }>

export type UserInfoResponseData = ApiResponseData<AccountInfo>
