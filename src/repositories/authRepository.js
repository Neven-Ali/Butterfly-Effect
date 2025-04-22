import axios from "axios";

const api = axios.create({
  baseURL: "https://daaboul.nasayimhalab.com/api",
});

// دالة جلب الاسم
export const getUserDetails = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await api.get("/account/details/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// تعريف وظيفة تسجيل الدخول
export const login = async (values) => {
  try {
    const response = await api.post("/account/login/", values);
    return response.data; // إرجاع البيانات في حالة النجاح
  } catch (error) {
    throw error.response?.data || error.message; // رمي الخطأ في حالة الفشل
  }
};

// تعريف وظيفة التسجيل
export const register = async (values) => {
  try {
    const response = await api.post(
      "/account/register/", // رابط التسجيل
      values
    );
    return response.data; // إرجاع البيانات في حالة النجاح
  } catch (error) {
    throw error.response?.data || error.message; // رمي الخطأ في حالة الفشل
  }
};
