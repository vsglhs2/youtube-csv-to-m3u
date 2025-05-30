import ImportPage from "@/pages/import";
import ImportsPage from "@/pages/imports";
import NotFoundPage from "@/pages/notfound";
import PickerPage from "@/pages/picker";
import type { FC } from "react"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router"
import { AppLayout } from "./layout";
import { urls } from "./urls";

const routes = createRoutesFromElements(
    <Route element={<AppLayout />}>
        <Route path={urls.picker} element={<PickerPage />} />
        <Route path={urls.import()} element={<ImportPage />} />
        <Route path={urls.imports} element={<ImportsPage />} />
        <Route path={urls.rest} element={<NotFoundPage />} />
    </Route>
);

const router = createBrowserRouter(routes);

export const App: FC = () => {
    return (
        <RouterProvider router={router} />
    );
};
