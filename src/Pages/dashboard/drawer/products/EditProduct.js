import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
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
import productsRepository from "../../../../repositories/productsRepository"; // استيراد الـ repository الجديد

const API_BASE_URL = "https://daaboul.nasayimhalab.com/api";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState(["she", "he"]);
  const [initialProductData, setInitialProductData] = useState(null);
  const [productDetails, setProductDetails] = useState(null);

  // const getProductById = async (id) => {
  //   try {
  //     const token = localStorage.getItem("accessToken");
  //     const response = await axios.get(
  //       `https://daaboul.nasayimhalab.com/api/manager/products/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     return response.data.data; // عدل هذا السطر
  //   } catch (error) {
  //     throw new Error(
  //       error.response?.data?.message || "Failed to fetch product"
  //     );
  //   }
  // };

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const token = localStorage.getItem("accessToken");
  //       const response = await fetch(
  //         `https://daaboul.nasayimhalab.com/api/categories/`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("فشل في جلب بيانات الفئات");
  //       }

  //       const data = await response.json();
  //       setCategories(
  //         data.data.results.map((category) => ({
  //           value: category.id,
  //           label: category.name,
  //         }))
  //       );
  //       setCategoriesLoading(false);
  //     } catch (error) {
  //       setError(error.message);
  //       setCategoriesLoading(false);
  //     }
  //   };

  //   fetchCategories();
  // }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await productsRepository.getCategories();
        setCategories(categoriesData);
        setCategoriesLoading(false);
      } catch (error) {
        setError(error.message);
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await productsRepository.getProductById(id);
        setProductDetails(product);

        setInitialProductData({
          name: product.translations?.ar?.name || "",
          name_en: product.translations?.en?.name || "",
          description_ar: product.translations?.ar?.brief || "",
          description_en: product.translations?.en?.brief || "",
          category: product.category || "",
          price: product.price || "",
          model: product.model || "",
          tags: product.tags ? product.tags.split(", ") : [],
          photos: product.photos_list || [],
        });
      } catch (error) {
        setError("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const product = await getProductById(id);
  //       setProductDetails(product);

  //       setInitialProductData({
  //         name: product.translations?.ar?.name || "",
  //         name_en: product.translations?.en?.name || "",
  //         description_ar: product.translations?.ar?.brief || "",
  //         description_en: product.translations?.en?.brief || "",
  //         category: product.category || "",
  //         price: product.price || "",
  //         model: product.model || "",
  //         tags: product.tags ? product.tags.split(", ") : [],
  //         photos: product.photos_list || [],
  //       });
  //     } catch (error) {
  //       setError("Error fetching product");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProduct();
  // }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialProductData || {
      name: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      category: "",
      price: "",
      model: "",
      tags: [],
      photos: [1],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name in arabic is required"),
      name_en: Yup.string().required("Product name in english is required"),
      description_ar: Yup.string().required("Arabic description is required"),
      description_en: Yup.string().required("English description is required"),
      category: Yup.string().required("Category is required"),
      price: Yup.number()
        .required("Price is required")
        .positive("Price must be Positive"),
      model: Yup.number()
        .typeError("Model must be integer")
        .integer("Model must be integer")
        .required("Model is required"),
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
          tags: values.tags.join(", "),
          price: values.price,
          model: values.model,
          photos: values.photos,
        };

        //       const response = await fetch(
        //         `https://daaboul.nasayimhalab.com/api/manager/products/${id}/`,
        //         {
        //           method: "PUT",
        //           headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${token}`,
        //           },
        //           body: JSON.stringify(requestBody),
        //         }
        //       );

        //       if (response.ok) {
        //         setSuccess(true);
        //         setTimeout(() => navigate("/dashboard/products"), 2000);
        //       } else {
        //         throw new Error("فشل في تحديث المنتج");
        //       }
        //     } catch (error) {
        //       setError(error.message);
        //     }
        //   },
        // });
        await productsRepository.updateProduct(id, requestBody);
        setSuccess(true);
        setTimeout(() => navigate("/dashboard/products"), 2000);
      } catch (error) {
        setError(error.message);
      }
    },
  });

  if (loading || !initialProductData) {
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
          Modify the product: {formik.values.name_en}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Product updated successfully!
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            {/* باقي نموذج التعديل كما هو */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <TextField
                sx={{ flex: 1, minWidth: 250 }}
                label="Product name in Arabic"
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
                label="Product name in English"
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
                label="Arabic description"
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
                label="English description"
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

            {/* الصف الثالث - الفئة والسعر والنموذج */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <TextField
                select
                sx={{ flex: 1, minWidth: 250 }}
                label="The Category"
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
                label="Price"
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

            {/* الصف الرابع - النموذج */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <TextField
                sx={{ flex: 1, minWidth: 250 }}
                label="Model"
                name="model"
                type="number"
                value={formik.values.model}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.model && Boolean(formik.errors.model)}
                helperText={formik.touched.model && formik.errors.model}
                required
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
                <TextField {...params} label="Tags" placeholder="Add Tags" />
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
                  "Save Changes"
                )}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/dashboard/products")}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProduct;
