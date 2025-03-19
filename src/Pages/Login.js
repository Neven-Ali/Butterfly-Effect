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
import axios from "axios";
import { useNavigate } from "react-router-dom";

// تعريف Yup schema للتحقق من صحة البيانات
const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
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

const Login = () => {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = React.useState(false); // حالة فتح/إغلاق popup
  const [errorMessage, setErrorMessage] = React.useState(""); // رسالة الخطأ
  const [loading, setLoading] = React.useState(false); // حالة التحميل

  // إغلاق popup
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  // معالجة تسجيل الدخول
  const handleLogin = async (values) => {
    setLoading(true); // بدء التحميل
    try {
      const response = await axios.post(
        "https://daaboul.nasayimhalab.com/api/account/login/",
        values
      );
      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
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
          backgroundColor: "#f5f5f5",
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ errors, touched }) => (
            <Form>
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
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading} // تعطيل الزر أثناء التحميل
              >
                {loading ? ( // عرض CircularProgress أثناء التحميل
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Form>
          )}
        </Formik>

        {/* رابط "Don't have an account yet?" */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account yet?
          <Link href="/register" underline="hover">
            Sign up
          </Link>
        </Typography>

        {/* رابط "Forgot password?" */}
        <Typography variant="body2" sx={{ mt: 1 }}>
          <Link href="/resetPassword" underline="hover">
            Forgot password?
          </Link>
        </Typography>
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

export default Login;
