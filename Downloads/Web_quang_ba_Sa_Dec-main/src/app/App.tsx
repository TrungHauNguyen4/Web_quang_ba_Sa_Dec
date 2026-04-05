import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { PageLoader } from "./components/PageLoader";
import { router } from "./routes";

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
