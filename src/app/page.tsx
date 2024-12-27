//این خط مشخص می‌کند که این فایل در محیط کلاینت اجرا می‌شود.
"use client";
import React, { useState } from "react";
import Lottie from "react-lottie-player";
import Calculatoricon from "./lottie/Calculatoricon.json";
import Calculator from "./calculator/page";
import AgeCalculator from "./AgeCalculator/page";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface Props {
  window?: () => Window;
}

export default function Home(props: Props) {
  const drawerWidth = 240;
  const navItems = ["ماشین حساب", "محاسبه سن"];

  const [selectedComponent, setSelectedComponent] = useState<
    "calculator" | "ageCalculator" | "none"
  >("none");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleNavItemClick = (item: string) => {
    if (item === "ماشین حساب") {
      setSelectedComponent("calculator");
    } else if (item === "محاسبه سن") {
      setSelectedComponent("ageCalculator");
    } else {
      setSelectedComponent("none");
    }
    setMobileOpen(false); // بستن منو در موبایل
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => handleNavItemClick(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: darkMode ? "#14193D" : "#e6c9fe",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon
              sx={{
                backgroundColor: darkMode ? "#14193D" : "#e6c9fe",
                color: darkMode ? "#ffffff" : "#000000",
              }}
            />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Lottie
              loop
              animationData={Calculatoricon}
              play
              style={{ width: 90, height: 90 }}
              title="CALCULATOR SITE"
            />
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: darkMode ? "#ffffff" : "#000000",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#DABFE3",
                    color: "#7A03A1",
                  },
                }}
                onClick={() => handleNavItemClick(item)}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          position: "relative",
          top: "110px",
          left: 18,
          padding: "4px",
          // تنظیمات ریسپانسیو
          "@media (max-width: 768px)": {
            top: "70px", // در صفحه‌های کوچک‌تر
          },
          "@media (max-width: 480px)": {
            position: "absolute",
            top: "8px", // فاصله از بالا
            left: "20.5rem", // فاصله از راست
            zIndex: 1300, // بالاترین اولویت
          },
        }}
      >
        <button
          onClick={toggleDarkMode}
          className={`${
            darkMode ? "bg-gray-700  text-white" : "bg-gray-200  text-black"
          } p-2 pr-3 pl-2.5 rounded-3xl`}
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </Box>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box
        component="main"
        sx={{
          p: 3,
          backgroundColor: darkMode ? "#1B1F3E" : "#f5f5f5",
          color: darkMode ? "#ffffff" : "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {selectedComponent === "calculator" && (
          <Calculator darkMode={darkMode} />
        )}
        {selectedComponent === "ageCalculator" && (
          <AgeCalculator darkMode={darkMode} />
        )}
      </Box>
    </Box>
  );
}
