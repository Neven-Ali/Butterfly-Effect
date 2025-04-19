import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinks = [
    { title: t("Home"), path: "/dashboard/home" },
    { title: t("About"), path: "/dashboard/about" },
    { title: t("Contact Us"), path: "/dashboard/contact" },
  ];

  const drawerItems = [
    { title: t("Products"), path: "/dashboard/products" },
    { title: t("Images"), path: "/dashboard/images" },
    { title: t("Favorites"), path: "/dashboard/favorites" },
    { title: t("Requests"), path: "/dashboard/requests" },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  // تحديد اتجاه الـ Drawer بناءً على اللغة
  const drawerAnchor = language === "ar" ? "right" : "left";

  return (
    <>
      <AppBar position="static" dir={language === "ar" ? "rtl" : "ltr"}>
        <Container>
          <Toolbar>
            <IconButton
              edge={language === "ar" ? "end" : "start"}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{
                mr: language === "ar" ? 0 : 2,
                ml: language === "ar" ? 2 : 0,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              {t("welcome")}
            </Typography>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                color="inherit"
                component={Link}
                to={link.path}
              >
                {link.title}
              </Button>
            ))}
            <Button color="inherit" onClick={changeLanguage}>
              {language === "en" ? "Arabic" : "الانجليزية"}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor={drawerAnchor}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {drawerItems.map((item) => (
              <ListItem
                button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  textAlign: language === "ar" ? "right" : "left",
                  direction: language === "ar" ? "rtl" : "ltr",
                }}
              >
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
