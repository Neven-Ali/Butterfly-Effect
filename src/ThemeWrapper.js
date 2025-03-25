// // src/ThemeWrapper.js
// import React from "react";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import { useTranslation } from "react-i18next";

// const ThemeWrapper = ({ children }) => {
//   const { i18n } = useTranslation();

//   const theme = createTheme({
//     direction: i18n.language === "ar" ? "rtl" : "ltr",
//   });

//   return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
// };

// export default ThemeWrapper;