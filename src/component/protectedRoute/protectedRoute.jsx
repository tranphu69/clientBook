import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";

const RoleBaseRouter = (props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector(state => state.account.user);
    const useRole = user.role;
    if(isAdminRoute && useRole === 'ADMIN' || !isAdminRoute && (useRole === "USER" || useRole === "ADMIN")){
        return(<>{props.children}</>)
    }else{
        return(<NotPermitted/>)
    }
}

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated)

    return(
        <>  
            {isAuthenticated === true ?
                <>
                <RoleBaseRouter>{props.children}</RoleBaseRouter>
                </>
                :
                <Navigate to="/login"/>
            }
        </>
    )
}

export default ProtectedRoute;