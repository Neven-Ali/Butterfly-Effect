// src/components/Footer.js
import React from "react";
import { Box, Typography, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
const Footer = () => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        py: 3,
        mt: "auto",
        width: "100%",
        position: "fixed", // التعديل الأساسي
        bottom: 0, // يلصق بالأسفل
        left: 0,
        zIndex: 100, // يضمن ظهوره فوق المحتوى
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          {t(" © 2025 My Website. All rights reserved.")}
        </Typography>
        <Typography variant="body2" align="center">
          {t("Made with ❤️ by Me")}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
