import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import Login from "../modules/auth/login/Login";
import Register from "../modules/auth/register/Register";
import NotFound from "../modules/errors/pages/NotFound"
import Products from "../modules/products/Products";
import Stats from "../modules/stats/Stats";
import Marketing from "../modules/marketing/Marketing";


export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
            </Route>
            <Route element={<MainLayout />}>
                <Route path="/" element="testing" />
                <Route path="/products" element={<PrivateRoute><Products/></PrivateRoute>} />
                <Route path="/stats" element={<PrivateRoute><Stats/></PrivateRoute>} />
                <Route path="/marketing" element={<PrivateRoute><Marketing/></PrivateRoute>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}