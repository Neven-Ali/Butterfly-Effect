// src/pages/Home.js
import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h2" align="center" gutterBottom>
          {t("welcome")}
        </Typography>
        <Typography variant="body1" align="center">
          This is the home page content. You can add more sections here.
        </Typography>
      </Container>
    </Box>
  );
};

export default Home;