import axios from "axios";

// Interface untuk menyamakan struktur data dari Laravel (alias id & nama)
export interface RegionBase {
    id: number | string;
    nama: string;
}

const API_BASE_URL = '/api/eksternal/regions';

// Konfigurasi header default untuk semua request di service ini
const axiosConfig = {
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
};

export const regionService = {
    getProvinces: async (): Promise<RegionBase[]> => {
        const res = await axios.get(`${API_BASE_URL}/provinces`, axiosConfig);
        return res.data;
    },

    getRegencies: async (provId: string | number): Promise<RegionBase[]> => {
        const res = await axios.get(`${API_BASE_URL}/regencies`, {
            ...axiosConfig,
            params: { prov_id: provId }
        });
        return res.data;
    },

    getDistricts: async (kabId: string | number): Promise<RegionBase[]> => {
        const res = await axios.get(`${API_BASE_URL}/districts`, {
            ...axiosConfig,
            params: { kab_id: kabId }
        });
        return res.data;
    }
};