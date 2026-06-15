import { useEffect, useState } from "react";
import { regionService, RegionBase } from "../../services/region-service";

const useRegions = (provId?: string, kabId?: string) => {
    const [provinces, setProvinces] = useState<RegionBase[]>([]);
    const [regencies, setRegencies] = useState<RegionBase[]>([]);
    const [districts, setDistricts] = useState<RegionBase[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch Provinsi
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await regionService.getProvinces();
                setProvinces(data);
            } catch (e) {
                console.error("Gagal mengambil provinsi", e);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch Kabupaten
    useEffect(() => {
        if (!provId) {
            setRegencies([]);
            return;
        }
        const fetchRegencies = async () => {
            setLoading(true);
            try {
                const data = await regionService.getRegencies(provId);
                setRegencies(data);
            } finally {
                setLoading(false);
            }
        };
        fetchRegencies();
    }, [provId]);

    // Fetch Kecamatan
    useEffect(() => {
        if (!kabId) {
            setDistricts([]);
            return;
        }
        const fetchDistricts = async () => {
            setLoading(true);
            try {
                const data = await regionService.getDistricts(kabId);
                setDistricts(data);
            } finally {
                setLoading(false);
            }
        };
        fetchDistricts();
    }, [kabId]);
    

    return { provinces, regencies, districts, loading };
};

export default useRegions;