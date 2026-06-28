import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { MainLayout } from "./components/Layouts/MainLayout";
import { Home } from "./pages/Home";
import { FetchOld } from "./pages/FetchOld";
import { FetchRQ } from "./pages/FetchRQ";

import "./App.css";
import { FetchIndv } from "./components/UI/FetchIndv";
import { InfiniteScroll } from "./pages/InfiniteScroll";

// Create a router
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/trad",
        element: <FetchOld />,
      },
      {
        path: "/rq",
        element: <FetchRQ />,
      },
      {
        path: "/rq/:id",
        element: <FetchIndv />,
      },
      {
        path: "/infinite",
        element: <InfiniteScroll />,
      },
    ],
  },
]);

const App = () => {
  const queryClient = new QueryClient(); // QueryClient -> Object contains cache, background refetching, data-sync etc

  return (
    <QueryClientProvider client={queryClient}>
      {/* QueryClientProvider -> Provide query client to the entire application*/}
      <RouterProvider router={router}></RouterProvider>{" "}
      {/* RouterProvider -> Provide router to the entire application*/}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
