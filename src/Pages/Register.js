import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Modal,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../repositories/authRepository"; // استيراد وظيفة التسجيل

// تعريف مخطط التحقق من صحة البيانات باستخدام Yup
const SignUpSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  last_name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  username: Yup.string().email("Invalid email address").required("Required"),
  password1: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  password2: Yup.string()
    .oneOf([Yup.ref("password1"), null], "Passwords must match")
    .required("Required"),
});

// مكون Popup مخصص
const Popup = ({ open, onClose, message }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Alert severity="error" onClose={onClose}>
          {message}
        </Alert>
      </Box>
    </Modal>
  );
};
const Register = () => {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = React.useState(false); // حالة فتح/إغلاق popup
  const [errorMessage, setErrorMessage] = React.useState(""); // رسالة الخطأ
  const [loading, setLoading] = React.useState(false); // حالة التحميل

  // إغلاق popup
  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  // معالجة التسجيل
  const handleRegister = async (values) => {
    setLoading(true); // بدء التحميل
    try {
      await register(values); // استدعاء وظيفة تسجيل الدخول من الـ repository
      navigate("/home"); // الانتقال إلى الصفحة الرئيسية بعد تسجيل الدخول
    } catch (error) {
      setErrorMessage(error.message || "Login failed"); // عرض رسالة الخطأ
      setOpenPopup(true); // فتح popup عند وجود خطأ
    } finally {
      setLoading(false); // إيقاف التحميل بغض النظر عن النتيجة
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            username: "",
            password1: "",
            password2: "",
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleRegister}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="firstName"
                label="First Name"
                name="first_name"
                autoComplete="given-name"
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
              />
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="lastName"
                label="Last Name"
                name="last_name"
                autoComplete="family-name"
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
              />
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                name="password1"
                label="Password"
                type="password"
                id="password1"
                autoComplete="new-password"
                error={touched.password1 && Boolean(errors.password1)}
                helperText={touched.password1 && errors.password1}
              />
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                autoComplete="new-password"
                error={touched.password2 && Boolean(errors.password2)}
                helperText={touched.password2 && errors.password2}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? ( // عرض CircularProgress أثناء التحميل
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  " Sign Up"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
      {/* Popup لعرض رسالة الخطأ */}
      <Popup
        open={openPopup}
        onClose={handleClosePopup}
        message={errorMessage}
      />
    </Container>
  );
};

export default Register;
