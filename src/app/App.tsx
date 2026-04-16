import { RouterProvider } from "react-router";
import { router } from "./routes";
import { TimerProvider } from "./context/TimerContext";
import { Toaster } from "sonner";

export default function App() {
  return (
    <TimerProvider>
      <RouterProvider router={router} />
      <Toaster theme="dark" position="top-center" />
    </TimerProvider>
  );
}
