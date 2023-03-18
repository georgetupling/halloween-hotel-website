import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Home from "./pages/Home";
import ErrorPage from "./pages/ErrorPage";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import MenuAppBar from "./components/MenuAppBar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LogIn />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
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
