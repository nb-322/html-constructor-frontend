import { useAuth } from "./contexts/AuthContext";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./features/auth/components/ProtectedRoute/ProtectedRoute.tsx";
import Editor from "./features/editor/components/Editor/Editor.tsx";
import Auth from "./features/auth/components/Auth/Auth.tsx";
import Register from "./features/auth/components/Register/Register.tsx";

function App() {
    const { user, isLoading } = useAuth();

    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/"
                element={
                    <ProtectedRoute user={user} isLoading={isLoading}>
                        <Editor />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
export default App;