import { DefaultApiResponse } from "../types/api"
import { ProfileType } from "../types/profile"
import api from "../utils/api"

export const getProfile = async () => {
  try {
    const { data } = await api.get<DefaultApiResponse<ProfileType | null>>('/eksternal/user')
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const changePassword = async (payload: object) => {
  try {
    const { data } = await api.patch<DefaultApiResponse<unknown>>('/eksternal/user/password', payload)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const updateProfile = async (formData: FormData) => {
  try {
    const { data } = await api.post<DefaultApiResponse<unknown>>('/eksternal/user/profile', formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const requestWhatsappOTP = async (payload: { whatsapp: string, recaptcha: string }) => {
  try {
    const { data } = await api.post<DefaultApiResponse<unknown>>('/eksternal/user/request-whatsapp-otp', payload)
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}