export interface UserInfo {
  id: number
  username: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  user: UserInfo
}

export interface RefreshTokenResult {
  accessToken: string
  refreshToken: string
}
