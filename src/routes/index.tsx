import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import Home from "../pages/Home";
// import Dieta from '../pages/Dieta';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      //   {
      //     path: "dieta",
      //     element: <Dieta />,
      //   },
    ],
  },
]);
