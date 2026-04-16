import { createBrowserRouter } from "react-router";
import { FocusPage } from "./pages/FocusPage";
import { CustomizationPage } from "./pages/CustomizationPage";
import { ProgressPage } from "./pages/ProgressPage";
import { SettingsPage } from "./pages/SettingsPage";
import { BlockedPage } from "./pages/BlockedPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: FocusPage,
  },
  {
    path: "/customize",
    Component: CustomizationPage,
  },
  {
    path: "/progress",
    Component: ProgressPage,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
  {
    path: "/blocked",
    Component: BlockedPage,
  },
]);
