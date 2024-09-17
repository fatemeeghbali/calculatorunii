"use client";
import React, { useState } from "react";
import Lottie from "react-lottie-player";
import Calculatoricon from "./lottie/Calculatoricon.json";
import Calculator from "./calculator/page";
// فرض کنید این کامپوننت رو دارید
import AgeCalculator from "./AgeCalculator/page";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface Props {
  window?: () => Window;
}

export default function Example(props: Props) {
  const drawerWidth = 240;
  const navItems = ["ماشین حساب", "محاسبه سن"];

  // مدیریت وضعیت انتخاب شده
  const [selectedComponent, setSelectedComponent] = useState<
    "calculator" | "ageCalculator" | "none"
  >("none");

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
          backgroundColor: "#e6c9fe",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          ></IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Lottie
              loop
              animationData={Calculatoricon}
              play
              style={{ width: 100, height: 100 }}
              title="CALCULATOR SITE"
            />
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: "#000000",
                  fontSize: "1rem",
                  "&:hover": { backgroundColor: "#DABFE3", color: "#7A03A1" },
                }}
                onClick={() => handleNavItemClick(item)}
              >
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
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
          p: 14,
          marginLeft: 6,
          marginTop: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        {/* انتخاب کامپوننت مناسب بر اساس وضعیت انتخاب شده */}
        {/* <div className="block py-2 px-3 md:p-0  rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-pink-500 md:dark:hover:text-pink-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"> */}
        {selectedComponent === "calculator" && <Calculator />}
        {/* </div> */}
        {selectedComponent === "ageCalculator" && (
          <>
            <AgeCalculator />
          </>
        )}
      </Box>
    </Box>
  );
}
