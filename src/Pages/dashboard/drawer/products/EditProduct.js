import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  Chip,
  Autocomplete,
  Stack,
} from "@mui/material";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState(["she", "he"]);
  // جلب بيانات الفئات من API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `https://daaboul.nasayimhalab.com/api/categories/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("فشل في جلب بيانات الفئات");
        }

        const data = await response.json();
        setCategories(
          data.data.results.map((category) => ({
            value: category.id,
            label: category.name,
          }))
        );
        setCategoriesLoading(false);
      } catch (error) {
        setError(error.message);
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      category: "",
      price: "",
      tags: [],
      photos: [1],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("اسم المنتج (عربي) مطلوب"),
      name_en: Yup.string().required("اسم المنتج (إنجليزي) مطلوب"),
      description_ar: Yup.string().required("الوصف العربي مطلوب"),
      description_en: Yup.string().required("الوصف الإنجليزي مطلوب"),
      category: Yup.string().required("الفئة مطلوبة"),
      price: Yup.number()
        .required("السعر مطلوب")
        .positive("يجب أن يكون السعر رقم موجب"),
      tags: Yup.array(),
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("accessToken");

        const requestBody = {
          translations: {
            ar: {
              name: values.name,
              brief: values.description_ar,
            },
            en: {
              name: values.name_en,
              brief: values.description_en,
            },
          },
          category: values.category,
          tags: values.tags.join(", "), // تحويل المصفوفة إلى سلسلة مفصولة بفواصل
          price: values.price,
          photos: values.photos,
        };

        const response = await fetch(
          `https://daaboul.nasayimhalab.com/api/manager/products/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          setSuccess(true);
          setTimeout(() => navigate("/dashboard/products"), 50000);
        } else {
          throw new Error("فشل في تحديث المنتج");
        }
      } catch (error) {
        setError(error.message);
      }
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `https://daaboul.nasayimhalab.com/api/manager/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        // افتراض أن البيانات القادمة من الخادم بنفس الهيكل الجديد
        formik.setValues({
          name: data.translations?.ar?.name || "",
          name_en: data.translations?.en?.name || "",
          description_ar: data.translations?.ar?.brief || "",
          description_en: data.translations?.en?.brief || "",
          category: data.category || "",
          price: data.price || "",
          tags: data.tags ? data.tags.split(", ") : [], // تحويل السلسلة إلى مصفوفة
          photos: data.photos || [],
        });
      } catch (error) {
        setError("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 4, textAlign: "center" }}
        >
          تعديل المنتج: {formik.values.name}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            تم تحديث المنتج بنجاح!
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            {/* الصف الأول - أسماء المنتج */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <TextField
                sx={{ flex: 1, minWidth: 250 }}
                label="اسم المنتج (عربي)"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                required
              />

              <TextField
                sx={{ flex: 1, minWidth: 250 }}
                label="اسم المنتج (إنجليزي)"
                name="name_en"
                value={formik.values.name_en}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name_en && Boolean(formik.errors.name_en)}
                helperText={formik.touched.name_en && formik.errors.name_en}
                required
              />
            </Box>

            {/* الصف الثاني - أوصاف المنتج */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <TextField
                sx={{ flex: 1, minWidth: 250 }}
                label="الوصف العربي"
                name="description_ar"
                multiline
                rows={4}
                value={formik.values.description_ar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description_ar &&
                  Boolean(formik.errors.description_ar)
                }
                helperText={
                  formik.touched.description_ar && formik.errors.description_ar
                }
                required
              />

              <TextField
                sx={{ flex: 1, minWidth: 250 }}
                label="الوصف الإنجليزي"
                name="description_en"
                multiline
                rows={4}
                value={formik.values.description_en}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description_en &&
                  Boolean(formik.errors.description_en)
                }
                helperText={
                  formik.touched.description_en && formik.errors.description_en
                }
                required
              />
            </Box>

            {/* الصف الثالث - الفئة والسعر */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <TextField
                select
                sx={{ flex: 1, minWidth: 250 }}
                label="الفئة"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                helperText={formik.touched.category && formik.errors.category}
                required
              >
                {categories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                sx={{ flex: 1, minWidth: 250 }}
                label="السعر"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                required
                InputProps={{
                  endAdornment: "SYP",
                }}
              />
            </Box>

            {/* الوسوم */}
            <Autocomplete
              multiple
              options={availableTags}
              freeSolo
              value={formik.values.tags}
              onChange={(event, newValue) => {
                formik.setFieldValue("tags", newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField {...params} label="الوسوم" placeholder="أضف وسم" />
              )}
            />

            {/* أزرار التحكم */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                sx={{ flex: 1 }}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "حفظ التعديلات"
                )}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/dashboard/products")}
                sx={{ flex: 1 }}
              >
                إلغاء
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProduct;
