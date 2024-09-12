import { DefaultApiResponse } from "../types/api"
import { LayananItem, ParamsStatisticLayanan, StatisticLayanan } from "../types/dashboard"
import api from "../utils/api"

export const getSummaryLayanan = async (params: ParamsStatisticLayanan) => {
  try {
    const { data } = await api.get<DefaultApiResponse<StatisticLayanan>>('/eksternal/layanan/summary', { params })
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getAllLayanan = async () => {
  try {
    const { data } = await api.get<DefaultApiResponse<LayananItem[]>>('/eksternal/dashboard/layanan')
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}