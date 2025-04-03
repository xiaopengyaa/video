import http from '@/utils/http'
import type { FlagResponse } from '@/types/base'
import type { LoginParams, LoginResult, RefreshTokenResult, RegisterParams, UserInfo } from '@/types/auth'

export async function login(params: LoginParams) {
  const data = await http.post<FlagResponse<LoginResult>>('/auth/login', params)
  return data
}

export async function register(params: RegisterParams) {
  const data = await http.post<FlagResponse>('/auth/register', params)
  return data
}

export async function logout() {
  const data = await http.post('/auth/logout')
  return data
}

export async function getUserInfo() {
  const data = await http.get<UserInfo>('/auth/userInfo')
  return data
}

export async function refreshToken(refreshToken: string) {
  const data = await http.post<RefreshTokenResult>('/auth/refresh', { refreshToken })
  return data
}
