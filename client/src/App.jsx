// src/App.jsx
import React, { createContext, useState, useEffect } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Outlet } from "react-router-dom";
import { scheduleTokenRefresh, clearTokenRefresh } from './utils/tokenService';

// Optional: If you want a context for toggling the sidebar
export const ToggledContext = createContext(null);

//function App() {

  const App = () => {
    useEffect(() => {
      scheduleTokenRefresh();
  
      return () => {
        clearTokenRefresh();
      };
    }, []);

  // 1) Get the theme and colorMode objects from our custom hook
  const [theme, colorMode] = useMode();

  // 2) Manage your local toggled state for the sidebar
  const [toggled, setToggled] = useState(false);
  const values = { toggled, setToggled };

  return (
    // 3) Provide the toggleColorMode function to children
    <ColorModeContext.Provider value={colorMode}>
      {/* 4) Provide the custom theme to MUI components */}
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* 5) Provide any other custom context as needed */}
        <ToggledContext.Provider value={values}>
          <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
            <SideBar />
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxWidth: "100%",
              }}
            >
              <Navbar />
              {/* The Outlet will render child routes, e.g. your Login page */}
              <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
