import axios from "axios";
const API_BASE_URL = "https://daaboul.nasayimhalab.com/api";

const productsRepository = {
  getProducts: async (page = 1, pageSize = 2, searchQuery = "") => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/manager/products/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          page_size: pageSize,
          search: searchQuery,
        },
      });

      if (response.data.status === "success") {
        return {
          products: response.data.data.results,
          totalCount: response.data.data.count,
          pageInfo: {
            currentPage: page,
            totalPages: Math.ceil(response.data.data.count / pageSize),
            pageSize,
          },
        };
      }
      throw new Error("Failed to fetch products");
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // الدالة الجديدة لجلب المنتج بواسطة ID
  getProductById: async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `${API_BASE_URL}/manager/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch product";
    }
  },

  // الدالة الجديدة لتحديث المنتج
  updateProduct: async (id, productData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `${API_BASE_URL}/manager/products/${id}/`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update product";
    }
  },

  // الدالة الجديدة لجلب الفئات
  getCategories: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/categories/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data.results.map((category) => ({
        value: category.id,
        label: category.name,
      }));
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch categories";
    }
  },
};

export default productsRepository;
