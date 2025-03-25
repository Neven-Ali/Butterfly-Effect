import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";

// const Navbar = () => {
//   const [lng, setLng] = useState("en");
//   const { t, i18n } = useTranslation();

//   const handleChangeLanguage = () => {
//     if (lng == "en") {
//       setLng("ar");
//       i18n.changeLanguage("ar");
//     } else {
//       setLng("en");
//       i18n.changeLanguage("en");
//     }
//   };

//   return (
//     <AppBar position="static">
//       <Container>
//         <Toolbar>
//           <Typography variant="h6" style={{ flexGrow: 1 }}>
//             {t("welcome")}
//           </Typography>
//           <Button color="inherit" onClick={() => handleChangeLanguage()}>
//             {lng == "en" ? "Arabic" : "انجليزي"}
//           </Button>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// };
const Navbar = () => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const navLinks = [
    { title: t("Home"), path: "/" },
    { title: t("Products"), path: "/products" },
    { title: t("About"), path: "/about" },
    { title: t("Contact Us"), path: "/contact" },
  ];
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {t("welcome")}
          </Typography>
          {navLinks.map((link) => (
            <Button key={link.path} color="white" href={link.path}>
              {link.title}
            </Button>
          ))}
          <Button color="white" onClick={changeLanguage}>
            {language === "en" ? "Arabic" : "الانجليزية"}
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
