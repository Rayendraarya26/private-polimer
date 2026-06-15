import { DefaultApiResponse } from "../types/api"
import { LayananItem, ParamsStatisticLayanan, SliderItem, StatisticLayanan } from "../types/dashboard"
import api from "../utils/api"

export const getSummaryLayanan = async (params: ParamsStatisticLayanan) => {
  try {
    const { data } = await api.get<DefaultApiResponse<StatisticLayanan>>('/eksternal/permohonan/statistik', { params })
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

export const getAllSliders = async () => {
  try {
    const { data } = await api.get<DefaultApiResponse<SliderItem[]>>('/eksternal/dashboard/banner')
    return data.results
  } catch (error) {
    return Promise.reject(error)
  }
}