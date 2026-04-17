import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Account from "../pages/Account";
import { ProtectedRoute } from "./ProtectedRoute";
import { Onboarding } from "../pages/Onboarding";
import { PublicRoute } from "./PublicRoute";
import Goals from "../pages/Goals";
import WaterGoal from "../pages/WaterGoal";
import SleepGoal from "../pages/SleepGoal";
import WorkoutGoal from "../pages/WorkoutGoal";
import TasksGoal from "../pages/TasksGoal";
import Meals from "../pages/Meals";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: "sign-in", element: <SignIn /> },
          { path: "sign-up", element: <SignUp /> },
        ],
      },

      { path: "onboarding", element: <Onboarding /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "account", element: <Account /> },
          {
            path: "goals",
            children: [
              { index: true, element: <Goals /> },
              { path: "water", element: <WaterGoal /> },
              { path: "sleep", element: <SleepGoal /> },
              { path: "workout", element: <WorkoutGoal /> },
              { path: "tasks", element: <TasksGoal /> },
            ],
          },
          { path: "meals", element: <Meals /> },
        ],
      },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
