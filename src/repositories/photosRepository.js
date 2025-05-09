import axios from "axios";

const api = axios.create({
  baseURL: "https://daaboul.nasayimhalab.com/api",
});
const photosRepository = {
  getPhotos: async (page = 1, pageSize = 5, searchQuery = "") => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/manager/photos/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          page_size: pageSize,
          search: searchQuery,
        },
      });

      return {
        results: response.data.data.results.map((photo) => ({
          id: photo.id,
          title: photo.name,
          url: photo.datafile,
          width: photo.width,
          height: photo.height,
          created: photo.created,
        })),
        totalCount: response.data.data.count, // العدد الكلي للصور
        pageInfo: {
          totalPages: Math.ceil(response.data.data.count / pageSize),
        },
      };
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

      // تحويل FormData إلى كائن عادي للتأكد من المحتوى
      const formDataObj = {};
      for (let [key, value] of formData.entries()) {
        formDataObj[key] = value;
      }
      console.log("FormData contents:", formDataObj);

      const response = await api.post("/manager/photos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Upload error details:",
        error.response?.data || error.message
      );
      throw error.response?.data || error;
    }
  },
};

export default photosRepository;
