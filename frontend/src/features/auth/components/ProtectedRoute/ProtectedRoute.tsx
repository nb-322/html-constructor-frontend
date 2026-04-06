import { Navigate } from "react-router-dom";
import type {JSX} from "react";
import type {AuthUser} from "../../../../api/types.ts";

interface Props {
    user: AuthUser | null;
    isLoading: boolean;
    children: JSX.Element;
}

const ProtectedRoute = ({ user, isLoading, children }: Props) => {
    // Показываем загрузку во время проверки токена
    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Если авторизован, показываем защищенный контент
    return children;
};

export default ProtectedRoute;