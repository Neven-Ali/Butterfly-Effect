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
          totalCount: response.data.data.count, // إجمالي عدد المنتجات
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

  // جلب منتج واحد بواسطة الـ ID
  getProductById: async (id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/manager/products/${id}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  },

  // تحديث المنتج
  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/manager/products/${id}`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            // أضف أي headers أخرى مطلوبة (مثل Authorization)
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update product"
      );
    }
  },

  // جلب الأصناف المتاحة
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  },

  // جلب التاغات المتاحة
  // getTags: async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/tags`);
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(error.response?.data?.message || "Failed to fetch tags");
  //   }
  // },
};
export default productsRepository;
