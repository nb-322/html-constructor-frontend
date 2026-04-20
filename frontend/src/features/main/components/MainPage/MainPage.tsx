import Logout from "../../../auth/components/Logout/Logout.tsx";
import {useAuth} from "../../../../contexts/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import './MainPage.css';

const MainPage = () => {
    const user = useAuth()
    const navigate = useNavigate();
    if (user) {
        console.log(user);
    }
    return (
        <div className="main-page">
            <div className="sidebar">
                <div className="user-info">
                    <p>Роль: {user.user?.role}</p>
                    <p>Имя: {user.user?.name}</p>
                </div>
                <Logout/>
            </div>
            <div className="content">
                <button className="add-button" onClick={()=> navigate('/editor')}>+</button>
            </div>
        </div>
    );
};

export default MainPage;