import axios from "axios";

// تعريف وظيفة تسجيل الدخول
export const login = async (values) => {
  try {
    const response = await axios.post(
      "https://daaboul.nasayimhalab.com/api/account/login/",
      values
    );
    return response.data; // إرجاع البيانات في حالة النجاح
  } catch (error) {
    throw error.response?.data || error.message; // رمي الخطأ في حالة الفشل
  }
};
// تعريف وظيفة التسجيل
export const register = async (values) => {
  try {
    const response = await axios.post(
      "https://daaboul.nasayimhalab.com/api/account/register/", // رابط التسجيل
      values
    );
    return response.data; // إرجاع البيانات في حالة النجاح
  } catch (error) {
    throw error.response?.data || error.message; // رمي الخطأ في حالة الفشل
  }
};
