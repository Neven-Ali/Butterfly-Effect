import axios from "axios";

const api = axios.create({
  baseURL: "https://daaboul.nasayimhalab.com/api",
});
const productsRepository = {
  getProducts: async (page = 1, pageSize = 2, searchQuery = "") => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/manager/products/`, {
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
      const response = await api.get(`/manager/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to fetch product";
    }
  },

  // الدالة الجديدة لتحديث المنتج
  updateProduct: async (id, productData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.put(`/manager/products/${id}/`, productData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update product";
    }
  },

  //دالة خلق منتج جديد
  createProduct: async (productData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        `/manager/products/`, // نستخدم مسارًا بدون ID ونستخدم POST بدل PUT
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
      throw error.response?.data?.message || "Failed to create product";
    }
  },
  /// دالة حذف المنتج
  deleteProduct: async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.delete(`/manager/products/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete product";
    }
  },

  // الدالة الجديدة لجلب الفئات
  getCategories: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.get(`/categories/`, {
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
