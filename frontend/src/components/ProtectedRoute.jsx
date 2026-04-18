/* Thiết lập rào bảo vệ không cho người dùng chưa xác thực thông qua
 * log in/ sign in có thể tiếp cận sau hơn vào các dịch vụ yêu cầu
 * thông tin người dùng
 * để sử dụng, đảm bảo
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/userAuthenticateContext";


export const ProtectedRoute = ({children}) => {
    const {isAuthenticated, loading} = useAuth()
 
    if (loading) return <div>Is Checking</div>

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />
    }

    return children
}