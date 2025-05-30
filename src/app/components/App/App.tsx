import ImportPage from "@/app/pages/import";
import ImportsPage from "@/app/pages/imports";
import NotFoundPage from "@/app/pages/notfound";
import PickerPage from "@/app/pages/picker";
import type { FC } from "react"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router"
import { AppLayout } from "./Layout";
import { urls } from "@/app/urls";

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
