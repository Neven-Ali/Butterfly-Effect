import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
////////////
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Current Password is required"),
  new_password: Yup.string()
    .min(8, "New Password must be at least 8 characters")
    .notOneOf(
      [Yup.ref("password"), null],
      "New Password must be different from the current password"
    )
    .required("New Password is required"),
});

const ResetPassword = () => {
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
          backgroundColor: "#f5f5f5",
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5">
          {t("Reset Password")}
        </Typography>
        <Formik
          initialValues={{
            password: "",
            new_password: "",
          }}
          validationSchema={ResetPasswordSchema}
          onSubmit={(values) => {
            console.log("Submitted values:", values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                margin="normal"
                fullWidth
                name="password"
                label={t("Current Password")}
                type="password"
                id="password"
                autoComplete="current-password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
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

export default ResetPassword;
