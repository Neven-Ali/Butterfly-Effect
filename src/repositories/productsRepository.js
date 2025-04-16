import axios from "axios";
export const productsRepository = async (
  page = 1,
  pageSize = 2,
  searchQuery = ""
) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      "https://daaboul.nasayimhalab.com/api/manager/products/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          page_size: pageSize,
          search: searchQuery,
        },
      }
    );

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
};
