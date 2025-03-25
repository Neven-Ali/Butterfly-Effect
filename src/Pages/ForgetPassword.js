import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
////////////
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
// تعريف مخطط التحقق من صحة البيانات باستخدام Yup
const ForgetPasswordSchema = Yup.object().shape({
  username: Yup.string()
    .email("Invalid email address")
    .required("Username is required"),
  code: Yup.string()
    .length(6, "Code must be exactly 6 characters") // افترضنا أن الكود مكون من 6 أحرف
    .required("Code is required"),
  new_password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New Password is required"),
});

const ForgetPassword = () => {
  //////  من أجل اللغة
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f5f5f5", // لون خلفية
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5">
          {t("Forget Password")}
        </Typography>
        <Formik
          initialValues={{
            username: "",
            code: "",
            new_password: "",
          }}
          validationSchema={ForgetPasswordSchema}
          onSubmit={(values) => {
            console.log("Submitted values:", values); // يمكنك استبدال هذا بإرسال البيانات إلى الخادم
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="username"
                label={t("Username")}
                name="username"
                autoComplete="username"
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
              />
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                id="code"
                label={t("Verification Code")}
                name="code"
                autoComplete="off"
                error={touched.code && Boolean(errors.code)}
                helperText={touched.code && errors.code}
              />
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                name="new_password"
                label={t("New Password")}
                type="password"
                id="new_password"
                autoComplete="new-password"
                error={touched.new_password && Boolean(errors.new_password)}
                helperText={touched.new_password && errors.new_password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {t("Reset Password")}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ForgetPassword;
