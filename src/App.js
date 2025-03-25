import AppRoutes from "./AppRoutes";
import "./i18n";
// import ThemeWrapper from "./ThemeWrapper";
import { LanguageProvider } from "./contexts/LanguageContext";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Footer from "./components/Footer";
function App() {
  ////// من أجل اللغة
  // const { i18n } = useTranslation();

  // useEffect(() => {
  //   document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  // }, [i18n.language]);

  // const theme = createTheme({
  //   direction: i18n.language === "ar" ? "rtl" : "ltr",
  // });
  return (
    <div>
      <LanguageProvider>
        <Navbar />
        <AppRoutes />
        {/* <ThemeProvider theme={theme}> </ThemeProvider> */}
        <Footer/>
      </LanguageProvider>
    </div>
  );
}

export default App;
