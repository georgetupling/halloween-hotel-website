import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import MenuAppBar from "./components/MenuAppBar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
]);

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MenuAppBar />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
