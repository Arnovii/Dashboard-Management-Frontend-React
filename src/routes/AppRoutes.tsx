import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import PrivateRoute from "./PrivateRoute";


export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element="login" />
                <Route path="/register" element="register" />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/priv" element={<PrivateRoute><h1>PRIVADO</h1></PrivateRoute>} />
                <Route path="/" element="testing" />
            </Route>
        </Routes>
    )
}