import { useState, useEffect } from "react";
import { checkProfileStatus } from "../services/permohonan";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useProfileStatus = () => {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const data = await checkProfileStatus();
      setIsComplete(data.is_profile_complete);

      // Sinkronisasi LocalStorage
      const userLocal = JSON.parse(localStorage.getItem("user") || "{}");
      if (userLocal.pelanggan?.detail) {
        userLocal.pelanggan.detail.alamat = data.alamat;
        localStorage.setItem("user", JSON.stringify(userLocal));
      }
      return data.is_profile_complete;
    } catch (err) {
      setIsComplete(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  /**
   * Fungsi helper untuk memproteksi navigasi
   * @param onComplete Callback function yang dijalankan jika profil LENGKAP
   */
  const checkAndRun = async (onComplete: () => void) => {

    if (isLoading) return;

    if (isComplete) {
      onComplete();
    } else {
      // Tampilkan toast error dengan tombol update
      toast.error((t) => (
        <span>
          <b>Profil Belum Lengkap!</b>
          <button
            className="btn btn-sm btn-primary ms-2"
            onClick={() => {
              toast.dismiss(t.id);
              navigate("/profile/update");
            }}
          >
            Update
          </button>
        </span>
      ), { duration: 4000 });
    }
  };

  return { isComplete, isLoading, checkAndRun, refreshStatus: fetchStatus };
};