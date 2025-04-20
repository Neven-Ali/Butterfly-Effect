// React and Routing
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Form Handling
import { useFormik } from "formik";
import * as Yup from "yup";

// UI Components
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

// Repository
import productsRepository from "../../../../repositories/productsRepository"; // استيراد الـ repository الجديد
///
import { EditProductFormFields } from "./EditProductFormFields";

// الدالة المساعدة خارج المكون
const prepareInitialData = (product = {}) => ({
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

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await productsRepository.getCategories();
      setCategories(categoriesData);
      setCategoriesLoading(false);
    } catch (error) {
      setError(error.message);
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /////
  const fetchProduct = useCallback(async () => {
    try {
      const product = await productsRepository.getProductById(id);
      setProductDetails(product);
      setInitialProductData(prepareInitialData(product));
    } catch (error) {
      setError("Error fetching product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ⚠️ يعاد التنفيذ فقط إذا تغير `id`

 

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

        
        await productsRepository.updateProduct(id, requestBody);
        setSuccess(true);
        setTimeout(() => navigate("/dashboard/products"), 1000);
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
          <EditProductFormFields
            formik={formik}
            categories={categories}
            availableTags={availableTags}
            navigate={navigate}
          />
        </form>
      </Paper>
    </Container>
  );
};

export default EditProduct;
