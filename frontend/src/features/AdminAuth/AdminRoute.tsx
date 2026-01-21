import { Navigate,Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const AdminRoute = () => {
    const {admin} = useSelector((state: RootState) => state.adminAuth);

    return admin ? <Outlet /> : <Navigate to="/admin/login" />;
}

export default AdminRoute;