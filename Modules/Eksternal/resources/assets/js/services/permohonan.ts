import axios from "axios";

export const checkProfileStatus = async () => {
  try {
    const response = await axios.get("/api/eksternal/profile/check-status", {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error("Gagal mengecek status profil:", error);
    throw error;
  }
};
