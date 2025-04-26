import axios from "axios";

const api = axios.create({
  baseURL: "https://daaboul.nasayimhalab.com/api",
});
const photosRepository = {
  getPhotos: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/manager/photos/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data.results.map((photo) => ({
        id: photo.id,
        name: photo.name,
        url: photo.datafile,
        width: photo.width,
        height: photo.height,
        created: photo.created,
      }));
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch photos";
    }
  },
  deletePhoto: async (photoId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.delete(`/manager/photos/${photoId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete product";
    }
  },
  //دالة خلق صورة جديد
  createPhoto: async (formData) => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Before upload - FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const response = await api.post("/manager/photos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // الـ API يعيد كائنًا مباشرًا وليس مصفوفة
      console.log("API Response:", response.data); // سجل الاستجابة
      return response.data; // تأكد من أن هذا يعيد الكائن مباشرة
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default photosRepository;
