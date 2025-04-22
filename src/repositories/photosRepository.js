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
};

export default photosRepository;
