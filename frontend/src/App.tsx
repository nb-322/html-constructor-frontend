import { useAuth } from "./contexts/AuthContext";
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./features/auth/components/ProtectedRoute/ProtectedRoute.tsx";
import Editor from "./features/editor/components/Editor/Editor.tsx";
import Auth from "./features/auth/components/Auth/Auth.tsx";
import Register from "./features/auth/components/Register/Register.tsx";
import MainPage from "./features/main/components/MainPage/MainPage.tsx";

function App() {
    const { user, isLoading } = useAuth();

    return (<div >
        <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/editor"
                element={
                    <ProtectedRoute user={user} isLoading={isLoading}>
                        <Editor />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/*"
                element={
                    <ProtectedRoute user={user} isLoading={isLoading}>
                        <MainPage/>
                    </ProtectedRoute>
                }
            />
        </Routes>
        </div>
    );
}
export default App;