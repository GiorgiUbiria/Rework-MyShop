import "./App.css";

import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  Link,
  RootRoute,
} from "@tanstack/react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/Home";
import Books from "./pages/Books";
import ErrorPage from "./pages/ErrorPage";
import AddBook from "./pages/AddBook";

const rootRoute = new RootRoute({
  component: () => {
    return (
      <>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{" "}
          <Link
            to="/books"
            activeProps={{
              className: "font-bold",
            }}
          >
            Books
          </Link>
          <Link
            to="/add-book"
            activeProps={{
              className: "font-bold",
            }}
          >
            Add a Book
          </Link>{" "}
        </div>
        <hr />
        <Outlet />
      </>
    );
  },
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const booksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "books",
  component: Books,
  errorComponent: ErrorPage,
});

const addBookRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "add-book",
  component: AddBook,
  errorComponent: ErrorPage,
});

const routeTree = rootRoute.addChildren([indexRoute, booksRoute, addBookRoute]);

const router = new Router({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
